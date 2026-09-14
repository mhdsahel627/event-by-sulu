import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function BrandLogo({ size = 'medium', light = false, linkTo = '/' }) {
  const { settings } = useSettings();
  const brandName = settings.business_name || 'Event by Sulu';

  const logoContent = (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: size === 'large' ? '28px' : size === 'small' ? '18px' : '22px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: light ? '#FFFFFF' : 'var(--text-primary)',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          {brandName}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: size === 'large' ? '10px' : '9px',
          fontWeight: 500,
          letterSpacing: '0.24em',
          color: 'var(--accent-gold)',
          textTransform: 'uppercase',
          marginTop: '2px',
        }}
      >
        Bespoke Event Atelier
      </span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: 'none' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
