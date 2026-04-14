import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../../assets/LOGO.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/admin/categories', label: 'Categories', icon: '◈' },
  { to: '/admin/subcategories', label: 'Subcategories', icon: '◇' },
  { to: '/admin/products', label: 'Products', icon: '◻' },
  { to: '/admin/services', label: 'Services', icon: '◈' },
  // { to: '/admin/agents', label: 'Agents', icon: '◉' },
  // { to: '/admin/contact-info', label: 'Contact Info', icon: '◎' },
];

export default function Sidebar({ open, onClose }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#071525] z-30 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <img src={logo} alt="Tracecool" className="w-full h-auto max-h-20 object-contain" />
          <p className="text-[#5A7896] text-xs mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                 ${isActive
                   ? 'bg-[#1A6FDB] text-white'
                   : 'text-[#8BA5BF] hover:bg-white/5 hover:text-white'}`
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {admin?.role === 'superadmin' && (
            <NavLink
              to="/admin/admins"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                 ${isActive
                   ? 'bg-[#1A6FDB] text-white'
                   : 'text-[#8BA5BF] hover:bg-white/5 hover:text-white'}`
              }
            >
              <span className="text-base w-5 text-center">◈</span>
              Admins
            </NavLink>
          )}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1A6FDB]/20 flex items-center justify-center">
              <span className="text-[#1A6FDB] text-xs font-bold uppercase">
                {admin?.name?.[0] || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{admin?.name}</p>
              <p className="text-[#5A7896] text-xs capitalize">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-[#8BA5BF] hover:text-white hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
