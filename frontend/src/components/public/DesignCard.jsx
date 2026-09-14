import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function DesignCard({ design }) {
  const { getDesignWhatsAppLink } = useSettings();

  if (!design) return null;

  return (
    <div
      className="luxury-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Primary Image */}
      <Link
        to={`/designs/${design.slug}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/11',
          overflow: 'hidden',
          display: 'block',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <img
          src={design.primary_image}
          alt={design.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="design-card-img"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(16, 18, 22, 0.85) 0%, rgba(16, 18, 22, 0.1) 60%, transparent 100%)',
          }}
        />

        {/* Featured Tag */}
        {design.is_featured && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(9, 10, 12, 0.8)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--accent-gold)',
              padding: '4px 10px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--accent-gold-light)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Sparkles size={11} color="var(--accent-gold)" />
            <span>Featured</span>
          </div>
        )}

        {/* Photos Count Tag */}
        {design.images_count > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(9, 10, 12, 0.75)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--border-subtle)',
              padding: '4px 10px',
              borderRadius: '2px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
            }}
          >
            {design.images_count} Photos
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {design.category_name && (
            <div style={{ marginBottom: '8px' }}>
              <span className="badge-gold">
                {design.category_name}
              </span>
            </div>
          )}

          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              color: 'var(--text-primary)',
              marginBottom: '10px',
              lineHeight: 1.3,
            }}
          >
            <Link
              to={`/designs/${design.slug}`}
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              {design.title}
            </Link>
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '20px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {design.short_description}
          </p>
        </div>

        {/* Action Buttons: View Details & Dynamic WhatsApp Enquiry */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Link
            to={`/designs/${design.slug}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1, padding: '10px 12px', fontSize: '12px' }}
          >
            <span>View Design</span>
            <ArrowUpRight size={14} />
          </Link>

          <a
            href={getDesignWhatsAppLink(design.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ padding: '10px 14px', fontSize: '12px', gap: '6px' }}
            title="Enquire on WhatsApp"
          >
            <MessageSquare size={14} />
            <span>Enquire</span>
          </a>
        </div>
      </div>

      <style>{`
        .luxury-card:hover .design-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
