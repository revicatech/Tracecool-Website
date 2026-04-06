import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import SubcategoriesPage from './pages/SubcategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import AgentsPage from './pages/AgentsPage';
import ContactInfoPage from './pages/ContactInfoPage';
import AdminsPage from './pages/AdminsPage';

function Protected({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminApp() {
  useEffect(() => {
    const prevDir = document.documentElement.dir
    const prevLang = document.documentElement.lang
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
    return () => {
      document.documentElement.dir = prevDir
      document.documentElement.lang = prevLang
    }
  }, [])

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="" element={<Protected><DashboardPage /></Protected>} />
        <Route path="categories" element={<Protected><CategoriesPage /></Protected>} />
        <Route path="subcategories" element={<Protected><SubcategoriesPage /></Protected>} />
        <Route path="products" element={<Protected><ProductsPage /></Protected>} />
        <Route path="services" element={<Protected><ServicesPage /></Protected>} />
        <Route path="agents" element={<Protected><AgentsPage /></Protected>} />
        <Route path="contact-info" element={<Protected><ContactInfoPage /></Protected>} />
        <Route path="admins" element={<Protected><AdminsPage /></Protected>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
