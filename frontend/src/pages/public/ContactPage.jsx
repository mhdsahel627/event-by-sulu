import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, MessageSquare, Mail, MapPin, Instagram, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const preselectedDesignId = searchParams.get('design') || '';
  const preselectedDesignTitle = searchParams.get('title') || '';

  const { settings, getWhatsAppLink, getPhoneLink, getEmailLink } = useSettings();

  const [designs, setDesigns] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    selected_design: preselectedDesignId,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDesigns() {
      try {
        const data = await api.getDesigns();
        setDesigns(data || []);
      } catch (err) {
        console.warn('Could not load designs for dropdown:', err);
      }
    }
    loadDesigns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError('Please provide your name, phone number, and celebration details.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        selected_design: formData.selected_design ? parseInt(formData.selected_design, 10) : null,
      };
      await api.submitInquiry(payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Unable to send inquiry right now. Please try reaching out directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 50px)', minHeight: '85vh', paddingBottom: '120px' }}>
      <div className="container">
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 72px auto' }}>
          <span className="badge-gold" style={{ marginBottom: '14px' }}>
            Atelier Consultation
          </span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 56px)', marginTop: '8px', marginBottom: '20px' }}>
            Let's Create Something Beautiful.
          </h1>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8 }}>
            Whether you are planning a grand wedding celebration, an intimate engagement, or a milestone gala, we look forward to crafting an unforgettable atmosphere.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '72px',
            alignItems: 'start',
          }}
        >
          {/* Left: Direct Contact Channels & Instant WhatsApp Card */}
          <div>
            <span className="badge-gold" style={{ marginBottom: '14px' }}>
              Direct Channels
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                marginBottom: '16px',
                marginTop: '8px',
                color: 'var(--text-primary)',
              }}
            >
              Get in Touch
            </h2>
            <div className="gold-divider-left" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '28px' }}>
              {/* WhatsApp Card */}
              {settings.whatsapp_number && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '6px',
                    padding: '28px',
                    boxShadow: 'var(--shadow-gold)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(37, 211, 102, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageSquare size={22} color="#25D366" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', color: '#F7F4EE', fontWeight: 600 }}>WhatsApp Us (Fastest)</h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{settings.whatsapp_number}</p>
                    </div>
                  </div>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <MessageSquare size={16} />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              )}

              {/* Direct Phone */}
              {settings.phone && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '22px 26px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Phone size={20} color="var(--accent-gold)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Telephone</span>
                    <a
                      href={getPhoneLink()}
                      style={{ display: 'block', color: '#F7F4EE', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Direct Email */}
              {settings.email && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '22px 26px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Mail size={20} color="var(--accent-gold)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</span>
                    <a
                      href={getEmailLink()}
                      style={{ display: 'block', color: '#F7F4EE', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Address / Location (Only when configured) */}
              {settings.address && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '22px 26px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <MapPin size={20} color="var(--accent-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Studio Location</span>
                    <p style={{ color: '#F7F4EE', fontSize: '15px', lineHeight: 1.5 }}>
                      {settings.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram (Only when configured) */}
              {settings.instagram_url && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '22px 26px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Instagram size={20} color="var(--accent-gold)" />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Instagram</span>
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', color: 'var(--accent-gold-light)', textDecoration: 'none', fontSize: '15px' }}
                    >
                      Follow @{settings.business_name}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact Enquiry Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '44px 36px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <CheckCircle2 size={56} color="#25D366" style={{ margin: '0 auto 20px auto' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginBottom: '12px' }}>
                  Thank you for reaching out
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
                  Your consultation enquiry has been delivered to our team. We will get in touch with you promptly.
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageSquare size={16} />
                  <span>Continue on WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <span className="badge-gold" style={{ marginBottom: '12px' }}>
                  Send A Note
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '24px',
                    marginBottom: '8px',
                    marginTop: '6px',
                  }}
                >
                  Consultation Request
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
                  Share your event dates, venue location, and decor preferences with our design atelier.
                </p>

                {error && (
                  <div
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F87171',
                      borderRadius: '3px',
                      fontSize: '13px',
                      marginBottom: '20px',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Khan"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone / WhatsApp Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address (Optional)</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. sarah@example.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="selected_design">Selected Design (Optional)</label>
                  <select
                    id="selected_design"
                    name="selected_design"
                    value={formData.selected_design}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- General Celebration Consultation --</option>
                    {designs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} ({d.category_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Celebration Vision & Event Dates *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the celebration type, dates, city/venue, and decor themes you love..."
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gold"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Sending Request...' : 'Submit Consultation Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
