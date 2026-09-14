import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image as ImageIcon, Sparkles, Filter, X } from 'lucide-react';
import { api } from '../../services/api';

export default function DesignsManagePage() {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
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
    if (window.confirm(`Are you sure you want to delete design "${title}"? This will also remove its associated gallery images.`)) {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', color: '#F8FAFC', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>
            Design & Image Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>
            Create decoration setups, assign categories, and upload gallery photography.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-gold btn-sm">
          <Plus size={16} />
          <span>Add New Design</span>
        </button>
      </div>

      {/* Category Filter Dropdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          backgroundColor: '#12151B',
          padding: '12px 20px',
          borderRadius: '6px',
          border: '1px solid #1E232E',
        }}
      >
        <Filter size={16} color="#94A3B8" />
        <span style={{ fontSize: '13px', color: '#94A3B8' }}>Filter by Category:</span>
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="form-select"
          style={{
            maxWidth: '240px',
            padding: '6px 12px',
            backgroundColor: '#191D24',
            borderColor: '#2A303C',
            fontSize: '13px',
            color: '#F8FAFC',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Designs Table */}
      <div
        style={{
          backgroundColor: '#12151B',
          border: '1px solid #1E232E',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            Loading designs...
          </div>
        ) : designs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            No designs found. Click "Add New Design" above.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E232E', backgroundColor: '#171B22', color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Primary Cover</th>
                <th style={{ padding: '14px 20px' }}>Title & Category</th>
                <th style={{ padding: '14px 20px' }}>Gallery Photos</th>
                <th style={{ padding: '14px 20px' }}>Featured</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((d) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: '1px solid #1E232E',
                    color: '#E2E8F0',
                  }}
                >
                  <td style={{ padding: '12px 20px' }}>
                    {d.primary_image ? (
                      <img
                        src={d.primary_image}
                        alt={d.title}
                        style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '60px',
                          height: '42px',
                          borderRadius: '4px',
                          backgroundColor: '#1E232D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748B',
                        }}
                      >
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{d.title}</div>
                    <div style={{ fontSize: '12px', color: '#C5A880' }}>{d.category_name}</div>
                  </td>

                  <td style={{ padding: '12px 20px' }}>
                    <Link
                      to={`/management/designs/${d.id}/images`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        backgroundColor: '#1E2532',
                        border: '1px solid #2B3344',
                        color: '#60A5FA',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      <ImageIcon size={13} />
                      <span>{d.images_count} Photos &rarr; Manage</span>
                    </Link>
                  </td>

                  <td style={{ padding: '12px 20px' }}>
                    {d.is_featured ? (
                      <span style={{ color: '#FBBF24', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={13} />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span style={{ color: '#64748B', fontSize: '12px' }}>Standard</span>
                    )}
                  </td>

                  <td style={{ padding: '12px 20px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        backgroundColor: d.is_active ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: d.is_active ? '#34D399' : '#EF4444',
                      }}
                    >
                      {d.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(d)}
                        aria-label={`Edit ${d.title}`}
                        style={{
                          padding: '6px',
                          background: 'none',
                          border: '1px solid #2A303C',
                          borderRadius: '4px',
                          color: '#94A3B8',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.title)}
                        aria-label={`Delete ${d.title}`}
                        style={{
                          padding: '6px',
                          background: 'none',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '4px',
                          color: '#EF4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#12151B',
              border: '1px solid #1E232E',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', color: '#F8FAFC', fontFamily: 'var(--font-serif)' }}>
                {editingDesign ? 'Edit Design' : 'Add New Design'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                  style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Design Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Ivory & Champagne Mandap"
                  className="form-input"
                  style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Short Summary (Card Preview) *</label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief 1-2 sentence aesthetic summary..."
                  className="form-input"
                  style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Detailed Description</label>
                <textarea
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  placeholder="Full design story, materials, lighting details, and staging options..."
                  className="form-textarea"
                  style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', minHeight: '100px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="form-input"
                    style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Featured</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: '48px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C5A880' }}
                    />
                    <span style={{ fontSize: '13px', color: '#E2E8F0' }}>Home Feature</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Active</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: '48px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C5A880' }}
                    />
                    <span style={{ fontSize: '13px', color: '#E2E8F0' }}>Published</span>
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Primary Cover Image {editingDesign ? '(Optional to replace)' : '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPrimaryImageFile(e.target.files[0] || null)}
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                />
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                  Note: You can add unlimited additional photos after creating the design in "Manage Photos".
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#2A303C', color: '#94A3B8' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-gold btn-sm"
                >
                  <span>{saving ? 'Saving...' : 'Save Design'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
