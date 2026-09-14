import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import DesignCard from '../../components/public/DesignCard';

export default function DesignsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, designsData] = await Promise.all([
          api.getCategories(),
          api.getDesigns(activeCategorySlug !== 'all' ? { category: activeCategorySlug } : {}),
        ]);
        setCategories(cats || []);
        setDesigns(designsData || []);
      } catch (err) {
        console.error('Failed to load designs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeCategorySlug]);

  const handleSelectCategory = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', minHeight: '80vh', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 48px auto' }}>
          <span className="badge-gold" style={{ marginBottom: '12px' }}>
            Visual Showcase
          </span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginTop: '8px', marginBottom: '16px' }}>
            Decoration Designs
          </h1>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
            Browse through our portfolio of bespoke decoration setups. Click any design to view high-resolution photographs or enquire directly on WhatsApp.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '48px',
          }}
        >
          <button
            onClick={() => handleSelectCategory('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '2px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: activeCategorySlug === 'all' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: activeCategorySlug === 'all' ? 'var(--accent-gold-subtle)' : 'var(--bg-secondary)',
              color: activeCategorySlug === 'all' ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
            }}
          >
            All Collections
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.slug)}
              style={{
                padding: '10px 20px',
                borderRadius: '2px',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: activeCategorySlug === cat.slug ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                backgroundColor: activeCategorySlug === cat.slug ? 'var(--accent-gold-subtle)' : 'var(--bg-secondary)',
                color: activeCategorySlug === cat.slug ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            Loading designs...
          </div>
        ) : designs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            No designs found in this category.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '32px',
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
