import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import DesignCard from '../../components/public/DesignCard';

export default function CategoryDesignsPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      try {
        const [catData, designsData] = await Promise.all([
          api.getCategory(slug),
          api.getDesigns({ category: slug }),
        ]);
        setCategory(catData);
        setDesigns(designsData || []);
      } catch (err) {
        console.error('Failed to load category designs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 30px)', minHeight: '85vh', paddingBottom: '120px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '40px',
          }}
        >
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Categories</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--accent-gold-light)' }}>{category?.name || slug}</span>
        </div>

        {/* Category Editorial Hero Banner */}
        {category && (
          <div
            style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '64px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            {category.cover_image && (
              <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                <img
                  src={category.cover_image}
                  alt={category.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 8, 10, 0.95) 0%, rgba(7, 8, 10, 0.4) 100%)',
                  }}
                />
              </div>
            )}

            <div style={{ padding: '36px 40px', position: 'relative', zIndex: 2, marginTop: category.cover_image ? '-80px' : 0 }}>
              <span className="badge-gold" style={{ marginBottom: '12px' }}>
                Collection Portfolio
              </span>
              <h1 style={{ fontSize: 'clamp(32px, 4.8vw, 48px)', marginTop: '8px', marginBottom: '14px' }}>
                {category.name}
              </h1>
              <div className="gold-divider-left" />
              {category.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '800px', lineHeight: 1.8 }}>
                  {category.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Designs Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            Loading designs...
          </div>
        ) : designs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '24px' }}>
              No designs have been published in this collection yet.
            </p>
            <Link to="/categories" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} />
              <span>Back to All Collections</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '36px',
            }}
          >
            {designs.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
