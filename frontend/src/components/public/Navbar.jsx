import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getWhatsAppLink } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Designs', path: '/designs' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: isScrolled ? 'rgba(9, 10, 12, 0.95)' : 'rgba(9, 10, 12, 0.4)',
          backdropFilter: 'blur(12px)',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.6)' : 'none',
        }}
      >
        <div
          className="container"
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Mark */}
          <BrandLogo size="medium" />

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '36px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-gold-light)' : 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  padding: '8px 0',
                  transition: 'color var(--transition-fast)',
                })}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '10%',
                          right: '10%',
                          height: '2px',
                          background: 'var(--accent-gold)',
                          borderRadius: '1px',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA Action */}
          <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-cta">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ gap: '8px', padding: '10px 18px' }}
            >
              <MessageSquare size={15} color="var(--accent-gold)" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              width: '44px',
              height: '44px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '82%',
              maxWidth: '360px',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
                <BrandLogo size="small" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--accent-gold-light)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '17px',
                      fontFamily: 'var(--font-serif)',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    })}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <MessageSquare size={16} />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                <span>Book a Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
}
