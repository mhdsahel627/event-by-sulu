import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 60px)', minHeight: '85vh', paddingBottom: '120px' }}>
      <div className="container">
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 72px auto' }}>
          <span className="badge-gold" style={{ marginBottom: '14px' }}>
            Celebration Portfolios
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', marginTop: '8px', marginBottom: '20px' }}>
            Decoration Collections
          </h1>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.8 }}>
            Explore our curated decoration collections across royal wedding mandaps, contemporary stage styling, romantic floral gazebos, and festive ceremonies.
          </p>
        </div>

        {/* Categories Showcase */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            Loading collections...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            No categories available at the moment.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '40px',
            }}
          >
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="luxury-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  aspectRatio: idx === 0 ? '16/11' : '4/3',
                  overflow: 'hidden',
                  gridColumn: idx === 0 && categories.length > 2 ? 'span 2' : 'auto',
                }}
              >
                <img
                  src={cat.cover_image}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                  }}
                  className="cat-card-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 8, 10, 0.95) 0%, rgba(7, 8, 10, 0.3) 50%, transparent 100%)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                      {cat.designs_count} {cat.designs_count === 1 ? 'Design Setup' : 'Design Setups'}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#F7F4EE', marginBottom: '10px' }}>
                    {cat.name}
                  </h2>

                  {cat.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, maxWidth: '580px', marginBottom: '20px' }}>
                      {cat.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <span>Explore Collection Designs</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .luxury-card:hover .cat-card-img {
          transform: scale(1.06);
        }
        @media (max-width: 860px) {
          .luxury-card { grid-column: auto !important; }
        }
      `}</style>
    </div>
  );
}
