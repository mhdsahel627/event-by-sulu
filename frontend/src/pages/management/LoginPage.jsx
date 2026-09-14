import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

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
      setError('Invalid username or password, or account is not authorized.');
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
        backgroundColor: '#0A0C0F',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#12151B',
          border: '1px solid #1E232E',
          borderRadius: '8px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(197, 168, 128, 0.1)',
              border: '1px solid var(--border-gold-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Lock size={22} color="var(--accent-gold)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#F8FAFC', marginBottom: '6px' }}>
            {settings.business_name || 'Event by Sulu'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '13px' }}>
            Sign in to access the owner management panel
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              borderRadius: '4px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="username">
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
                className="form-input"
                style={{
                  backgroundColor: '#191D24',
                  borderColor: '#2A303C',
                  color: '#F8FAFC',
                  paddingLeft: '40px',
                }}
              />
              <User size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ fontSize: '12px', color: '#94A3B8' }} htmlFor="password">
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
                className="form-input"
                style={{
                  backgroundColor: '#191D24',
                  borderColor: '#2A303C',
                  color: '#F8FAFC',
                  paddingLeft: '40px',
                }}
              />
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '14px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Management'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#64748B',
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
