import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Mail, MapPin, Instagram, Lock } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings, getWhatsAppLink, getPhoneLink, getEmailLink } = useSettings();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '80px',
        paddingBottom: '36px',
        marginTop: '80px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
          }}
        >
          {/* Col 1: Brand & Atelier Narrative */}
          <div>
            <BrandLogo size="medium" />
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: 1.8,
                marginTop: '18px',
                maxWidth: '320px',
              }}
            >
              {settings.tagline || 'Bespoke event and wedding decoration atelier crafting unforgettable atmospheres and timeless celebration memories.'}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '16px',
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                  Collections & Categories
                </Link>
              </li>
              <li>
                <Link to="/designs" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                  All Decoration Designs
                </Link>
              </li>
              <li>
                <Link to="/gallery" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                  Visual Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                  About Event by Sulu
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Dynamic Contact Info */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '16px',
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {settings.phone && (
                <a
                  href={getPhoneLink()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  <Phone size={16} color="var(--accent-gold)" />
                  <span>{settings.phone}</span>
                </a>
              )}

              {settings.whatsapp_number && (
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  <MessageSquare size={16} color="#25D366" />
                  <span>WhatsApp: {settings.whatsapp_number}</span>
                </a>
              )}

              {settings.email && (
                <a
                  href={getEmailLink()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  <Mail size={16} color="var(--accent-gold)" />
                  <span>{settings.email}</span>
                </a>
              )}

              {settings.address && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                  }}
                >
                  <MapPin size={16} color="var(--accent-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{settings.address}</span>
                </div>
              )}

              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  <Instagram size={16} color="var(--accent-gold)" />
                  <span>Instagram Showcase</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Management Portal Link */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {settings.business_name || 'Event by Sulu'}. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/management/login"
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Lock size={12} />
              <span>Owner Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
