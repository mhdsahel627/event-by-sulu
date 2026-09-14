import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';

// Public Layout & Components
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import WhatsAppFloat from './components/common/WhatsAppFloat';

// Public Pages
import HomePage from './pages/public/HomePage';
import CategoriesPage from './pages/public/CategoriesPage';
import CategoryDesignsPage from './pages/public/CategoryDesignsPage';
import DesignsPage from './pages/public/DesignsPage';
import DesignDetailPage from './pages/public/DesignDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Management Components & Pages
import ProtectedRoute from './components/management/ProtectedRoute';
import ManagementLayout from './components/management/ManagementLayout';
import LoginPage from './pages/management/LoginPage';
import DashboardPage from './pages/management/DashboardPage';
import CategoriesManagePage from './pages/management/CategoriesManagePage';
import DesignsManagePage from './pages/management/DesignsManagePage';
import DesignImagesManagePage from './pages/management/DesignImagesManagePage';
import InquiriesManagePage from './pages/management/InquiriesManagePage';
import SettingsManagePage from './pages/management/SettingsManagePage';

function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Routes>
          {/* Public Customer Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDesignsPage />} />
            <Route path="/designs" element={<DesignsPage />} />
            <Route path="/designs/:slug" element={<DesignDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Management Owner Login */}
          <Route path="/management/login" element={<LoginPage />} />

          {/* Protected Management Panel Routes */}
          <Route
            path="/management"
            element={
              <ProtectedRoute>
                <ManagementLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesManagePage />} />
            <Route path="designs" element={<DesignsManagePage />} />
            <Route path="designs/:id/images" element={<DesignImagesManagePage />} />
            <Route path="inquiries" element={<InquiriesManagePage />} />
            <Route path="settings" element={<SettingsManagePage />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </SettingsProvider>
  );
}
