import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

export default function CategoriesManagePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    display_order: 0,
    is_active: true,
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      display_order: categories.length + 1,
      is_active: true,
    });
    setCoverImageFile(null);
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      display_order: cat.display_order || 0,
      is_active: cat.is_active,
    });
    setCoverImageFile(null);
    setError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"? Designs belonging to this category will also be affected.`)) {
      try {
        await api.deleteCategory(id);
        await loadCategories();
      } catch (err) {
        alert('Failed to delete category.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('display_order', formData.display_order);
    data.append('is_active', formData.is_active ? 'true' : 'false');
    if (coverImageFile) {
      data.append('cover_image', coverImageFile);
    }

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, data);
      } else {
        await api.createCategory(data);
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      console.error('Save category error:', err);
      setError(err.message || 'Error saving category. Please verify input.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            Category Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>
            Manage public decoration collections, cover images, and display ordering.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-gold btn-sm">
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table / List */}
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
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            No categories created yet. Click "Add New Category" above.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E232E', backgroundColor: '#171B22', color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Cover</th>
                <th style={{ padding: '14px 20px' }}>Category Name</th>
                <th style={{ padding: '14px 20px' }}>Designs</th>
                <th style={{ padding: '14px 20px' }}>Order</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  style={{
                    borderBottom: '1px solid #1E232E',
                    color: '#E2E8F0',
                  }}
                >
                  <td style={{ padding: '12px 20px' }}>
                    {cat.cover_image ? (
                      <img
                        src={cat.cover_image}
                        alt={cat.name}
                        style={{ width: '54px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '54px',
                          height: '40px',
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
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{cat.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>/{cat.slug}</div>
                  </td>
                  <td style={{ padding: '12px 20px', color: '#94A3B8' }}>
                    {cat.designs_count || 0}
                  </td>
                  <td style={{ padding: '12px 20px', color: '#94A3B8' }}>
                    {cat.display_order}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        backgroundColor: cat.is_active ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: cat.is_active ? '#34D399' : '#EF4444',
                      }}
                    >
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        aria-label={`Edit ${cat.name}`}
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
                        onClick={() => handleDelete(cat.id, cat.name)}
                        aria-label={`Delete ${cat.name}`}
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

      {/* Add / Edit Category Modal */}
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
              maxWidth: '520px',
              backgroundColor: '#12151B',
              border: '1px solid #1E232E',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', color: '#F8FAFC', fontFamily: 'var(--font-serif)' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wedding Decoration"
                  className="form-input"
                  style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short editorial summary for this collection..."
                  className="form-textarea"
                  style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                  <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: '48px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C5A880' }}
                    />
                    <span style={{ fontSize: '14px', color: '#E2E8F0' }}>Active on website</span>
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }}>Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files[0] || null)}
                  style={{ fontSize: '13px', color: '#94A3B8' }}
                />
                {editingCategory?.cover_image && !coverImageFile && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748B' }}>
                    Current image attached. Select a new file above to replace.
                  </div>
                )}
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
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
