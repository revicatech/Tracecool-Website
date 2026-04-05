import { useState, useEffect } from 'react';
import api from '../utils/api';
import BilingualInput from '../components/BilingualInput';
import ConfirmModal from '../components/ConfirmModal';

const empty = { name_en: '', name_ar: '', order: 0, isActive: true };

export default function CategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/categories').then(r => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setForm(empty); setEditing(null); setError(''); setShowForm(true); };
  const openEdit = item => { setForm({ ...item }); setEditing(item._id); setError(''); setShowForm(true); };
  const closeForm = () => setShowForm(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editing) {
        const res = await api.put(`/categories/${editing}`, form);
        setItems(items.map(i => i._id === editing ? res.data : i));
      } else {
        const res = await api.post('/categories', form);
        setItems([res.data, ...items]);
      }
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteId}`);
      setItems(items.filter(i => i._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#071525]">Categories</h1>
          <p className="text-sm text-[#5A7896] mt-0.5">{items.length} categories</p>
        </div>
        <button onClick={openAdd}
          className="bg-[#1A6FDB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition">
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[#5A7896]">
              <p className="text-4xl mb-3">◈</p>
              <p className="font-medium">No categories yet</p>
              <p className="text-sm mt-1">Click "Add Category" to get started</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F2F6FC] border-b border-[#E4EBF5]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase tracking-wide">Name (EN)</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase tracking-wide">Name (AR)</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase tracking-wide">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F6FC]">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-[#F2F6FC]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#071525]">{item.name_en}</td>
                    <td className="px-4 py-3 text-[#5A7896]" dir="rtl">{item.name_ar}</td>
                    <td className="px-4 py-3 text-[#5A7896] font-mono text-xs">{item.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${item.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
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
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-[#E4EBF5] flex items-center justify-between">
              <h2 className="font-bold text-[#071525]">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={closeForm} className="text-[#5A7896] hover:text-[#071525] text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>}
              <BilingualInput
                label="Name"
                nameEn="name_en" nameAr="name_ar"
                valueEn={form.name_en} valueAr={form.name_ar}
                onChange={handleChange} required
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Order</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Status</label>
                  <select name="isActive" value={form.isActive} onChange={handleChange}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB]">
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 border border-[#E4EBF5] text-[#5A7896] py-2 rounded-xl text-sm font-medium hover:bg-[#F2F6FC] transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#1A6FDB] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition disabled:opacity-60">
                  {saving ? 'Saving…' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        message="Delete this category? This will fail if subcategories exist."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
