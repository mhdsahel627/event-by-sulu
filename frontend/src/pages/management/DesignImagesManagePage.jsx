import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Info, Image as ImageIcon, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function DesignImagesManagePage() {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const designData = await api.getDesign(id);
      setDesign(designData);
      setImages(designData.additional_images || []);
    } catch (err) {
      console.error('Failed to load design photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('design', id);
    if (caption) {
      formData.append('caption', caption);
    }
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await api.uploadDesignImages(formData);
      setSelectedFiles([]);
      setCaption('');
      setMessage('Photos successfully uploaded and synced to Gallery!');
      await loadData();
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('Failed to upload photos. Please verify files.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Delete this photo? It will also be removed from the public Gallery.')) {
      try {
        await api.deleteDesignImage(imageId);
        await loadData();
      } catch (err) {
        alert('Failed to delete image.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link
        to="/management/designs"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#94A3B8',
          textDecoration: 'none',
          fontSize: '13px',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Designs</span>
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#C5A880', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {design?.category_name}
          </span>
        </div>
        <h1 style={{ fontSize: '28px', color: '#F8FAFC', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
          Photo Manager: {design?.title || 'Design'}
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>
          Upload high-resolution photographs of this decoration setup.
        </p>
      </div>

      {/* SINGLE SOURCE OF TRUTH EDUCATIONAL NOTICE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          padding: '18px 20px',
          backgroundColor: 'rgba(197, 168, 128, 0.08)',
          border: '1px solid var(--border-gold-subtle)',
          borderRadius: '6px',
          marginBottom: '36px',
        }}
      >
        <Info size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ color: '#F8FAFC', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            Gallery images come from your design photos
          </h4>
          <p style={{ color: '#B8B4AA', fontSize: '13px', lineHeight: 1.6 }}>
            There is no separate gallery upload. Any photo uploaded here automatically appears in the public <strong>/gallery</strong> and in this design's fullscreen Lightbox.
          </p>
        </div>
      </div>

      {/* Multi-Photo Upload Area */}
      <div
        style={{
          backgroundColor: '#12151B',
          border: '1px solid #1E232E',
          borderRadius: '8px',
          padding: '28px',
          marginBottom: '40px',
        }}
      >
        <h3 style={{ fontSize: '17px', color: '#F8FAFC', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
          + Add New Photos
        </h3>

        {message && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: message.includes('Failed') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)',
              color: message.includes('Failed') ? '#F87171' : '#34D399',
              borderRadius: '4px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Select Multiple Image Files *</label>
              <input
                type="file"
                multiple
                accept="image/*"
                required
                onChange={handleFileSelect}
                style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}
              />
              {selectedFiles.length > 0 && (
                <div style={{ fontSize: '12px', color: '#60A5FA', marginTop: '6px' }}>
                  {selectedFiles.length} file(s) ready to upload
                </div>
              )}
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Optional Caption / Angle</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Frontal Stage View, Floral Pillar Close-up..."
                className="form-input"
                style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', marginTop: '6px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || selectedFiles.length === 0}
            className="btn btn-gold btn-sm"
          >
            <Upload size={14} />
            <span>{uploading ? 'Uploading & Syncing...' : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Photos`}</span>
          </button>
        </form>
      </div>

      {/* Primary Cover Image Preview */}
      {design?.primary_image && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Primary Cover Image
          </h3>
          <div
            style={{
              display: 'inline-block',
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '2px solid var(--accent-gold)',
              maxWidth: '320px',
            }}
          >
            <img
              src={design.primary_image}
              alt="Primary cover"
              style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '4px 8px',
                borderRadius: '2px',
                fontSize: '11px',
                color: 'var(--accent-gold-light)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Primary Cover
            </div>
          </div>
        </div>
      )}

      {/* Additional Design Photos Grid */}
      <div>
        <h3 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Additional Gallery Photos ({images.length})
        </h3>

        {loading ? (
          <div style={{ color: '#94A3B8', padding: '24px 0' }}>Loading photos...</div>
        ) : images.length === 0 ? (
          <div
            style={{
              padding: '40px',
              backgroundColor: '#12151B',
              borderRadius: '6px',
              textAlign: 'center',
              color: '#94A3B8',
              border: '1px dashed #2A303C',
            }}
          >
            No additional photos uploaded yet. Use the upload box above to add photos.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                style={{
                  backgroundColor: '#12151B',
                  border: '1px solid #1E232E',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                  <img
                    src={img.image}
                    alt={img.caption || 'Design photo'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    aria-label="Delete image"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      border: 'none',
                      color: '#FFFFFF',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#E2E8F0', margin: 0 }}>
                    {img.caption || 'No caption'}
                  </p>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Order: #{img.display_order}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
