import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Sparkles,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function ManagementLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/management/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/management', icon: LayoutDashboard },
    { label: 'Categories', path: '/management/categories', icon: FolderTree },
    { label: 'Designs & Photos', path: '/management/designs', icon: Sparkles },
    { label: 'Contact Enquiries', path: '/management/inquiries', icon: Inbox },
    { label: 'Site Settings', path: '/management/settings', icon: Settings },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0C0E12',
        color: '#E2E8F0',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#12151B',
          borderRight: '1px solid #1E232D',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
        className="management-sidebar-desktop"
      >
        <div>
          {/* Logo / Header */}
          <div
            style={{
              padding: '24px 20px',
              borderBottom: '1px solid #1E232D',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#F8FAFC', fontFamily: 'var(--font-serif)' }}>
              {settings.business_name || 'Event by Sulu'}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' }}>
              Management Portal
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/management'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    color: isActive ? '#F8FAFC' : '#94A3B8',
                    backgroundColor: isActive ? '#1F2532' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} color={isActive ? '#C5A880' : '#64748B'} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1E232D' }}>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              color: '#94A3B8',
              textDecoration: 'none',
              fontSize: '13px',
              borderRadius: '6px',
              marginBottom: '6px',
            }}
          >
            <ExternalLink size={16} />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'none',
              border: 'none',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '13px',
              borderRadius: '6px',
              textAlign: 'left',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#12151B',
            borderBottom: '1px solid #1E232D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="management-menu-toggle"
              style={{
                background: 'none',
                border: '1px solid #2A303C',
                color: '#E2E8F0',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontSize: '14px', color: '#94A3B8' }}>
              Owner Control Center
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#94A3B8' }}>
            <span>Logged in as <strong>{user?.username}</strong></span>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '280px',
              backgroundColor: '#12151B',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{settings.business_name}</span>
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/management'}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      color: '#E2E8F0',
                      textDecoration: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .management-sidebar-desktop { display: none !important; }
          .management-menu-toggle { display: block !important; }
        }
        @media (min-width: 901px) {
          .management-menu-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}
