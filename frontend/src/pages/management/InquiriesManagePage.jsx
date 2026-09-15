import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Trash2,
  Calendar,
  X,
  Inbox,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function InquiriesManagePage() {
  const { settings } = useSettings();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unread'
  const [searchQuery, setSearchQuery] = useState('');

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getInquiries();
      setInquiries(data || []);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markInquiryRead(id);
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => ({ ...prev, is_read: true }));
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry record?')) {
      try {
        await api.deleteInquiry(id);
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        await loadInquiries();
      } catch (err) {
        alert('Failed to delete inquiry.');
      }
    }
  };

  const handleSelectInquiry = (inq) => {
    setSelectedInquiry(inq);
    if (!inq.is_read) {
      handleMarkRead(inq.id);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter === 'unread' && inq.is_read) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        inq.name?.toLowerCase().includes(q) ||
        inq.phone?.toLowerCase().includes(q) ||
        inq.email?.toLowerCase().includes(q) ||
        inq.message?.toLowerCase().includes(q) ||
        inq.selected_design_title?.toLowerCase().includes(q)
      );
    });
  }, [inquiries, statusFilter, searchQuery]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header */}
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
            Customer Enquiries Inbox
          </h1>
          <p style={{ color: 'var(--apple-text-secondary)', fontSize: '14px', margin: 0 }}>
            Inbound consultation requests submitted from your public website contact form.
          </p>
        </div>

        {/* Status Segmented Pill */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--apple-surface)',
            border: '1px solid var(--apple-hairline)',
            borderRadius: 'var(--apple-radius-pill)',
            padding: '3px',
          }}
        >
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              background: statusFilter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              color: statusFilter === 'all' ? '#FFFFFF' : 'var(--apple-text-secondary)',
              padding: '6px 14px',
              borderRadius: 'var(--apple-radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--apple-transition)',
            }}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            style={{
              background: statusFilter === 'unread' ? 'rgba(248,113,113,0.18)' : 'transparent',
              border: 'none',
              color: statusFilter === 'unread' ? 'var(--apple-danger)' : 'var(--apple-text-secondary)',
              padding: '6px 14px',
              borderRadius: 'var(--apple-radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--apple-transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Unread</span>
            {inquiries.filter((i) => !i.is_read).length > 0 && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--apple-danger)',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          position: 'relative',
          maxWidth: '380px',
          marginBottom: '20px',
        }}
      >
        <Search
          size={14}
          color="var(--apple-text-muted)"
          style={{ position: 'absolute', left: '12px', top: '12px' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inquiries by name, phone, message..."
          className="apple-input"
          style={{ paddingLeft: '34px', fontSize: '13px' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
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

      {/* Main Inbox Layout: Split on Desktop, Stack on Mobile */}
      <div
        className="inbox-grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: selectedInquiry ? '1fr 1fr' : '1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Inquiries List Card */}
        <div className="apple-card">
          <div className="apple-card-header">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apple-text-secondary)' }}>
              Showing {filteredInquiries.length} enquiry record(s)
            </span>
          </div>

          <div>
            {loading ? (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--apple-text-muted)',
                  fontSize: '14px',
                }}
              >
                Loading inquiries...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div
                style={{
                  padding: '56px 20px',
                  textAlign: 'center',
                  color: 'var(--apple-text-muted)',
                }}
              >
                <Inbox size={36} color="var(--apple-text-subtle)" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--apple-text-secondary)' }}>
                  No Inquiries Found
                </div>
                <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)', marginTop: '4px' }}>
                  {searchQuery ? 'Try clearing your search keyword.' : 'New inquiries will appear here.'}
                </p>
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const cleanPhone = inq.phone?.replace(/\D/g, '') || '';
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    style={{
                      padding: '16px 18px',
                      borderBottom: '1px solid var(--apple-hairline)',
                      cursor: 'pointer',
                      backgroundColor: isSelected
                        ? 'rgba(255, 255, 255, 0.05)'
                        : inq.is_read
                        ? 'transparent'
                        : 'rgba(197, 168, 128, 0.03)',
                      borderLeft: inq.is_read
                        ? '3px solid transparent'
                        : '3px solid var(--apple-accent)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'var(--apple-text-primary)',
                            fontSize: '14px',
                          }}
                        >
                          {inq.name}
                        </span>
                        {!inq.is_read ? (
                          <span className="apple-badge apple-badge-danger">NEW</span>
                        ) : (
                          <span className="apple-badge apple-badge-muted">READ</span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--apple-text-secondary)', marginBottom: '6px' }}>
                      {inq.phone} {inq.email ? `• ${inq.email}` : ''}
                    </div>

                    {inq.selected_design_title && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--apple-accent)',
                          fontWeight: 500,
                          marginBottom: '6px',
                        }}
                      >
                        Interested in: {inq.selected_design_title}
                      </div>
                    )}

                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--apple-text-muted)',
                        margin: '0 0 10px 0',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {inq.message}
                    </p>

                    {/* Quick Action Touch Buttons */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cleanPhone && (
                        <>
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                              `Hi ${inq.name}, thank you for contacting ${settings.business_name || 'Event by Sulu'}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="apple-action-btn"
                            style={{
                              backgroundColor: 'rgba(37, 211, 102, 0.12)',
                              color: '#25D366',
                              borderColor: 'rgba(37, 211, 102, 0.25)',
                              padding: '6px 10px',
                            }}
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${inq.phone}`}
                            className="apple-action-btn"
                            style={{ padding: '6px 10px' }}
                          >
                            <Phone size={13} />
                            <span>Call</span>
                          </a>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="apple-action-btn apple-action-btn-delete"
                        style={{ marginLeft: 'auto', padding: '6px 10px' }}
                        aria-label="Delete inquiry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Inquiry Detail Pane (Sticky on Desktop, Modal on Mobile) */}
        {selectedInquiry && (
          <div
            className="inquiry-detail-pane apple-card"
            style={{
              position: 'sticky',
              top: '80px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
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
                Enquiry Details
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
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

            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                  marginBottom: '4px',
                }}
              >
                {selectedInquiry.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--apple-text-secondary)' }}>
                Submitted: {new Date(selectedInquiry.created_at).toLocaleString()}
              </div>
            </div>

            {/* Contact Details Group */}
            <div
              style={{
                backgroundColor: 'var(--apple-surface-elevated)',
                border: '1px solid var(--apple-hairline)',
                borderRadius: 'var(--apple-radius-md)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={15} color="var(--apple-accent)" />
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  style={{ color: 'var(--apple-text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
                >
                  {selectedInquiry.phone}
                </a>
              </div>

              {selectedInquiry.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={15} color="var(--apple-accent)" />
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    style={{ color: 'var(--apple-text-secondary)', textDecoration: 'none', fontSize: '14px' }}
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
              )}

              {selectedInquiry.selected_design_title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="apple-badge apple-badge-gold">Selected Setup</span>
                  <span style={{ fontSize: '13px', color: 'var(--apple-text-primary)', fontWeight: 500 }}>
                    {selectedInquiry.selected_design_title}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Message Body */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--apple-text-muted)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Customer Message
              </div>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--apple-radius-md)',
                  border: '1px solid var(--apple-hairline)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--apple-text-primary)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <a
                href={`https://wa.me/91${selectedInquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${selectedInquiry.name}, thank you for contacting ${settings.business_name || 'Event by Sulu'}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-btn apple-btn-whatsapp"
                style={{ flex: 1, minWidth: '130px' }}
              >
                <MessageSquare size={15} />
                <span>Open WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedInquiry.phone}`}
                className="apple-btn apple-btn-secondary"
                style={{ flex: 1, minWidth: '100px' }}
              >
                <Phone size={15} />
                <span>Call Client</span>
              </a>

              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                className="apple-btn apple-btn-danger"
                style={{ padding: '8px 12px' }}
                aria-label="Delete inquiry"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .inbox-grid-container {
            grid-template-columns: 1fr !important;
          }
          .inquiry-detail-pane {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9999 !important;
            top: 0 !important;
            border-radius: 0 !important;
            overflow-y: auto !important;
            max-height: 100vh !important;
            background-color: var(--apple-surface) !important;
          }
        }
      `}</style>
    </div>
  );
}
