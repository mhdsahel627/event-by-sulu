import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Trash2,
  Info,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
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
      setMessage({ type: 'success', text: 'Photos successfully uploaded and synced to Gallery!' });
      await loadData();
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: 'Failed to upload photos. Please verify files.' });
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
    <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link
        to="/management/designs"
        className="apple-action-btn"
        style={{
          display: 'inline-flex',
          marginBottom: '20px',
          padding: '8px 14px',
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Designs</span>
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="apple-badge apple-badge-gold">
            {design?.category_name || 'Theme'}
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 600,
            color: 'var(--apple-text-primary)',
            fontFamily: 'var(--font-serif)',
            marginBottom: '6px',
          }}
        >
          Photo Manager: {design?.title || 'Decoration Setup'}
        </h1>
        <p style={{ color: 'var(--apple-text-secondary)', fontSize: '14px', margin: 0 }}>
          Upload high-resolution photographs of this decoration setup.
        </p>
      </div>

      {/* Educational Notice: Single Source of Truth */}
      <div
        className="apple-card"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          backgroundColor: 'var(--apple-accent-subtle)',
          borderColor: 'var(--apple-hairline-gold)',
        }}
      >
        <Info
          size={18}
          color="var(--apple-accent)"
          style={{ flexShrink: 0, marginTop: '2px' }}
        />
        <div>
          <div
            style={{
              color: 'var(--apple-text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '3px',
            }}
          >
            Gallery photos automatically sync from here
          </div>
          <p
            style={{
              color: 'var(--apple-text-secondary)',
              fontSize: '12px',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Any photo uploaded here automatically appears in the public{' '}
            <strong style={{ color: 'var(--apple-text-primary)' }}>/gallery</strong> and in this
            design's customer lightbox.
          </p>
        </div>
      </div>

      {/* Multi-Photo Upload Area */}
      <div className="apple-card" style={{ marginBottom: '32px' }}>
        <div className="apple-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} color="var(--apple-accent)" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--apple-text-primary)',
              }}
            >
              Upload New High-Res Photos
            </span>
          </div>
        </div>

        <div className="apple-card-body">
          {message && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--apple-radius-sm)',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor:
                  message.type === 'error'
                    ? 'var(--apple-danger-subtle)'
                    : 'var(--apple-success-subtle)',
                color:
                  message.type === 'error' ? 'var(--apple-danger)' : 'var(--apple-success)',
                border: `1px solid ${
                  message.type === 'error'
                    ? 'rgba(248, 113, 113, 0.3)'
                    : 'rgba(52, 211, 153, 0.3)'
                }`,
              }}
            >
              <CheckCircle2 size={16} />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUpload}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="apple-input-group" style={{ margin: 0 }}>
                <label className="apple-label">Select Photos *</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  required
                  onChange={handleFileSelect}
                  style={{
                    fontSize: '13px',
                    color: 'var(--apple-text-secondary)',
                    padding: '8px 0',
                  }}
                />
                {selectedFiles.length > 0 && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--apple-accent)',
                      fontWeight: 500,
                      marginTop: '4px',
                    }}
                  >
                    {selectedFiles.length} photo(s) selected
                  </div>
                )}
              </div>

              <div className="apple-input-group" style={{ margin: 0 }}>
                <label className="apple-label">Optional Photo Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Center stage lighting detail"
                  className="apple-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="apple-btn apple-btn-gold"
              >
                <Upload size={14} />
                <span>{uploading ? 'Uploading to Gallery...' : 'Upload Selected Photos'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Existing Additional Photos Grid */}
      <div className="apple-card">
        <div className="apple-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={16} color="var(--apple-accent)" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--apple-text-primary)',
              }}
            >
              Attached Gallery Photography ({images.length})
            </span>
          </div>
        </div>

        <div className="apple-card-body">
          {loading ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--apple-text-muted)',
              }}
            >
              Loading photos...
            </div>
          ) : images.length === 0 ? (
            <div
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                color: 'var(--apple-text-muted)',
              }}
            >
              <ImageIcon size={36} color="var(--apple-text-subtle)" style={{ marginBottom: '12px' }} />
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--apple-text-secondary)',
                }}
              >
                No Additional Photos Yet
              </div>
              <p style={{ fontSize: '13px', color: 'var(--apple-text-muted)', marginTop: '4px' }}>
                Use the upload box above to add high-resolution photos for this setup.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  style={{
                    backgroundColor: 'var(--apple-surface-elevated)',
                    border: '1px solid var(--apple-hairline)',
                    borderRadius: 'var(--apple-radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={img.image}
                      alt={img.caption || 'Design photo'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--apple-text-primary)',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {img.caption || 'Photo #' + img.id}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                        Order #{img.display_order}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="apple-action-btn apple-action-btn-delete"
                      aria-label="Delete photo"
                      style={{ padding: '6px 8px', flexShrink: 0 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
