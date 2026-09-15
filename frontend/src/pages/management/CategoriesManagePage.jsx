import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, FolderTree } from 'lucide-react';
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
    if (
      window.confirm(
        `Are you sure you want to delete category "${name}"? Setups belonging to this category will also be affected.`
      )
    ) {
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
    <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
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
            Category Management
          </h1>
          <p style={{ color: 'var(--apple-text-secondary)', fontSize: '14px', margin: 0 }}>
            Curate public collection themes, cover banners, and display ordering.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="apple-btn apple-btn-gold">
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table Wrap */}
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
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div
            style={{
              padding: '56px 20px',
              textAlign: 'center',
              color: 'var(--apple-text-muted)',
            }}
          >
            <FolderTree size={36} color="var(--apple-text-subtle)" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--apple-text-secondary)' }}>
              No Categories Created Yet
            </div>
            <p style={{ fontSize: '13px', color: 'var(--apple-text-muted)', marginTop: '4px' }}>
              Click "Add New Category" to create your first collection.
            </p>
          </div>
        ) : (
          <table className="apple-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Cover</th>
                <th>Category Name</th>
                <th>Setups Count</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {cat.cover_image ? (
                      <img
                        src={cat.cover_image}
                        alt={cat.name}
                        style={{
                          width: '54px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--apple-hairline)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '54px',
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
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--apple-text-muted)' }}>
                      /{cat.slug}
                    </div>
                  </td>

                  <td style={{ color: 'var(--apple-text-secondary)', fontWeight: 500 }}>
                    {cat.designs_count || 0} designs
                  </td>

                  <td style={{ color: 'var(--apple-text-secondary)' }}>
                    #{cat.display_order}
                  </td>

                  <td>
                    {cat.is_active ? (
                      <span className="apple-badge apple-badge-success">Active</span>
                    ) : (
                      <span className="apple-badge apple-badge-danger">Inactive</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="apple-action-group">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="apple-action-btn apple-action-btn-edit"
                        aria-label={`Edit ${cat.name}`}
                        title="Edit Category"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="apple-action-btn apple-action-btn-delete"
                        aria-label={`Delete ${cat.name}`}
                        title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="apple-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="apple-modal-card" onClick={(e) => e.stopPropagation()}>
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
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                <label className="apple-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wedding Decoration"
                  className="apple-input"
                />
              </div>

              <div className="apple-input-group">
                <label className="apple-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short editorial summary for this decoration collection..."
                  className="apple-textarea"
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      style={{ width: '18px', height: '18px', accentColor: 'var(--apple-accent)' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--apple-text-primary)' }}>
                      Active on site
                    </span>
                  </label>
                </div>
              </div>

              <div className="apple-input-group" style={{ marginBottom: '24px' }}>
                <label className="apple-label">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files[0] || null)}
                  style={{ fontSize: '13px', color: 'var(--apple-text-secondary)' }}
                />
                {editingCategory?.cover_image && !coverImageFile && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--apple-text-muted)' }}>
                    Current image attached. Choose a new file above to replace it.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
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
