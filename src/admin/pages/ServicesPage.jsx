import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import BilingualInput from '../components/BilingualInput';
import ConfirmModal from '../components/ConfirmModal';

const emptyForm = {
  title_en: '', title_ar: '',
  description_en: '', description_ar: '',
  shortDesc_en: '', shortDesc_ar: '',
  isActive: true, order: 0,
};

const emptySection = () => ({
  title_en: '', title_ar: '',
  keptImages: [],     // existing image URLs to keep
  newFiles: [],       // File objects
  newPreviews: [],    // blob URLs
  points: [],
});

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [features, setFeatures] = useState([]);
  const [sections, setSections] = useState([]);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const heroRef = useRef();
  const sectionImgRefs = useRef([]);

  const load = () => {
    setLoading(true);
    api.get('/services').then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm); setEditing(null);
    setFeatures([]); setSections([]);
    setHeroFile(null); setHeroPreview('');
    setError(''); setShowForm(true);
  };

  const openEdit = item => {
    setForm({
      title_en: item.title_en, title_ar: item.title_ar,
      description_en: item.description_en, description_ar: item.description_ar,
      shortDesc_en: item.shortDesc_en || '', shortDesc_ar: item.shortDesc_ar || '',
      isActive: item.isActive, order: item.order,
    });
    setFeatures(item.features || []);
    // Convert stored sections into editable state
    setSections((item.sections || []).map(sec => ({
      title_en: sec.title_en || '',
      title_ar: sec.title_ar || '',
      keptImages: sec.images || [],
      newFiles: [],
      newPreviews: [],
      points: sec.points || [],
    })));
    setHeroFile(null); setHeroPreview(item.image || '');
    setEditing(item._id); setError(''); setShowForm(true);
  };

  const closeForm = () => {
    // Revoke all preview URLs
    if (heroFile) URL.revokeObjectURL(heroPreview);
    sections.forEach(sec => sec.newPreviews.forEach(p => URL.revokeObjectURL(p)));
    setShowForm(false);
  };

  // ─── Hero image ───────────────────────────────
  const handleHero = e => {
    const f = e.target.files[0]; if (!f) return;
    if (heroFile) URL.revokeObjectURL(heroPreview);
    setHeroFile(f); setHeroPreview(URL.createObjectURL(f));
  };

  // ─── Features ────────────────────────────────
  const addFeature = () => setFeatures(f => [...f, { feature_en: '', feature_ar: '' }]);
  const removeFeature = idx => setFeatures(f => f.filter((_, i) => i !== idx));
  const updateFeature = (idx, key, val) =>
    setFeatures(f => f.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  // ─── Sections ────────────────────────────────
  const addSection = () => setSections(s => [...s, emptySection()]);
  const removeSection = idx => {
    const sec = sections[idx];
    sec.newPreviews.forEach(p => URL.revokeObjectURL(p));
    // Delete kept images will happen server-side via missing keptImages
    setSections(s => s.filter((_, i) => i !== idx));
  };

  const updateSection = (idx, key, val) =>
    setSections(s => s.map((sec, i) => i === idx ? { ...sec, [key]: val } : sec));

  const addSectionImages = (idx, e) => {
    const files = Array.from(e.target.files);
    const sec = sections[idx];
    const total = sec.keptImages.length + sec.newFiles.length + files.length;
    if (total > 3) { alert('Max 3 images per section'); return; }
    const previews = files.map(f => URL.createObjectURL(f));
    updateSection(idx, 'newFiles', [...sec.newFiles, ...files]);
    updateSection(idx, 'newPreviews', [...sec.newPreviews, ...previews]);
  };

  const removeKeptImage = (sIdx, imgIdx) => {
    const sec = sections[sIdx];
    updateSection(sIdx, 'keptImages', sec.keptImages.filter((_, i) => i !== imgIdx));
  };

  const removeNewImage = (sIdx, imgIdx) => {
    const sec = sections[sIdx];
    URL.revokeObjectURL(sec.newPreviews[imgIdx]);
    updateSection(sIdx, 'newFiles', sec.newFiles.filter((_, i) => i !== imgIdx));
    updateSection(sIdx, 'newPreviews', sec.newPreviews.filter((_, i) => i !== imgIdx));
  };

  const addPoint = idx => updateSection(idx, 'points', [...sections[idx].points, { point_en: '', point_ar: '' }]);
  const removePoint = (sIdx, pIdx) =>
    updateSection(sIdx, 'points', sections[sIdx].points.filter((_, i) => i !== pIdx));
  const updatePoint = (sIdx, pIdx, key, val) =>
    updateSection(sIdx, 'points', sections[sIdx].points.map((p, i) =>
      i === pIdx ? { ...p, [key]: val } : p));

  // ─── Submit ──────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append('features', JSON.stringify(features));

      if (heroFile) data.append('image', heroFile);

      // Build sections_meta (everything except File objects)
      const sectionsMeta = sections.map(sec => ({
        title_en: sec.title_en,
        title_ar: sec.title_ar,
        keptImages: sec.keptImages,
        points: sec.points,
      }));
      data.append('sections_meta', JSON.stringify(sectionsMeta));

      // Append new section images with dynamic field names
      sections.forEach((sec, si) => {
        sec.newFiles.forEach((file, ii) => {
          data.append(`section_img_${si}_${ii}`, file);
        });
      });

      if (editing) {
        const res = await api.put(`/services/${editing}`, data);
        setItems(items.map(i => i._id === editing ? res.data : i));
      } else {
        const res = await api.post('/services', data);
        setItems([res.data, ...items]);
      }
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/services/${deleteId}`);
      setItems(items.filter(i => i._id !== deleteId));
      setDeleteId(null);
    } catch { alert('Error deleting'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#071525]">Services</h1>
          <p className="text-sm text-[#5A7896] mt-0.5">{items.length} services</p>
        </div>
        <button onClick={openAdd}
          className="bg-[#1A6FDB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition">
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-[#5A7896] bg-white rounded-2xl border border-[#E4EBF5]">
              <p className="text-4xl mb-3">◈</p>
              <p className="font-medium">No services yet</p>
            </div>
          ) : items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm overflow-hidden">
              {item.image && <img src={item.image} alt="" className="w-full h-36 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold text-[#071525]">{item.title_en}</h3>
                <p className="text-xs text-[#5A7896] mt-0.5" dir="rtl">{item.title_ar}</p>
                <p className="text-xs text-[#5A7896] mt-2 line-clamp-2">{item.shortDesc_en || item.description_en}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-xs text-[#5A7896]">{item.sections?.length || 0} sections</span>
                  <span className="text-[#E4EBF5]">·</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${item.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(item)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1A6FDB] border border-[#1A6FDB]/20 hover:bg-[#1A6FDB]/5 transition">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(item._id)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Form Modal ─────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">

            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E4EBF5] flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-bold text-[#071525]">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={closeForm} className="text-[#5A7896] hover:text-[#071525] text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

              {/* Basic info */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#071525] uppercase tracking-widest">Basic Info</p>
                <BilingualInput label="Title" nameEn="title_en" nameAr="title_ar"
                  valueEn={form.title_en} valueAr={form.title_ar} onChange={handleChange} required />
                <BilingualInput label="Short Description" nameEn="shortDesc_en" nameAr="shortDesc_ar"
                  valueEn={form.shortDesc_en} valueAr={form.shortDesc_ar} onChange={handleChange} />
                <BilingualInput label="Full Description" nameEn="description_en" nameAr="description_ar"
                  valueEn={form.description_en} valueAr={form.description_ar}
                  onChange={handleChange} required multiline rows={3} />
              </div>

              {/* Hero image */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#071525] uppercase tracking-widest">Hero Image</p>
                <div className="flex items-center gap-4">
                  {heroPreview && (
                    <img src={heroPreview} alt="" className="w-28 h-20 object-cover rounded-xl border border-[#E4EBF5]" />
                  )}
                  <button type="button" onClick={() => heroRef.current?.click()}
                    className="px-4 py-2 border-2 border-dashed border-[#E4EBF5] rounded-xl text-sm text-[#5A7896] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition">
                    {heroPreview ? 'Change Image' : 'Upload Hero Image'}
                  </button>
                </div>
                <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={handleHero} />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#071525] uppercase tracking-widest">Key Features</p>
                  <button type="button" onClick={addFeature}
                    className="text-xs text-[#1A6FDB] font-semibold hover:underline">+ Add Feature</button>
                </div>
                {features.map((f, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input value={f.feature_en} placeholder="Feature (English)"
                        onChange={e => updateFeature(idx, 'feature_en', e.target.value)}
                        className="border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]" />
                      <input value={f.feature_ar} placeholder="الميزة (عربي)" dir="rtl"
                        onChange={e => updateFeature(idx, 'feature_ar', e.target.value)}
                        className="border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]" />
                    </div>
                    <button type="button" onClick={() => removeFeature(idx)}
                      className="mt-1 text-red-400 hover:text-red-600 text-xl leading-none">×</button>
                  </div>
                ))}
                {features.length === 0 && <p className="text-sm text-[#5A7896] italic">No features yet.</p>}
              </div>

              {/* ── SECTIONS ─────────────────────────────────── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#071525] uppercase tracking-widest">
                    Page Sections ({sections.length})
                  </p>
                  <button type="button" onClick={addSection}
                    className="bg-[#071525] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1A6FDB] transition">
                    + Add Section
                  </button>
                </div>

                {sections.length === 0 && (
                  <div className="border-2 border-dashed border-[#E4EBF5] rounded-xl p-6 text-center text-[#5A7896]">
                    <p className="text-sm">No sections yet. Click "Add Section" to build the service page.</p>
                  </div>
                )}

                {sections.map((sec, sIdx) => (
                  <div key={sIdx} className="border border-[#E4EBF5] rounded-2xl overflow-hidden">
                    {/* Section header */}
                    <div className="bg-[#F2F6FC] px-4 py-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#071525]">Section {sIdx + 1}</span>
                      <button type="button" onClick={() => removeSection(sIdx)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Section title */}
                      <BilingualInput
                        label="Section Title"
                        nameEn={`sec_${sIdx}_title_en`} nameAr={`sec_${sIdx}_title_ar`}
                        valueEn={sec.title_en} valueAr={sec.title_ar}
                        onChange={e => {
                          const key = e.target.name.endsWith('_en') ? 'title_en' : 'title_ar';
                          updateSection(sIdx, key, e.target.value);
                        }}
                      />

                      {/* Section images (up to 3) */}
                      <div>
                        <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-2">
                          Images (max 3)
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {sec.keptImages.map((img, iIdx) => (
                            <div key={`kept-${iIdx}`} className="relative group w-20 h-20">
                              <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-[#E4EBF5]" />
                              <button type="button" onClick={() => removeKeptImage(sIdx, iIdx)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                ×
                              </button>
                            </div>
                          ))}
                          {sec.newPreviews.map((preview, iIdx) => (
                            <div key={`new-${iIdx}`} className="relative group w-20 h-20">
                              <img src={preview} alt="" className="w-full h-full object-cover rounded-xl border-2 border-[#1A6FDB]" />
                              <button type="button" onClick={() => removeNewImage(sIdx, iIdx)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                ×
                              </button>
                            </div>
                          ))}
                          {sec.keptImages.length + sec.newFiles.length < 3 && (
                            <button type="button"
                              onClick={() => {
                                sectionImgRefs.current[sIdx] = sectionImgRefs.current[sIdx] || document.createElement('input');
                                const inp = sectionImgRefs.current[sIdx];
                                inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
                                inp.onchange = e => addSectionImages(sIdx, e);
                                inp.click();
                              }}
                              className="w-20 h-20 border-2 border-dashed border-[#E4EBF5] rounded-xl flex flex-col items-center justify-center text-[#5A7896] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition">
                              <span className="text-2xl leading-none">+</span>
                              <span className="text-[10px] mt-0.5">Add</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section points */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-[#5A7896] uppercase tracking-wide">
                            Description Points
                          </label>
                          <button type="button" onClick={() => addPoint(sIdx)}
                            className="text-xs text-[#1A6FDB] font-semibold hover:underline">+ Add Point</button>
                        </div>
                        <div className="space-y-2">
                          {sec.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex gap-2 items-center">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <input value={pt.point_en} placeholder="Point (English)"
                                  onChange={e => updatePoint(sIdx, pIdx, 'point_en', e.target.value)}
                                  className="border border-[#E4EBF5] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#1A6FDB]" />
                                <input value={pt.point_ar} placeholder="النقطة (عربي)" dir="rtl"
                                  onChange={e => updatePoint(sIdx, pIdx, 'point_ar', e.target.value)}
                                  className="border border-[#E4EBF5] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#1A6FDB]" />
                              </div>
                              <button type="button" onClick={() => removePoint(sIdx, pIdx)}
                                className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                            </div>
                          ))}
                          {sec.points.length === 0 && (
                            <p className="text-xs text-[#5A7896] italic">No points yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order / Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Order</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Status</label>
                  <select name="isActive" value={form.isActive} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 border border-[#E4EBF5] text-[#5A7896] py-2.5 rounded-xl text-sm font-medium hover:bg-[#F2F6FC] transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#1A6FDB] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition disabled:opacity-60">
                  {saving ? 'Saving…' : (editing ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        message="Permanently delete this service and all its images?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
