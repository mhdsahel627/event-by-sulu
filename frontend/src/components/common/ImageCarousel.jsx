import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ImageCarousel({ images = [], onImageClick }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div style={{ width: '100%' }}>
      {/* Main Embla Viewport */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div ref={emblaRef} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', touchAction: 'pan-y' }}>
            {images.map((item, index) => {
              const url = typeof item === 'string' ? item : item.image;
              const caption = item.caption || `Decoration photo ${index + 1}`;
              return (
                <div
                  key={index}
                  style={{
                    flex: '0 0 100%',
                    minWidth: 0,
                    position: 'relative',
                    aspectRatio: '16/10',
                    maxHeight: '620px',
                    cursor: onImageClick ? 'pointer' : 'default',
                  }}
                  onClick={() => onImageClick && onImageClick(index)}
                >
                  <img
                    src={url}
                    alt={caption}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {onImageClick && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        background: 'rgba(10, 12, 16, 0.75)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                    >
                      <Maximize2 size={14} />
                      <span>View Fullscreen</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Previous Slide"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(10, 12, 16, 0.75)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next Slide"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(10, 12, 16, 0.75)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '14px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {images.map((item, index) => {
            const url = typeof item === 'string' ? item : item.image;
            const isSelected = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                aria-label={`Thumbnail ${index + 1}`}
                style={{
                  flex: '0 0 90px',
                  height: '64px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: isSelected ? 1 : 0.6,
                  transition: 'all 0.2s',
                  background: 'none',
                }}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
