import { useState, useEffect } from 'react';
import api from '../utils/api';

const socialFields = [
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '+1234567890' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/tracecool' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tracecool' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/tracecool' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/tracecool' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@tracecool' },
];

export default function ContactInfoPage() {
  const [form, setForm] = useState({
    phone: '', phone2: '', email: '',
    address_en: '', address_ar: '',
    socials: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '', whatsapp: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/contact-info').then(r => {
      setForm({
        phone: r.data.phone || '',
        phone2: r.data.phone2 || '',
        email: r.data.email || '',
        address_en: r.data.address_en || '',
        address_ar: r.data.address_ar || '',
        socials: {
          facebook: r.data.socials?.facebook || '',
          instagram: r.data.socials?.instagram || '',
          twitter: r.data.socials?.twitter || '',
          linkedin: r.data.socials?.linkedin || '',
          youtube: r.data.socials?.youtube || '',
          whatsapp: r.data.socials?.whatsapp || '',
        },
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSocial = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, socials: { ...f.socials, [name]: value } }));
  };

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true); setError(''); setSuccess(false);
    try {
      await api.put('/contact-info', form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const inputCls = 'w-full border border-[#E4EBF5] rounded-lg px-3 py-2.5 text-sm text-[#071525] bg-white focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB]/20 transition';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#071525]">Contact Info</h1>
        <p className="text-sm text-[#5A7896] mt-0.5">Update phone numbers, email, address and social media links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">Saved successfully!</div>}

        {/* Contact details */}
        <div className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-[#071525] mb-4">Contact Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Phone 1</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Phone 2</label>
              <input name="phone2" value={form.phone2} onChange={handleChange} placeholder="+1 234 567 890" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="info@tracecool.com" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">
                <span className="bg-[#1A6FDB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5">EN</span>
                Address
              </label>
              <textarea name="address_en" value={form.address_en} onChange={handleChange}
                rows={3} placeholder="English address…"
                className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">
                <span className="bg-[#071525] text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5">AR</span>
                Address
              </label>
              <textarea name="address_ar" value={form.address_ar} onChange={handleChange}
                rows={3} placeholder="العنوان بالعربية…" dir="rtl"
                className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        {/* Social media */}
        <div className="bg-white rounded-2xl border border-[#E4EBF5] shadow-sm p-6">
          <h2 className="font-semibold text-[#071525] mb-4">Social Media</h2>
          <div className="space-y-4">
            {socialFields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-1.5">{label}</label>
                <input name={key} value={form.socials[key]} onChange={handleSocial}
                  placeholder={placeholder} className={inputCls} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="bg-[#1A6FDB] text-white px-8 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#4D9EFF] transition disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
