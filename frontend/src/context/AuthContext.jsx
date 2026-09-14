import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    if (data.token) {
      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error('Authentication failed');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
