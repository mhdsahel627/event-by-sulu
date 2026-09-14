import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, MessageSquare, Filter, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import Lightbox from '../../components/common/Lightbox';

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  const { getDesignWhatsAppLink } = useSettings();
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, galleryData] = await Promise.all([
          api.getCategories(),
          api.getGallery(selectedCategory !== 'all' ? selectedCategory : null),
        ]);
        setCategories(cats || []);
        setGalleryImages(galleryData?.results || []);
      } catch (err) {
        console.error('Failed to load gallery feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  const handleFilter = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 50px)', minHeight: '85vh', paddingBottom: '120px' }}>
      <div className="container">
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px auto' }}>
          <span className="badge-gold" style={{ marginBottom: '14px' }}>
            Portfolio Visuals
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', marginTop: '8px', marginBottom: '20px' }}>
            Decoration Gallery
          </h1>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.8 }}>
            An immersive photographic showcase of our bespoke stages, floral mandaps, gazebos, and ceremonial celebrations. Click any photograph to view in fullscreen or discover the design details.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '56px',
          }}
        >
          <button
            onClick={() => handleFilter('all')}
            style={{
              padding: '11px 24px',
              borderRadius: '2px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s',
              border: selectedCategory === 'all' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: selectedCategory === 'all' ? 'var(--accent-gold-subtle)' : 'var(--bg-secondary)',
              color: selectedCategory === 'all' ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
            }}
          >
            All Portfolios ({galleryImages.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.slug)}
              style={{
                padding: '11px 24px',
                borderRadius: '2px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s',
                border: selectedCategory === cat.slug ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                backgroundColor: selectedCategory === cat.slug ? 'var(--accent-gold-subtle)' : 'var(--bg-secondary)',
                color: selectedCategory === cat.slug ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Editorial Asymmetrical Gallery Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
            Loading gallery photographs...
          </div>
        ) : galleryImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
            No gallery photographs available in this collection.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '28px',
            }}
          >
            {galleryImages.map((item, index) => {
              // Create dynamic aspect ratio rhythm: 4:3, 1:1, 16:10
              const aspectRatio = index % 5 === 0 ? '16/11' : index % 3 === 0 ? '4/3' : '1';
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                  onClick={() => handleImageClick(index)}
                  className="luxury-card"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    aspectRatio: aspectRatio,
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.caption || item.design_title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                    }}
                    className="gallery-grid-img"
                  />

                  {/* Refined Hover Reveal Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7, 8, 10, 0.95) 0%, rgba(7, 8, 10, 0.2) 55%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '28px',
                    }}
                    className="gallery-hover-overlay"
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span
                        style={{
                          background: 'rgba(7, 8, 10, 0.8)',
                          border: '1px solid var(--border-gold)',
                          color: 'var(--accent-gold-light)',
                          padding: '4px 12px',
                          borderRadius: '2px',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 600,
                        }}
                      >
                        {item.category_name}
                      </span>
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '20px',
                          color: '#F7F4EE',
                          marginBottom: '6px',
                        }}
                      >
                        {item.design_title}
                      </h3>
                      {item.caption && (
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                          {item.caption}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/designs/${item.design_slug}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '8px 16px', fontSize: '11px', flex: 1 }}
                        >
                          <span>View Design</span>
                          <ArrowUpRight size={13} />
                        </Link>

                        <a
                          href={getDesignWhatsAppLink(item.design_title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-whatsapp btn-sm"
                          style={{ padding: '8px 14px', fontSize: '11px' }}
                          title="Enquire on WhatsApp"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .luxury-card:hover .gallery-grid-img {
          transform: scale(1.06);
        }
        .luxury-card:hover .gallery-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>

      {/* Fullscreen Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={galleryImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
