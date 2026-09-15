import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MessageSquare, Mail, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import ImageCarousel from '../../components/common/ImageCarousel';
import Lightbox from '../../components/common/Lightbox';

export default function DesignDetailPage() {
  const { slug } = useParams();
  const { settings, getDesignWhatsAppLink } = useSettings();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function fetchDesign() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getDesign(slug);
        setDesign(data);
      } catch (err) {
        console.error('Failed to load design:', err);
        setError('Design not found or temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    }
    fetchDesign();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ paddingTop: '180px', textAlign: 'center', minHeight: '60vh', color: 'var(--text-secondary)' }}>
        Loading design details...
      </div>
    );
  }

  if (error || !design) {
    return (
      <div style={{ paddingTop: '180px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>{error || 'Design Not Found'}</h2>
        <Link to="/designs" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} />
          <span>Browse Other Designs</span>
        </Link>
      </div>
    );
  }

  // Compile all images for carousel & lightbox: primary + additional
  const allImages = [];
  if (design.primary_image) {
    allImages.push({
      id: `pri_${design.id}`,
      image: design.primary_image,
      caption: design.short_description || design.title,
      title: design.title,
      design_slug: design.slug,
    });
  }
  if (design.additional_images && design.additional_images.length > 0) {
    design.additional_images.forEach((img) => {
      allImages.push({
        id: `add_${img.id}`,
        image: img.image,
        caption: img.caption || design.title,
        title: design.title,
        design_slug: design.slug,
      });
    });
  }

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Dynamic WhatsApp link with exact design title from database
  const whatsappUrl = getDesignWhatsAppLink(design.title);

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
            marginBottom: '36px',
          }}
        >
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Categories</Link>
          <ChevronRight size={14} />
          <Link to={`/categories/${design.category_slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            {design.category_name}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--accent-gold-light)' }}>{design.title}</span>
        </div>

        {/* Top Header Information */}
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Link to={`/categories/${design.category_slug}`} style={{ textDecoration: 'none' }}>
              <span className="badge-gold">
                {design.category_name}
              </span>
            </Link>
            {design.is_featured && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  color: 'var(--accent-gold-light)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={12} color="var(--accent-gold)" />
                <span>Featured Showcase</span>
              </span>
            )}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(34px, 5.5vw, 56px)',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}
          >
            {design.title}
          </h1>


        </div>

        {/* Main Media Carousel Viewport */}
        <div style={{ marginBottom: '64px' }}>
          <ImageCarousel images={allImages} onImageClick={handleOpenLightbox} />
        </div>

        {/* Two-Column Details & Contact Prompt */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '56px',
            alignItems: 'start',
          }}
        >
          {/* Concept Narrative */}
          <div>
            <span className="badge-gold" style={{ marginBottom: '14px' }}>
              Atelier Concept
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                marginBottom: '16px',
                marginTop: '8px',
                color: 'var(--text-primary)',
              }}
            >
              Design Story & Details
            </h2>
            <div className="gold-divider-left" />

            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                lineHeight: 1.85,
                whiteSpace: 'pre-line',
              }}
            >
              { design.short_description }
            </div>

            <div
              style={{
                marginTop: '44px',
                padding: '28px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
              }}
            >
              <h4 style={{ fontSize: '15px', color: 'var(--accent-gold-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bespoke Atelier Guarantee
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                Every decoration element shown in this concept can be personalized to harmonize with your specific venue dimensions, ceiling heights, and floral color preferences.
              </p>
            </div>
          </div>

          {/* Dynamic WhatsApp & Contact Action Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '6px',
              padding: '44px 36px',
              boxShadow: 'var(--shadow-gold)',
              position: 'sticky',
              top: '110px',
            }}
          >
            <span className="badge-gold" style={{ marginBottom: '14px' }}>
              Inquire About This Setup
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                marginBottom: '14px',
                marginTop: '8px',
              }}
            >
              Interested in this design?
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '15px',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}
            >
              Connect with <strong>{settings.business_name || 'Event by Sulu'}</strong> directly. We will open WhatsApp with your selected design pre-filled so you can easily enquire about custom staging and availability.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%', padding: '16px 28px', fontSize: '14px' }}
              >
                <MessageSquare size={18} />
                <span>Enquire on WhatsApp</span>
              </a>

              <Link
                to={`/contact?design=${design.id}&title=${encodeURIComponent(design.title)}`}
                className="btn btn-outline"
                style={{ width: '100%', padding: '14px 28px', fontSize: '14px' }}
              >
                <Mail size={16} />
                <span>Contact Form Consultation</span>
              </Link>
            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}
            >
              Direct contact: {settings.phone || '9048851677'}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
