import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import BilingualInput from '../components/BilingualInput';
import ConfirmModal from '../components/ConfirmModal';

const emptyForm = {
  name_en: '', name_ar: '',
  position_en: '', position_ar: '',
  bio_en: '', bio_ar: '',
  email: '', phone: '',
  country: '', region: '',
  label: '', type: '',
  isHQ: false,
  address: '', since: '', team: '', projects: '',
  desc: '',
  lat: '', lng: '',
  isActive: true, order: 0,
};

const REGION_OPTIONS = ['Europe', 'Middle East', 'Asia-Pacific', 'Americas', 'Africa', 'Other'];
const TYPE_OPTIONS = ['Headquarters', 'Regional Office', 'Project Office', 'Partner'];

export default function AgentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    api.get('/agents').then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setForm(emptyForm); setEditing(null);
    setImageFile(null); setImagePreview(''); setError(''); setShowForm(true);
  };

  const openEdit = item => {
    setForm({
      name_en: item.name_en, name_ar: item.name_ar,
      position_en: item.position_en || '', position_ar: item.position_ar || '',
      bio_en: item.bio_en || '', bio_ar: item.bio_ar || '',
      email: item.email || '', phone: item.phone || '',
      country: item.country || '', region: item.region || '',
      label: item.label || '', type: item.type || '',
      isHQ: item.isHQ || false,
      address: item.address || '', since: item.since || '',
      team: item.team || '', projects: item.projects || '',
      desc: item.desc || '',
      lat: item.lat ?? '', lng: item.lng ?? '',
      isActive: item.isActive, order: item.order,
    });
    setImageFile(null); setImagePreview(item.image || '');
    setEditing(item._id); setError(''); setShowForm(true);
  };

  const closeForm = () => {
    if (imageFile) URL.revokeObjectURL(imagePreview);
    setShowForm(false);
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (imageFile) URL.revokeObjectURL(imagePreview);
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('image', imageFile);

      if (editing) {
        const res = await api.put(`/agents/${editing}`, data);
        setItems(items.map(i => i._id === editing ? res.data : i));
      } else {
        const res = await api.post('/agents', data);
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
      await api.delete(`/agents/${deleteId}`);
      setItems(items.filter(i => i._id !== deleteId));
      setDeleteId(null);
    } catch { alert('Error deleting'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#071525]">Agents</h1>
          <p className="text-sm text-[#5A7896] mt-0.5">{items.length} agents</p>
        </div>
        <button onClick={openAdd}
          className="bg-[#1A6FDB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition">
          + Add Agent
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
              <p className="text-4xl mb-3">◉</p>
              <p className="font-medium">No agents yet</p>
            </div>
          ) : items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm p-4 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F2F6FC] flex-shrink-0 overflow-hidden">
                {item.image
                  ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-[#5A7896] text-xl font-bold">
                      {item.name_en?.[0] || '?'}
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#071525] truncate">{item.name_en}</p>
                  {item.isHQ && (
                    <span className="text-[10px] font-bold bg-[#071525] text-white px-1.5 py-0.5 rounded">HQ</span>
                  )}
                </div>
                <p className="text-xs text-[#5A7896]" dir="rtl">{item.name_ar}</p>
                {item.country && (
                  <p className="text-xs text-[#1A6FDB] mt-0.5">{item.country}{item.region ? ` · ${item.region}` : ''}</p>
                )}
                {item.type && <p className="text-xs text-[#5A7896] mt-0.5">{item.type}</p>}
                {item.phone && <p className="text-xs text-[#5A7896] mt-0.5 truncate">{item.phone}</p>}
                {(item.lat != null && item.lat !== '') && (
                  <p className="text-xs text-[#8BA5C0] mt-0.5">{item.lat}, {item.lng}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => openEdit(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#1A6FDB] border border-[#1A6FDB]/20 hover:bg-[#1A6FDB]/5 transition">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(item._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="px-6 py-4 border-b border-[#E4EBF5] flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-bold text-[#071525]">{editing ? 'Edit Agent' : 'Add Agent'}</h2>
              <button onClick={closeForm} className="text-[#5A7896] hover:text-[#071525] text-xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>}

              <BilingualInput label="Name" nameEn="name_en" nameAr="name_ar"
                valueEn={form.name_en} valueAr={form.name_ar} onChange={handleChange} required />
              <BilingualInput label="Position / Title" nameEn="position_en" nameAr="position_ar"
                valueEn={form.position_en} valueAr={form.position_ar} onChange={handleChange} />
              <BilingualInput label="Bio" nameEn="bio_en" nameAr="bio_ar"
                valueEn={form.bio_en} valueAr={form.bio_ar}
                onChange={handleChange} multiline rows={3} />

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                    placeholder="agent@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                    placeholder="+1 234 567 890" />
                </div>
              </div>

              {/* Location */}
              <div className="border-t border-[#E4EBF5] pt-5">
                <p className="text-xs font-bold text-[#5A7896] uppercase tracking-widest mb-4">Location & Map</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Country</label>
                    <input type="text" name="country" value={form.country} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="Germany" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Region</label>
                    <select name="region" value={form.region} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
                      <option value="">— Select region —</option>
                      {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                    placeholder="Street, City, Postal Code, Country" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Latitude</label>
                    <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="49.6317" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Longitude</label>
                    <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="8.3575" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Office Type</label>
                    <select name="type" value={form.type} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
                      <option value="">— Select type —</option>
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Label (badge)</label>
                    <input type="text" name="label" value={form.label} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="HQ / Regional / Project" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <input type="checkbox" id="isHQ" name="isHQ" checked={form.isHQ} onChange={handleChange}
                    className="w-4 h-4 accent-[#1A6FDB]" />
                  <label htmlFor="isHQ" className="text-sm font-medium text-[#071525]">Mark as Headquarters</label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Description</label>
                  <textarea name="desc" value={form.desc} onChange={handleChange} rows={3}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] resize-none"
                    placeholder="Short description of this office/agent location…" />
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-[#E4EBF5] pt-5">
                <p className="text-xs font-bold text-[#5A7896] uppercase tracking-widest mb-4">Office Stats</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Since (year)</label>
                    <input type="text" name="since" value={form.since} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="2005" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Team Size</label>
                    <input type="text" name="team" value={form.team} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="18" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Projects</label>
                    <input type="text" name="projects" value={form.projects} onChange={handleChange}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                      placeholder="150+" />
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="border-t border-[#E4EBF5] pt-5">
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="" className="w-16 h-16 object-cover rounded-2xl border border-[#E4EBF5]" />
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 border-2 border-dashed border-[#E4EBF5] rounded-xl text-sm text-[#5A7896] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition">
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

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
                  {saving ? 'Saving…' : (editing ? 'Update Agent' : 'Create Agent')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        message="Permanently delete this agent?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
