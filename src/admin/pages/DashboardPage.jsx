import { useEffect, useState } from 'react';
import api from '../utils/api';

function StatCard({ label, count, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E4EBF5]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <span className="text-white text-lg font-bold">#</span>
      </div>
      <p className="text-3xl font-bold text-[#071525]">{count ?? '—'}</p>
      <p className="text-sm text-[#5A7896] mt-0.5">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/subcategories'),
      api.get('/products'),
      api.get('/services'),
    ]).then(([cats, subs, prods, svcs]) => {
      setStats({
        categories: cats.data.length,
        subcategories: subs.data.length,
        products: prods.data.length,
        services: svcs.data.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#071525]">Dashboard</h1>
        <p className="text-sm text-[#5A7896] mt-0.5">Overview of your Tracecool content</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Categories" count={stats.categories} color="bg-[#1A6FDB]" />
          <StatCard label="Subcategories" count={stats.subcategories} color="bg-[#071525]" />
          <StatCard label="Products" count={stats.products} color="bg-emerald-500" />
          <StatCard label="Services" count={stats.services} color="bg-violet-500" />
        </div>
      )}

      <div className="mt-8 bg-white rounded-2xl p-6 border border-[#E4EBF5] shadow-sm">
        <h2 className="font-semibold text-[#071525] mb-1">Quick Links</h2>
        <p className="text-sm text-[#5A7896] mb-4">Navigate to manage your content</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Manage Products', to: '/admin/products' },
            { label: 'Manage Services', to: '/admin/services' },
            { label: 'Categories', to: '/admin/categories' },
            { label: 'Contact Info', to: '/admin/contact-info' },
          ].map(link => (
            <a
              key={link.to}
              href={link.to}
              className="px-4 py-3 rounded-xl border border-[#E4EBF5] text-sm font-medium text-[#071525]
                         hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors"
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
