import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Filter,
  Search,
  X,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/api';

export default function DesignsManagePage() {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    short_description: '',
    detailed_description: '',
    display_order: 0,
    is_featured: false,
    is_active: true,
  });
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, designsData] = await Promise.all([
        api.getCategories(),
        api.getDesigns(selectedCategoryFilter ? { category: selectedCategoryFilter } : {}),
      ]);
      setCategories(cats || []);
      setDesigns(designsData || []);
    } catch (err) {
      console.error('Failed to load designs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategoryFilter]);

  // Filtered designs by search query
  const filteredDesigns = useMemo(() => {
    if (!searchQuery.trim()) return designs;
    const q = searchQuery.toLowerCase();
    return designs.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.short_description?.toLowerCase().includes(q) ||
        d.category_name?.toLowerCase().includes(q)
    );
  }, [designs, searchQuery]);

  const handleOpenAdd = () => {
    setEditingDesign(null);
    setFormData({
      category: categories[0]?.id || '',
      title: '',
      short_description: '',
      detailed_description: '',
      display_order: designs.length + 1,
      is_featured: false,
      is_active: true,
    });
    setPrimaryImageFile(null);
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = async (d) => {
    try {
      const full = await api.getDesign(d.id);
      setEditingDesign(full);
      setFormData({
        category: full.category || '',
        title: full.title,
        short_description: full.short_description || '',
        detailed_description: full.detailed_description || '',
        display_order: full.display_order || 0,
        is_featured: full.is_featured,
        is_active: full.is_active,
      });
      setPrimaryImageFile(null);
      setError(null);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to load design details.');
    }
  };

  const handleDelete = async (id, title) => {
    if (
      window.confirm(
        `Are you sure you want to delete decoration setup "${title}"? This will also remove its associated gallery images.`
      )
    ) {
      try {
        await api.deleteDesign(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete design.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setError('Please select a category.');
      return;
    }

    setSaving(true);
    setError(null);

    const data = new FormData();
    data.append('category', formData.category);
    data.append('title', formData.title);
    data.append('short_description', formData.short_description);
    data.append('detailed_description', formData.detailed_description);
    data.append('display_order', formData.display_order);
    data.append('is_featured', formData.is_featured ? 'true' : 'false');
    data.append('is_active', formData.is_active ? 'true' : 'false');
    if (primaryImageFile) {
      data.append('primary_image', primaryImageFile);
    }

    try {
      if (editingDesign) {
        await api.updateDesign(editingDesign.id, data);
      } else {
        if (!primaryImageFile) {
          setError('Primary cover image is required for a new design.');
          setSaving(false);
          return;
        }
        await api.createDesign(data);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Save design error:', err);
      setError(err.message || 'Error saving design.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(22px, 3vw, 26px)',
              fontWeight: 600,
              color: 'var(--apple-text-primary)',
              fontFamily: 'var(--font-serif)',
              marginBottom: '4px',
            }}
          >
            Design & Portfolio Catalog
          </h1>
          <p style={{ color: 'var(--apple-text-secondary)', fontSize: '14px', margin: 0 }}>
            Manage decoration setups, photo albums, and spotlight features.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="apple-btn apple-btn-gold">
          <Plus size={16} />
          <span>Add New Design</span>
        </button>
      </div>

      {/* Filter and Search Controls (Apple Segmented Bar) */}
      <div
        className="apple-card"
        style={{
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px' }}>
          <Filter size={15} color="var(--apple-text-muted)" />
          <span style={{ fontSize: '12px', color: 'var(--apple-text-secondary)', fontWeight: 500 }}>
            Category:
          </span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="apple-select"
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              maxWidth: '220px',
            }}
          >
            <option value="">All Categories ({designs.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: '320px',
          }}
        >
          <Search
            size={14}
            color="var(--apple-text-muted)"
            style={{ position: 'absolute', left: '10px', top: '10px' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designs by title..."
            className="apple-input"
            style={{
              padding: '7px 12px 7px 32px',
              fontSize: '13px',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '8px',
                background: 'none',
                border: 'none',
                color: 'var(--apple-text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Designs Table Container */}
      <div className="apple-table-wrap">
        {loading ? (
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              color: 'var(--apple-text-muted)',
              fontSize: '14px',
            }}
          >
            Loading decoration setups...
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div
            style={{
              padding: '56px 20px',
              textAlign: 'center',
              color: 'var(--apple-text-muted)',
            }}
          >
            <Sparkles size={36} color="var(--apple-text-subtle)" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--apple-text-secondary)' }}>
              {searchQuery ? 'No designs matching your search' : 'No decoration setups found'}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--apple-text-muted)', marginTop: '4px' }}>
              {searchQuery
                ? 'Try a different keyword or clear your filter.'
                : 'Click "Add New Design" above to publish your first portfolio piece.'}
            </p>
          </div>
        ) : (
          <table className="apple-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Cover</th>
                <th>Setup Title & Theme</th>
                <th>Gallery Photos</th>
                <th>Spotlight</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDesigns.map((d) => (
                <tr key={d.id}>
                  <td>
                    {d.primary_image ? (
                      <img
                        src={d.primary_image}
                        alt={d.title}
                        style={{
                          width: '56px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--apple-hairline)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '56px',
                          height: '40px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--apple-surface-elevated)',
                          border: '1px solid var(--apple-hairline)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--apple-text-muted)',
                        }}
                      >
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </td>

                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--apple-text-primary)',
                        fontSize: '14px',
                      }}
                    >
                      {d.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--apple-accent)',
                        marginTop: '2px',
                      }}
                    >
                      {d.category_name}
                    </div>
                  </td>

                  <td>
                    <Link
                      to={`/management/designs/${d.id}/images`}
                      className="apple-action-btn"
                      style={{
                        padding: '5px 10px',
                        backgroundColor: 'var(--apple-blue-subtle)',
                        borderColor: 'rgba(96, 165, 250, 0.25)',
                        color: 'var(--apple-blue)',
                      }}
                    >
                      <ImageIcon size={13} />
                      <span>{d.images_count || 0} Photos &rarr; Manage</span>
                    </Link>
                  </td>

                  <td>
                    {d.is_featured ? (
                      <span className="apple-badge apple-badge-gold">
                        <Sparkles size={11} />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--apple-text-muted)', fontSize: '12px' }}>
                        Standard
                      </span>
                    )}
                  </td>

                  <td>
                    {d.is_active ? (
                      <span className="apple-badge apple-badge-success">Active</span>
                    ) : (
                      <span className="apple-badge apple-badge-muted">Hidden</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="apple-action-group">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="apple-action-btn apple-action-btn-edit"
                        aria-label={`Edit ${d.title}`}
                        title="Edit Design Details"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(d.id, d.title)}
                        className="apple-action-btn apple-action-btn-delete"
                        aria-label={`Delete ${d.title}`}
                        title="Delete Design"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Design Modal */}
      {modalOpen && (
        <div className="apple-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="apple-modal-card"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--apple-hairline)',
              }}
            >
              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                  fontFamily: 'var(--font-serif)',
                  margin: 0,
                }}
              >
                {editingDesign ? 'Edit Decoration Setup' : 'Add New Decoration Setup'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--apple-text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--apple-danger-subtle)',
                  color: 'var(--apple-danger)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: 'var(--apple-radius-sm)',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="apple-input-group">
                <label className="apple-label">Category Theme *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="apple-select"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="apple-input-group">
                <label className="apple-label">Setup Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Emerald Stage Arch"
                  className="apple-input"
                />
              </div>

              <div className="apple-input-group">
                <label className="apple-label">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="e.g. Bespoke floral canopy with gold pillar arches"
                  className="apple-input"
                />
              </div>

              <div className="apple-input-group">
                <label className="apple-label">Detailed Description</label>
                <textarea
                  value={formData.detailed_description}
                  onChange={(e) =>
                    setFormData({ ...formData, detailed_description: e.target.value })
                  }
                  placeholder="Full floral composition notes, dimensions, lighting styling, etc..."
                  className="apple-textarea"
                />
              </div>

              {/* Toggles & Display Order */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div className="apple-input-group">
                  <label className="apple-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="apple-input"
                  />
                </div>

                <div className="apple-input-group">
                  <label className="apple-label">Spotlight</label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      height: '46px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--apple-accent)',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--apple-text-primary)' }}>
                      Feature on Home
                    </span>
                  </label>
                </div>

                <div className="apple-input-group">
                  <label className="apple-label">Status</label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      height: '46px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--apple-accent)',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--apple-text-primary)' }}>
                      Active on site
                    </span>
                  </label>
                </div>
              </div>

              {/* Primary Image Upload */}
              <div className="apple-input-group" style={{ marginBottom: '24px' }}>
                <label className="apple-label">
                  Primary Cover Photo {editingDesign ? '' : '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPrimaryImageFile(e.target.files[0] || null)}
                  style={{ fontSize: '13px', color: 'var(--apple-text-secondary)' }}
                />
                {editingDesign?.primary_image && !primaryImageFile && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: 'var(--apple-text-muted)',
                    }}
                  >
                    Current cover active. Choose a new file above to replace it.
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--apple-hairline)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="apple-btn apple-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="apple-btn apple-btn-gold"
                >
                  <span>{saving ? 'Saving...' : 'Save Setup'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
