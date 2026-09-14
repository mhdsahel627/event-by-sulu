import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, Compass, ShieldCheck, HeartHandshake, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import DesignCard from '../../components/public/DesignCard';
import Lightbox from '../../components/common/Lightbox';

export default function HomePage() {
  const { settings, getWhatsAppLink, getDesignWhatsAppLink } = useSettings();
  const [categories, setCategories] = useState([]);
  const [featuredDesigns, setFeaturedDesigns] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state for gallery preview
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, designs, gallery] = await Promise.all([
          api.getCategories(),
          api.getDesigns({ featured: true }),
          api.getGallery(),
        ]);
        setCategories(cats || []);
        setFeaturedDesigns((designs || []).slice(0, 4));
        setGalleryPreview((gallery?.results || []).slice(0, 6));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* =========================================================================
          1. CINEMATIC FULLSCREEN HERO
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '680px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background Image with Ken Burns Subtle Scale */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <img
            src="/assets/hero-bg.jpg"
            alt="Event by Sulu luxury stage decor"
            className="animate-ken-burns"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'brightness(0.72) contrast(1.08)',
            }}
          />
        </div>

        {/* Multi-layered Dark Vignette & Gradient Overlays for High Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to bottom, rgba(7, 8, 10, 0.75) 0%, rgba(7, 8, 10, 0.4) 40%, rgba(7, 8, 10, 0.88) 85%, #07080A 100%),
              radial-gradient(circle at 50% 50%, rgba(7, 8, 10, 0.3) 0%, rgba(7, 8, 10, 0.85) 100%)
            `,
            zIndex: 2,
          }}
        />

        {/* Subtle Decorative Editorial Frame */}
        <div
          style={{
            position: 'absolute',
            inset: '28px',
            border: '1px solid rgba(197, 168, 128, 0.12)',
            pointerEvents: 'none',
            zIndex: 3,
            display: 'none',
          }}
          className="editorial-frame"
        />

        {/* Hero Foreground Content */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 4,
            textAlign: 'center',
            maxWidth: '1080px',
            marginTop: '30px',
          }}
        >
          {/* Top Brand Atelier Tag */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{ marginBottom: '24px' }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 22px',
                background: 'rgba(7, 8, 10, 0.65)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--accent-gold-border)',
                borderRadius: '50px',
                color: 'var(--accent-gold-light)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              <Sparkles size={13} color="var(--accent-gold)" />
              <span>{settings.business_name || 'Event by Sulu'} • Bespoke Decoration Atelier</span>
            </span>
          </motion.div>

          {/* Majestic Serif Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(38px, 6.2vw, 76px)',
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: '26px',
              letterSpacing: '-0.025em',
            }}
          >
            <span className="gold-gradient-text">Event by Sulu creates</span>
            <br />
            beautiful, memorable celebrations.
          </motion.h1>

          {/* Premium Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            style={{
              fontSize: 'clamp(16px, 1.9vw, 20px)',
              color: 'var(--text-secondary)',
              maxWidth: '740px',
              margin: '0 auto 44px auto',
              lineHeight: 1.75,
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            }}
          >
            We transform milestone moments into breathtaking visual experiences with bespoke floral architecture, sculpted luxury stages, and atmospheric celebration styling.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.19, 1, 0.22, 1] }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '18px',
            }}
          >
            <Link to="/designs" className="btn btn-gold">
              <span>Explore Our Designs</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageSquare size={16} />
              <span>Enquire on WhatsApp</span>
            </a>
          </motion.div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll</span>
          <div
            style={{
              width: '20px',
              height: '32px',
              borderRadius: '12px',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px',
            }}
          >
            <div
              className="scroll-indicator-dot"
              style={{
                width: '4px',
                height: '6px',
                borderRadius: '2px',
                backgroundColor: 'var(--accent-gold)',
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EDITORIAL BRAND PHILOSOPHY & CRAFTSMANSHIP
          ========================================================================= */}
      <section style={{ padding: '120px 0', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '80px',
              alignItems: 'center',
            }}
          >
            {/* Left: Atelier Philosophy */}
            <div>
              <span className="badge-gold" style={{ marginBottom: '16px' }}>
                Atelier Philosophy
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  lineHeight: 1.2,
                  marginTop: '12px',
                  marginBottom: '24px',
                }}
              >
                Every celebration is an architectural canvas.
              </h2>
              <div className="gold-divider-left" />

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '20px', fontSize: '16px' }}>
                At <strong>{settings.business_name || 'Event by Sulu'}</strong>, event decoration is an intentional art of creating immersive environments. We balance grand scale with delicate intimacy, allowing your guests to step into a space filled with warmth, luxury, and poetry.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '36px', fontSize: '16px' }}>
                Whether it is the fragrance of hand-woven floral arches, the gentle flicker of candlelight against obsidian textures, or curved architectural backdrops illuminated by warm celestial luminescence, every detail is considered.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '18px' }}>
                  <h4 style={{ color: 'var(--accent-gold-light)', fontSize: '18px', marginBottom: '6px' }}>Bespoke Concept</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>Tailored to complement your specific venue architecture.</p>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '18px' }}>
                  <h4 style={{ color: 'var(--accent-gold-light)', fontSize: '18px', marginBottom: '6px' }}>Uncompromising</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>Refined floral choices and meticulous execution standards.</p>
                </div>
              </div>
            </div>

            {/* Right: Layered Visual Editorial Showcase */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold-border)',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                  aspectRatio: '4/3',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <img
                  src="/assets/hero-bg.jpg"
                  alt="Event by Sulu Stage Craft"
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
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Signature Aesthetic
                  </span>
                  <h4 style={{ fontSize: '20px', color: '#F7F4EE', marginTop: '4px' }}>
                    Bespoke Stage Architecture
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CATEGORIES SECTION (PHOTOGRAPHY-FIRST EDITORIAL SHOWCASE)
          ========================================================================= */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '24px',
              marginBottom: '56px',
            }}
          >
            <div>
              <span className="badge-gold" style={{ marginBottom: '12px' }}>
                Curated Collections
              </span>
              <h2 style={{ fontSize: 'clamp(30px, 4.2vw, 46px)', marginTop: '8px' }}>
                Celebration Categories
              </h2>
              <div className="gold-divider-left" />
            </div>

            <Link to="/categories" className="btn btn-outline btn-sm">
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Asymmetric Editorial Category Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
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
                  className="cat-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 8, 10, 0.95) 0%, rgba(7, 8, 10, 0.25) 50%, transparent 100%)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                      {cat.designs_count} {cat.designs_count === 1 ? 'Design' : 'Designs'}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: '#F7F4EE', marginBottom: '8px' }}>
                    {cat.name}
                  </h3>

                  {cat.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, maxWidth: '520px', marginBottom: '16px' }}>
                      {cat.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <span>Explore Collection</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .luxury-card:hover .cat-img {
            transform: scale(1.06);
          }
          @media (max-width: 860px) {
            .luxury-card { grid-column: auto !important; }
          }
        `}</style>
      </section>

      {/* =========================================================================
          4. FEATURED DESIGNS SHOWCASE
          ========================================================================= */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 64px auto' }}>
            <span className="badge-gold" style={{ marginBottom: '14px' }}>
              Signature Craftsmanship
            </span>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', marginTop: '8px' }}>
              Featured Designs
            </h2>
            <div className="gold-divider" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.75 }}>
              Handpicked decoration setups showcasing our architectural mandaps, stage backdrops, and romantic floral gazebos.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
            }}
          >
            {featuredDesigns.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link to="/designs" className="btn btn-outline">
              <span>View All Decoration Designs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. VISUAL GALLERY SHOWCASE PREVIEW
          ========================================================================= */}
      {galleryPreview.length > 0 && (
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '48px',
              }}
            >
              <div>
                <span className="badge-gold" style={{ marginBottom: '12px' }}>
                  Visual Portfolio
                </span>
                <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', marginTop: '6px' }}>
                  From Our Gallery
                </h2>
                <div className="gold-divider-left" />
              </div>

              <Link to="/gallery" className="btn btn-outline btn-sm">
                <span>View Complete Gallery ({galleryPreview.length}+)</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Asymmetric Gallery Preview Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {galleryPreview.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                  className="luxury-card"
                  style={{
                    position: 'relative',
                    aspectRatio: idx % 3 === 0 ? '16/11' : '1',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.caption || item.design_title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
                    }}
                    className="gallery-preview-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(7, 8, 10, 0.75)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '20px',
                    }}
                    className="gallery-preview-hover"
                  >
                    <span style={{ fontSize: '10px', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {item.category_name}
                    </span>
                    <h4 style={{ fontSize: '16px', color: '#F7F4EE', marginTop: '4px' }}>
                      {item.design_title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            .luxury-card:hover .gallery-preview-img {
              transform: scale(1.08);
            }
            .luxury-card:hover .gallery-preview-hover {
              opacity: 1 !important;
            }
          `}</style>
        </section>
      )}

      {/* =========================================================================
          6. DIRECT ATELIER CONSULTATION BANNER
          ========================================================================= */}
      <section style={{ padding: '120px 0', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #12151C 0%, #0A0C10 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: '6px',
              padding: '72px 40px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-gold)',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            <span className="badge-gold" style={{ marginBottom: '18px' }}>
              Atelier Consultation
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(32px, 4.8vw, 48px)',
                lineHeight: 1.2,
                marginBottom: '20px',
              }}
            >
              Let's Create Something Beautiful.
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '17px',
                maxWidth: '640px',
                margin: '0 auto 40px auto',
                lineHeight: 1.8,
              }}
            >
              Have an upcoming wedding or celebratory milestone? Chat directly with us on WhatsApp or send an enquiry to explore how we can elevate your celebration.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center' }}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ padding: '16px 36px' }}
              >
                <MessageSquare size={18} />
                <span>Chat on WhatsApp</span>
              </a>

              <Link to="/contact" className="btn btn-outline" style={{ padding: '16px 36px' }}>
                <span>Send An Enquiry</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={galleryPreview}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryPreview.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < galleryPreview.length - 1 ? prev + 1 : 0))}
      />

      <style>{`
        @media (min-width: 1024px) {
          .editorial-frame { display: block !important; }
        }
      `}</style>
    </div>
  );
}
