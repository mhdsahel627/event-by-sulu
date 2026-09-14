import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function Lightbox({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onPrev,
  onNext,
}) {
  const { getDesignWhatsAppLink } = useSettings();

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentItem = images[currentIndex] || {};
  const currentImageUrl = typeof currentItem === 'string' ? currentItem : currentItem.image;
  const currentTitle = currentItem.design_title || currentItem.title || '';
  const currentCaption = currentItem.caption || '';
  const currentSlug = currentItem.design_slug || currentItem.slug || '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="lightbox-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(5, 6, 8, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        {/* Top Bar: Counter & Close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.08em' }}>
            {currentIndex + 1} / {images.length}
          </div>

          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Center: Main Image with Prev/Next Controls */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.length > 1 && (
            <button
              onClick={onPrev}
              aria-label="Previous Image"
              style={{
                position: 'absolute',
                left: '12px',
                zIndex: 20,
                background: 'rgba(15, 17, 21, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <motion.img
            key={currentImageUrl}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={currentImageUrl}
            alt={currentCaption || currentTitle || 'Decoration Image'}
            style={{
              maxHeight: '75vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              borderRadius: '4px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            }}
          />

          {images.length > 1 && (
            <button
              onClick={onNext}
              aria-label="Next Image"
              style={{
                position: 'absolute',
                right: '12px',
                zIndex: 20,
                background: 'rgba(15, 17, 21, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>

        {/* Bottom Bar: Title, Caption & Action CTAs */}
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {currentTitle && (
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {currentTitle}
              </h4>
            )}
            {currentCaption && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {currentCaption}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentSlug && (
              <Link
                to={`/designs/${currentSlug}`}
                onClick={onClose}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px' }}
              >
                <span>View Design Details</span>
                <ArrowUpRight size={14} />
              </Link>
            )}

            {currentTitle && (
              <a
                href={getDesignWhatsAppLink(currentTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{ fontSize: '12px' }}
              >
                <MessageSquare size={14} />
                <span>WhatsApp Enquiry</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
