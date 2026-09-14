import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageSquare, Layers, Eye, HeartHandshake } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AboutPage() {
  const { settings, getWhatsAppLink } = useSettings();

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 50px)', minHeight: '85vh', paddingBottom: '120px' }}>
      <div className="container">
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 80px auto' }}>
          <span className="badge-gold" style={{ marginBottom: '14px' }}>
            Atelier Vision
          </span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 60px)', marginTop: '8px', marginBottom: '20px' }}>
            About {settings.business_name || 'Event by Sulu'}
          </h1>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8 }}>
            An event decoration atelier devoted to creating memorable, visually arresting environments for life's most cherished celebrations.
          </p>
        </div>

        {/* Narrative Section 1: Philosophy & Craft */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '80px',
            alignItems: 'center',
            marginBottom: '100px',
          }}
        >
          <div>
            <span className="badge-gold" style={{ marginBottom: '16px' }}>
              Philosophy
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(28px, 3.8vw, 42px)',
                lineHeight: 1.25,
                marginTop: '10px',
                marginBottom: '24px',
              }}
            >
              Atmosphere is the language of memory.
            </h2>
            <div className="gold-divider-left" />

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '22px', fontSize: '16px' }}>
              <strong>{settings.business_name || 'Event by Sulu'}</strong> provides bespoke event decoration services for weddings, engagements, receptions, and celebratory gatherings.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '36px', fontSize: '16px' }}>
              We understand that celebrations are emotional landmarks. Our role is to create an aesthetic backdrop that honors that sentiment—using sculptural forms, organic botanicals, and warm lighting to make every moment feel intimate, elevated, and timeless.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link to="/designs" className="btn btn-gold">
                <span>Explore Designs</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Strategic Imagery */}
          <div
            style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid var(--border-gold-border)',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--bg-card)',
              aspectRatio: '4/3',
            }}
          >
            <img
              src="/assets/hero-bg.jpg"
              alt="Atelier Craft Showcase"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 8, 10, 0.9) 0%, transparent 60%)',
              }}
            />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Craftsmanship
              </span>
              <h4 style={{ fontSize: '20px', color: '#F7F4EE', marginTop: '4px' }}>
                Bespoke Floral & Lighting Architecture
              </h4>
            </div>
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Layers size={32} color="var(--accent-gold)" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#F7F4EE' }}>
              Architectural Cohesion
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>
              Every stage, archway, and table installation is designed in dialogue with your venue proportions, ensuring balanced sightlines and photogenic aesthetics from every angle.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Sparkles size={32} color="var(--accent-gold)" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#F7F4EE' }}>
              Tactile Luxury
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>
              We hand-select blooms, refined textures, and warm candlelight hues to produce a sensory ambiance that photographs gorgeously and feels deeply special in person.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <HeartHandshake size={32} color="var(--accent-gold)" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#F7F4EE' }}>
              Direct Collaboration
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>
              No complicated booking systems or sales layers. You communicate directly with our team on WhatsApp to shape your celebration decor seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
