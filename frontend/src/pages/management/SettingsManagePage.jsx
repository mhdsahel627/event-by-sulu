import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Phone, MessageSquare, Mail, MapPin, Instagram, Globe } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function SettingsManagePage() {
  const { refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    address: '',
    instagram_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCurrentSettings() {
      try {
        const data = await api.getSettings();
        if (data) {
          setFormData({
            business_name: data.business_name || '',
            tagline: data.tagline || '',
            phone: data.phone || '',
            whatsapp_number: data.whatsapp_number || '',
            email: data.email || '',
            address: data.address || '',
            instagram_url: data.instagram_url || '',
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurrentSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await api.updateSettings(formData);
      await refreshSettings();
      setSaved(true);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#94A3B8', padding: '40px' }}>Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', color: '#F8FAFC', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>
          Site & Brand Configuration
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>
          Update business contact numbers, email, location, and social links. Changes are reflected live across the entire public website.
        </p>
      </div>

      {saved && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34D399',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Site settings successfully updated! Public website now reflects the new details.</span>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '24px',
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#12151B',
          border: '1px solid #1E232E',
          borderRadius: '8px',
          padding: '32px',
        }}
      >
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="business_name">
            Brand / Business Name *
          </label>
          <input
            id="business_name"
            type="text"
            name="business_name"
            required
            value={formData.business_name}
            onChange={handleChange}
            className="form-input"
            style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="tagline">
            Tagline / Supporting Statement
          </label>
          <input
            id="tagline"
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="form-input"
            style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="phone">
              Primary Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9048851677"
                className="form-input"
                style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', paddingLeft: '40px' }}
              />
              <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="whatsapp_number">
              WhatsApp Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="whatsapp_number"
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="e.g. 9048851677"
                className="form-input"
                style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', paddingLeft: '40px' }}
              />
              <MessageSquare size={16} color="#25D366" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="email">
            Business Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. sahelmhd3@gmail.com"
              className="form-input"
              style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', paddingLeft: '40px' }}
            />
            <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '16px' }} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="address">
            Studio / Workshop Address (Leave blank if not applicable)
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Physical studio address, city, state..."
              className="form-textarea"
              style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', minHeight: '80px', paddingLeft: '40px' }}
            />
            <MapPin size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '16px' }} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="instagram_url">
            Instagram URL (Leave blank if not applicable)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="instagram_url"
              type="url"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              placeholder="https://instagram.com/eventbysulu"
              className="form-input"
              style={{ backgroundColor: '#191D24', borderColor: '#2A303C', color: '#F8FAFC', paddingLeft: '40px' }}
            />
            <Instagram size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '16px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-gold"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
