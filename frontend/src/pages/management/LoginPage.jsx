import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import '../../admin-theme.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/management';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials or account is not authorized for management access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--apple-bg)',
        padding: '24px 16px',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
      }}
    >
      {/* Subtle Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="apple-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top Atelier Badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2A3344 0%, #171C26 100%)',
              border: '1px solid var(--apple-hairline-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--apple-accent-light)',
              fontWeight: 700,
              fontSize: '18px',
              fontFamily: 'var(--font-serif)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            S
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--apple-text-primary)',
              marginBottom: '6px',
              letterSpacing: '-0.015em',
            }}
          >
            {settings.business_name || 'Event by Sulu'}
          </h2>
          <p style={{ color: 'var(--apple-text-secondary)', fontSize: '13px', margin: 0 }}>
            Sign in to access the Atelier Control Center
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--apple-danger-subtle)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              color: 'var(--apple-danger)',
              borderRadius: 'var(--apple-radius-sm)',
              fontSize: '13px',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="apple-input-group" style={{ marginBottom: '18px' }}>
            <label className="apple-label" htmlFor="username">
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Owner username"
                className="apple-input"
                style={{ paddingLeft: '38px' }}
              />
              <User
                size={16}
                color="var(--apple-text-muted)"
                style={{ position: 'absolute', left: '12px', top: '14px' }}
              />
            </div>
          </div>

          <div className="apple-input-group" style={{ marginBottom: '26px' }}>
            <label className="apple-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="apple-input"
                style={{ paddingLeft: '38px' }}
              />
              <Lock
                size={16}
                color="var(--apple-text-muted)"
                style={{ position: 'absolute', left: '12px', top: '14px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="apple-btn apple-btn-gold"
            style={{ width: '100%', padding: '13px', fontSize: '14px', minHeight: '44px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--apple-text-secondary)',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'var(--apple-transition)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--apple-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--apple-text-secondary)')}
          >
            <ArrowLeft size={13} />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
