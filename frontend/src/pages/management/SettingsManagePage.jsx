import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Instagram,
  Globe,
  Store,
  Sparkles,
} from 'lucide-react';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--apple-text-muted)', padding: '40px', textAlign: 'center' }}>
        Loading brand configuration...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: 'clamp(22px, 3vw, 26px)',
            fontWeight: 600,
            color: 'var(--apple-text-primary)',
            fontFamily: 'var(--font-serif)',
            marginBottom: '4px',
          }}
        >
          Site & Brand Configuration
        </h1>
        <p style={{ color: 'var(--apple-text-secondary)', fontSize: '14px', margin: 0 }}>
          Manage your public atelier contact numbers, studio address, and social links in real time.
        </p>
      </div>

      {saved && (
        <div
          className="apple-card"
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--apple-success-subtle)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: 'var(--apple-success)',
            borderRadius: 'var(--apple-radius-md)',
            fontSize: '13px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Configuration saved successfully! Public website is now updated with these details.</span>
        </div>
      )}

      {error && (
        <div
          className="apple-card"
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--apple-danger-subtle)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            color: 'var(--apple-danger)',
            borderRadius: 'var(--apple-radius-md)',
            fontSize: '13px',
            marginBottom: '24px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Group 1: Brand & Atelier Identity */}
        <div className="apple-card">
          <div className="apple-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={16} color="var(--apple-accent)" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--apple-text-primary)' }}>
                Atelier Brand Identity
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--apple-text-muted)', textTransform: 'uppercase' }}>
              Public Display
            </span>
          </div>

          <div className="apple-card-body">
            <div className="apple-input-group">
              <label className="apple-label" htmlFor="business_name">
                Brand / Atelier Name *
              </label>
              <input
                id="business_name"
                type="text"
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleChange}
                className="apple-input"
                placeholder="e.g. Event by Sulu"
              />
            </div>

            <div className="apple-input-group" style={{ margin: 0 }}>
              <label className="apple-label" htmlFor="tagline">
                Tagline / Brand Statement
              </label>
              <input
                id="tagline"
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="apple-input"
                placeholder="e.g. Bespoke Event & Wedding Decoration Atelier"
              />
            </div>
          </div>
        </div>

        {/* Group 2: Customer Contact Channels */}
        <div className="apple-card">
          <div className="apple-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="var(--apple-accent)" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--apple-text-primary)' }}>
                Customer Communication Channels
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--apple-text-muted)', textTransform: 'uppercase' }}>
              Live Floating Buttons
            </span>
          </div>

          <div className="apple-card-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div className="apple-input-group" style={{ margin: 0 }}>
                <label className="apple-label" htmlFor="phone">
                  Official Phone Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="apple-input"
                    placeholder="e.g. 9048851677"
                  />
                </div>
              </div>

              <div className="apple-input-group" style={{ margin: 0 }}>
                <label className="apple-label" htmlFor="whatsapp_number">
                  WhatsApp Direct Line *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="whatsapp_number"
                    type="text"
                    name="whatsapp_number"
                    required
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    className="apple-input"
                    placeholder="e.g. 9048851677"
                  />
                </div>
              </div>
            </div>

            <div className="apple-input-group" style={{ margin: 0 }}>
              <label className="apple-label" htmlFor="email">
                Inquiry & Notification Email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="apple-input"
                placeholder="e.g. sahelmhd3@gmail.com"
              />
            </div>
          </div>
        </div>

        {/* Group 3: Location & Social Links */}
        <div className="apple-card">
          <div className="apple-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--apple-accent)" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--apple-text-primary)' }}>
                Studio Address & Social Media
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--apple-text-muted)', textTransform: 'uppercase' }}>
              Footer Info
            </span>
          </div>

          <div className="apple-card-body">
            <div className="apple-input-group">
              <label className="apple-label" htmlFor="address">
                Physical Studio / Office Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="apple-textarea"
                placeholder="e.g. Atelier Studio, Kerala, India"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="apple-input-group" style={{ margin: 0 }}>
              <label className="apple-label" htmlFor="instagram_url">
                Official Instagram Profile URL
              </label>
              <input
                id="instagram_url"
                type="url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="apple-input"
                placeholder="https://instagram.com/eventbysulu"
              />
            </div>
          </div>
        </div>

        {/* Sticky/Accessible Save Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '8px',
          }}
        >
          <button
            type="submit"
            disabled={saving}
            className="apple-btn apple-btn-gold"
            style={{ minWidth: '180px', padding: '12px 24px', fontSize: '14px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Updating Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
