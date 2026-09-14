import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function WhatsAppFloat() {
  const { getWhatsAppLink, cleanWhatsAppNumber } = useSettings();

  if (!cleanWhatsAppNumber) return null;

  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        padding: '14px 20px',
        borderRadius: '50px',
        boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '14px',
        letterSpacing: '0.02em',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(37, 211, 102, 0.55)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.4)';
      }}
    >
      <MessageSquare size={20} />
      <span className="whatsapp-float-label">WhatsApp Us</span>
    </a>
  );
}
