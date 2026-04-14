import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import BilingualInput from '../components/BilingualInput';
import ConfirmModal from '../components/ConfirmModal';

const emptyForm = {
  title_en: '', title_ar: '',
  description_en: '', description_ar: '',
  shortDesc_en: '', shortDesc_ar: '',
  category: '', subcategory: '',
  catalogPdf: '',
  isActive: true, order: 0,
};

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Filter state
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [features, setFeatures] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/products'), api.get('/categories'), api.get('/subcategories')])
      .then(([p, c, s]) => { setItems(p.data); setCategories(c.data); setSubcategories(s.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Filter subcategories by selected category
  useEffect(() => {
    if (form.category) {
      setFilteredSubs(subcategories.filter(s => (s.category?._id || s.category) === form.category));
    } else {
      setFilteredSubs(subcategories);
    }
  }, [form.category, subcategories]);

  // Derived: filtered + paginated
  const filtered = items.filter(item => {
    if (search && !item.title_en?.toLowerCase().includes(search.toLowerCase()) &&
        !item.title_ar?.includes(search)) return false;
    if (filterCat && (item.category?._id || item.category) !== filterCat) return false;
    if (filterStatus === 'active' && !item.isActive) return false;
    if (filterStatus === 'inactive' && item.isActive) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm); setEditing(null); setFeatures([]);
    setExistingImages([]); setNewFiles([]); setNewPreviews([]); setError(''); setShowForm(true);
  };

  const openEdit = item => {
    setForm({
      title_en: item.title_en, title_ar: item.title_ar,
      description_en: item.description_en, description_ar: item.description_ar,
      shortDesc_en: item.shortDesc_en || '', shortDesc_ar: item.shortDesc_ar || '',
      category: item.category?._id || item.category || '',
      subcategory: item.subcategory?._id || item.subcategory || '',
      catalogPdf: item.catalogPdf || '',
      isActive: item.isActive, order: item.order,
    });
    setFeatures(item.features || []);
    setExistingImages(item.images || []);
    setNewFiles([]); setNewPreviews([]);
    setEditing(item._id); setError(''); setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); newPreviews.forEach(p => URL.revokeObjectURL(p)); };

  const handleFiles = e => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 10) { alert('Maximum 10 images allowed'); return; }
    setNewFiles(f => [...f, ...files]);
    setNewPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExisting = idx => setExistingImages(imgs => imgs.filter((_, i) => i !== idx));
  const removeNew = idx => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles(f => f.filter((_, i) => i !== idx));
    setNewPreviews(p => p.filter((_, i) => i !== idx));
  };

  const addFeature = () => setFeatures(f => [...f, { feature_en: '', feature_ar: '' }]);
  const removeFeature = idx => setFeatures(f => f.filter((_, i) => i !== idx));
  const updateFeature = (idx, key, val) =>
    setFeatures(f => f.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append('features', JSON.stringify(features));
      if (editing) data.append('keptImages', JSON.stringify(existingImages));
      newFiles.forEach(f => data.append('images', f));

      if (editing) {
        const res = await api.put(`/products/${editing}`, data);
        setItems(items.map(i => i._id === editing ? res.data : i));
      } else {
        const res = await api.post('/products', data);
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
      await api.delete(`/products/${deleteId}`);
      setItems(items.filter(i => i._id !== deleteId));
      setDeleteId(null);
    } catch { alert('Error deleting'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#071525]">Products</h1>
          <p className="text-sm text-[#5A7896] mt-0.5">{filtered.length} of {items.length} products</p>
        </div>
        <button onClick={openAdd}
          className="bg-[#1A6FDB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition">
          + Add Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text" placeholder="Search products…" value={search}
          onChange={e => { setSearch(e.target.value); resetPage(); }}
          className="border border-[#E4EBF5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] min-w-[180px]"
        />
        <select value={filterCat} onChange={e => { setFilterCat(e.target.value); resetPage(); }}
          className="border border-[#E4EBF5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name_en}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); resetPage(); }}
          className="border border-[#E4EBF5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search || filterCat || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterCat(''); setFilterStatus(''); resetPage(); }}
            className="text-xs text-[#5A7896] hover:text-[#071525] border border-[#E4EBF5] rounded-xl px-3 py-2 transition">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#5A7896]">
              <p className="text-4xl mb-3">◻</p>
              <p className="font-medium">{items.length === 0 ? 'No products yet' : 'No products match the filters'}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-[#F2F6FC] border-b border-[#E4EBF5]">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Image</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Title</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F6FC]">
                    {pageItems.map(item => (
                      <tr key={item._id} className="hover:bg-[#F2F6FC]/50">
                        <td className="px-4 py-3">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt="" className="w-12 h-10 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-10 bg-[#F2F6FC] rounded-lg flex items-center justify-center text-[#5A7896] text-xs">—</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#071525]">{item.title_en}</p>
                          <p className="text-xs text-[#5A7896]" dir="rtl">{item.title_ar}</p>
                        </td>
                        <td className="px-4 py-3 text-[#5A7896]">{item.category?.name_en || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${item.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => openEdit(item)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#1A6FDB] border border-[#1A6FDB]/20 hover:bg-[#1A6FDB]/5 transition">
                              Edit
                            </button>
                            <button onClick={() => setDeleteId(item._id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#E4EBF5]">
                  <p className="text-xs text-[#5A7896]">
                    Page {safePage} of {totalPages} · {filtered.length} products
                  </p>
                  <div className="flex gap-1">
                    <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-[#E4EBF5] text-[#5A7896] hover:bg-[#F2F6FC] disabled:opacity-40 disabled:cursor-not-allowed transition">
                      ‹ Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === '…' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-[#5A7896]">…</span>
                        ) : (
                          <button key={p} onClick={() => setPage(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition
                              ${safePage === p
                                ? 'bg-[#1A6FDB] text-white border-[#1A6FDB]'
                                : 'border-[#E4EBF5] text-[#5A7896] hover:bg-[#F2F6FC]'}`}>
                            {p}
                          </button>
                        )
                      )}
                    <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-[#E4EBF5] text-[#5A7896] hover:bg-[#F2F6FC] disabled:opacity-40 disabled:cursor-not-allowed transition">
                      Next ›
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="px-6 py-4 border-b border-[#E4EBF5] flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-bold text-[#071525]">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeForm} className="text-[#5A7896] hover:text-[#071525] text-xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>}

              {/* Titles */}
              <BilingualInput label="Title" nameEn="title_en" nameAr="title_ar"
                valueEn={form.title_en} valueAr={form.title_ar} onChange={handleChange} required />

              {/* Short description */}
              <BilingualInput label="Short Description" nameEn="shortDesc_en" nameAr="shortDesc_ar"
                valueEn={form.shortDesc_en} valueAr={form.shortDesc_ar} onChange={handleChange} />

              {/* Full description */}
              <BilingualInput label="Full Description" nameEn="description_en" nameAr="description_ar"
                valueEn={form.description_en} valueAr={form.description_ar}
                onChange={handleChange} required multiline rows={4} />

              {/* Category / Subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
                    <option value="">None</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name_en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Subcategory</label>
                  <select name="subcategory" value={form.subcategory} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
                    <option value="">None</option>
                    {filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name_en}</option>)}
                  </select>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-2">
                  Images (max 10)
                </label>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-[#E4EBF5]" />
                      <button type="button" onClick={() => removeExisting(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        ×
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((preview, idx) => (
                    <div key={idx} className="relative group w-20 h-20">
                      <img src={preview} alt="" className="w-full h-full object-cover rounded-xl border-2 border-[#1A6FDB]" />
                      <button type="button" onClick={() => removeNew(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        ×
                      </button>
                    </div>
                  ))}
                  {existingImages.length + newFiles.length < 10 && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-[#E4EBF5] rounded-xl flex flex-col items-center justify-center text-[#5A7896] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition">
                      <span className="text-2xl leading-none">+</span>
                      <span className="text-[10px] mt-0.5">Add</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#5A7896] uppercase tracking-wide">Features</label>
                  <button type="button" onClick={addFeature}
                    className="text-xs text-[#1A6FDB] font-medium hover:underline">+ Add Feature</button>
                </div>
                <div className="space-y-3">
                  {features.map((f, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          value={f.feature_en} placeholder="Feature (English)"
                          onChange={e => updateFeature(idx, 'feature_en', e.target.value)}
                          className="border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                        />
                        <input
                          value={f.feature_ar} placeholder="الميزة (عربي)" dir="rtl"
                          onChange={e => updateFeature(idx, 'feature_ar', e.target.value)}
                          className="border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                        />
                      </div>
                      <button type="button" onClick={() => removeFeature(idx)}
                        className="mt-1 text-red-400 hover:text-red-600 text-xl leading-none">×</button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-sm text-[#5A7896] italic">No features added yet.</p>
                  )}
                </div>
              </div>

              {/* Catalogue PDF */}
              <div>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">
                  Catalogue PDF (Google Drive link)
                </label>
                <input
                  type="text"
                  name="catalogPdf"
                  value={form.catalogPdf}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/…"
                  className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]"
                />
                <p className="text-[11px] text-[#5A7896] mt-1">Leave empty to hide the PDF button on the product page.</p>
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
                  {saving ? 'Saving…' : (editing ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        message="Permanently delete this product and its images?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
