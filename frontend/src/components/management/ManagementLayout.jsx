import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
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
  User,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import '../../admin-theme.css';

export default function ManagementLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Keep unread inquiries count fresh for sidebar badges
  useEffect(() => {
    let isMounted = true;
    async function fetchUnread() {
      try {
        const stats = await api.getDashboardStats();
        if (isMounted && stats && typeof stats.new_inquiries === 'number') {
          setUnreadCount(stats.new_inquiries);
        }
      } catch (err) {
        // Silently handle if unauthenticated or network error
      }
    }
    fetchUnread();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/management/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/management', icon: LayoutDashboard },
    { label: 'Categories', path: '/management/categories', icon: FolderTree },
    { label: 'Designs & Photos', path: '/management/designs', icon: Sparkles },
    {
      label: 'Contact Enquiries',
      path: '/management/inquiries',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { label: 'Site Settings', path: '/management/settings', icon: Settings },
  ];

  // Helper for current page title in header
  const getPageTitle = () => {
    if (location.pathname === '/management') return 'Atelier Dashboard';
    if (location.pathname.startsWith('/management/categories')) return 'Categories';
    if (location.pathname.includes('/images')) return 'Photo Gallery Manager';
    if (location.pathname.startsWith('/management/designs')) return 'Designs & Catalog';
    if (location.pathname.startsWith('/management/inquiries')) return 'Customer Enquiries';
    if (location.pathname.startsWith('/management/settings')) return 'Site Settings';
    return 'Management';
  };

  return (
    <div className="admin-shell">
      {/* Desktop Sidebar (macOS System Settings Style) */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#12151D',
          borderRight: '1px solid var(--apple-hairline)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
        className="management-sidebar-desktop"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Atelier Brand Capsule */}
          <div
            style={{
              padding: '24px 20px 20px 20px',
              borderBottom: '1px solid var(--apple-hairline)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2A3344 0%, #171C26 100%)',
                border: '1px solid var(--apple-hairline-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--apple-accent-light)',
                fontWeight: 700,
                fontSize: '15px',
                fontFamily: 'var(--font-serif)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              S
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                  fontFamily: 'var(--font-serif)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {settings.business_name || 'Event by Sulu'}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--apple-accent)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={12} />
                <span>Admin Console</span>
              </div>
            </div>
          </div>

          {/* Grouped Navigation */}
          <nav
            style={{
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--apple-text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 12px 8px 12px',
              }}
            >
              Management
            </div>

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
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    color: isActive ? '#FFFFFF' : 'var(--apple-text-secondary)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                    border: isActive ? '1px solid var(--apple-hairline)' : '1px solid transparent',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon
                          size={17}
                          color={isActive ? 'var(--apple-accent-light)' : 'var(--apple-text-muted)'}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          style={{
                            padding: '2px 7px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--apple-danger)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile & Actions Footer */}
          <div
            style={{
              padding: '16px 14px',
              borderTop: '1px solid var(--apple-hairline)',
              backgroundColor: 'rgba(0,0,0,0.15)',
            }}
          >
            {/* User Capsule */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--apple-hairline)',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--apple-surface-elevated)',
                  border: '1px solid var(--apple-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--apple-text-secondary)',
                }}
              >
                <User size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--apple-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.username || 'Owner'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                  Authenticated
                </div>
              </div>
            </div>

            {/* Public Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                color: 'var(--apple-text-secondary)',
                textDecoration: 'none',
                fontSize: '12px',
                borderRadius: '6px',
                transition: 'var(--apple-transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--apple-text-secondary)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={14} />
                <span>Live Website</span>
              </div>
              <ChevronRight size={13} color="var(--apple-text-muted)" />
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: 'none',
                border: 'none',
                color: 'var(--apple-danger)',
                cursor: 'pointer',
                fontSize: '12px',
                borderRadius: '6px',
                marginTop: '4px',
                textAlign: 'left',
                transition: 'var(--apple-transition)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--apple-danger-subtle)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar (Frosted Glass) */}
        <header
          className="apple-glass"
          style={{
            height: '58px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--apple-hairline)',
          }}
        >
          {/* Left: Mobile Toggle & Page Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="management-menu-toggle"
              aria-label="Open Navigation Menu"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--apple-hairline)',
                color: 'var(--apple-text-primary)',
                padding: '8px',
                borderRadius: 'var(--apple-radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '38px',
                minHeight: '38px',
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right: Quick Live Website Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-btn apple-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px' }}
            >
              <ExternalLink size={13} />
              <span className="hide-on-mobile-xs">Public Site</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main
          className="admin-main-content"
          style={{
            flex: 1,
            padding: '28px 24px',
            overflowY: 'auto',
            width: '100%',
            maxWidth: '1360px',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer (iOS Slide-Over with Backdrop Blur) */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            animation: 'appleFadeIn 0.2s ease-out',
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '82%',
              maxWidth: '310px',
              backgroundColor: '#12151D',
              borderRight: '1px solid var(--apple-hairline-strong)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.75)',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'appleSlideUp 0.25s var(--apple-ease)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--apple-hairline)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #2A3344 0%, #171C26 100%)',
                      border: '1px solid var(--apple-hairline-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--apple-accent-light)',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    S
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--apple-text-primary)',
                      }}
                    >
                      {settings.business_name || 'Event by Sulu'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                      Control Center
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close navigation"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--apple-hairline)',
                    color: 'var(--apple-text-secondary)',
                    borderRadius: 'var(--apple-radius-sm)',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '36px',
                    minHeight: '36px',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/management'}
                    onClick={() => setSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      color: isActive ? '#FFFFFF' : 'var(--apple-text-secondary)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      border: isActive
                        ? '1px solid var(--apple-hairline)'
                        : '1px solid transparent',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <item.icon
                            size={18}
                            color={
                              isActive ? 'var(--apple-accent-light)' : 'var(--apple-text-muted)'
                            }
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            style={{
                              padding: '2px 7px',
                              borderRadius: '10px',
                              backgroundColor: 'var(--apple-danger)',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                borderTop: '1px solid var(--apple-hairline)',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  color: 'var(--apple-text-secondary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                }}
              >
                <ExternalLink size={16} />
                <span>View Public Website</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 10px',
                  background: 'var(--apple-danger-subtle)',
                  border: '1px solid rgba(248, 113, 113, 0.25)',
                  borderRadius: 'var(--apple-radius-sm)',
                  color: 'var(--apple-danger)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Breakpoints Rules */}
      <style>{`
        @media (max-width: 900px) {
          .management-sidebar-desktop { display: none !important; }
          .management-menu-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .management-menu-toggle { display: none !important; }
        }
        @media (max-width: 480px) {
          .hide-on-mobile-xs { display: none !important; }
        }
      `}</style>
    </div>
  );
}
