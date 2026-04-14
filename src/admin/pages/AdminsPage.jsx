import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const emptyForm = { username: '', name: '', password: '', confirmPassword: '', role: 'admin' };

export default function AdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/admins').then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditing(null); setError(''); setShowForm(true); };
  const openEdit = item => {
    setForm({ username: item.username, name: item.name, password: '', confirmPassword: '', role: item.role });
    setEditing(item._id); setError(''); setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    setSaving(true); setError('');
    try {
      const { confirmPassword, ...payload } = form;
      if (editing && !payload.password) delete payload.password;

      if (editing) {
        const res = await api.put(`/admins/${editing}`, payload);
        setItems(items.map(i => i._id === editing ? res.data : i));
      } else {
        const res = await api.post('/admins', payload);
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
      await api.delete(`/admins/${deleteId}`);
      setItems(items.filter(i => i._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#071525]">Admins</h1>
          <p className="text-sm text-[#5A7896] mt-0.5">{items.length} admin accounts</p>
        </div>
        <button onClick={openAdd}
          className="bg-[#1A6FDB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4D9EFF] transition">
          + Add Admin
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F2F6FC] border-b border-[#E4EBF5]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Username</th>
                <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-[#5A7896] text-xs uppercase">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F6FC]">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-[#F2F6FC]/50">
                  <td className="px-4 py-3 font-medium text-[#071525]">{item.name}</td>
                  <td className="px-4 py-3 text-[#5A7896] font-mono">{item.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${item.role === 'superadmin' ? 'bg-[#1A6FDB]/10 text-[#1A6FDB]' : 'bg-gray-100 text-gray-600'}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5A7896] text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#1A6FDB] border border-[#1A6FDB]/20 hover:bg-[#1A6FDB]/5 transition">
                        Edit
                      </button>
                      {item._id !== currentAdmin?.id && (
                        <button onClick={() => setDeleteId(item._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-[#E4EBF5] flex items-center justify-between">
              <h2 className="font-bold text-[#071525]">{editing ? 'Edit Admin' : 'Add Admin'}</h2>
              <button onClick={closeForm} className="text-[#5A7896] hover:text-[#071525] text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]"
                  placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Username *</label>
                <input name="username" value={form.username} onChange={handleChange} required
                  className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]"
                  placeholder="john_doe" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">
                  Password {editing && <span className="text-[#5A7896] normal-case font-normal">(leave blank to keep)</span>}
                </label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} required={!editing} minLength={8}
                    className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525] pr-16"
                    placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A7896] hover:text-[#071525]">
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {(!editing || form.password) && (
                <div>
                  <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                      onChange={handleChange} required={!editing || !!form.password} minLength={8}
                      className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]"
                      placeholder="Repeat password" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A6FDB] text-[#071525]">
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
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
        message="Delete this admin account permanently?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
