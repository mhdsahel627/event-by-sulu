import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="luxury-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Category Image Cover */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <img
          src={category.cover_image}
          alt={category.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="category-card-img"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(16, 18, 22, 0.95) 0%, rgba(16, 18, 22, 0.2) 60%, transparent 100%)',
          }}
        />

        {category.designs_count > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(9, 10, 12, 0.75)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--border-gold-subtle)',
              padding: '4px 10px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--accent-gold-light)',
              textTransform: 'uppercase',
            }}
          >
            {category.designs_count} {category.designs_count === 1 ? 'Design' : 'Designs'}
          </div>
        )}
      </div>

      {/* Category Content */}
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
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}
          >
            {category.name}
          </h3>
          {category.description && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: '18px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {category.description}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent-gold)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span>Explore Designs</span>
          <ArrowRight size={14} />
        </div>
      </div>

      <style>{`
        .luxury-card:hover .category-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </Link>
  );
}
