import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, CheckCircle2, Trash2, Calendar, X } from 'lucide-react';
import { api } from '../../services/api';

export default function InquiriesManagePage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', color: '#F8FAFC', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>
          Customer Enquiries Inbox
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>
          Review inbound consultation requests and reach out to customers directly via WhatsApp, phone, or email.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedInquiry ? '1fr 1fr' : '1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Table / List */}
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
              Loading inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
              No inquiries received yet. Submissions from the public website contact form will appear here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => handleSelectInquiry(inq)}
                  style={{
                    padding: '18px 20px',
                    borderBottom: '1px solid #1E232E',
                    cursor: 'pointer',
                    backgroundColor: selectedInquiry?.id === inq.id ? '#1A202C' : inq.is_read ? 'transparent' : '#151A24',
                    borderLeft: inq.is_read ? '3px solid transparent' : '3px solid #C5A880',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '15px' }}>{inq.name}</span>
                      {!inq.is_read && (
                        <span style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '10px', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                    {inq.phone} {inq.email ? `• ${inq.email}` : ''}
                  </div>

                  {inq.selected_design_title && (
                    <div style={{ fontSize: '12px', color: '#C5A880', marginBottom: '6px' }}>
                      Interested in: {inq.selected_design_title}
                    </div>
                  )}

                  <p style={{ fontSize: '13px', color: '#B8B4AA', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Inquiry Detail Drawer/Modal */}
        {selectedInquiry && (
          <div
            style={{
              backgroundColor: '#12151B',
              border: '1px solid #1E232E',
              borderRadius: '8px',
              padding: '28px',
              position: 'sticky',
              top: '80px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#F8FAFC', fontFamily: 'var(--font-serif)' }}>
                Enquiry Details
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#F8FAFC', marginBottom: '4px' }}>
                {selectedInquiry.name}
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                Received on: {new Date(selectedInquiry.created_at).toLocaleString()}
              </div>
            </div>

            {selectedInquiry.selected_design_title && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(197, 168, 128, 0.1)',
                  border: '1px solid var(--border-gold-subtle)',
                  borderRadius: '4px',
                  color: 'var(--accent-gold-light)',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                Selected Design: <strong>{selectedInquiry.selected_design_title}</strong>
              </div>
            )}

            {/* Message Box */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Customer Message
              </label>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#171B22',
                  border: '1px solid #232836',
                  borderRadius: '4px',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            {/* Convenient Direct Action Triggers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <a
                href={`https://wa.me/91${selectedInquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.name}, thank you for contacting Event by Sulu regarding ${selectedInquiry.selected_design_title ? selectedInquiry.selected_design_title : 'your celebration decor'}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{ width: '100%' }}
              >
                <MessageSquare size={16} />
                <span>Chat on WhatsApp</span>
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#2A303C', color: '#E2E8F0' }}
                >
                  <Phone size={14} />
                  <span>Call Phone</span>
                </a>

                {selectedInquiry.email ? (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent('Event by Sulu Consultation')}`}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#2A303C', color: '#E2E8F0' }}
                  >
                    <Mail size={14} />
                    <span>Send Email</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#1E232E', color: '#64748B', opacity: 0.5 }}
                  >
                    No Email
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Trash2 size={14} />
                <span>Delete Inquiry</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
