import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F1115',
          color: '#9CA3AF',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Verifying authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/management/login" state={{ from: location }} replace />;
  }

  return children;
}
