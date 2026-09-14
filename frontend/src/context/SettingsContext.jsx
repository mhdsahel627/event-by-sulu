import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    business_name: 'Event by Sulu',
    tagline: 'Bespoke Event & Wedding Decoration Atelier',
    phone: '',
    whatsapp_number: '',
    email: '',
    address: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /**
   * Cleans phone number for international WhatsApp link format.
   * Prepends 91 if a 10-digit Indian mobile number is configured.
   */
  const getCleanWhatsAppNumber = useCallback(() => {
    const raw = (settings.whatsapp_number || settings.phone || '').replace(/\D/g, '');
    if (!raw) return '';
    if (raw.length === 10) {
      return `91${raw}`;
    }
    return raw;
  }, [settings.whatsapp_number, settings.phone]);

  /**
   * Generates dynamic WhatsApp URL with custom or default message
   */
  const getWhatsAppLink = useCallback((customMessage) => {
    const number = getCleanWhatsAppNumber();
    if (!number) return '#';
    const message = customMessage || `Hello ${settings.business_name}, I would like to enquire about your decoration services.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [getCleanWhatsAppNumber, settings.business_name]);

  /**
   * Generates dynamic WhatsApp enquiry URL specifically bound to a design title
   * Matches the exact requirement:
   * "Hi, I'm interested in the '{design.title}' design. I would like to know more details."
   */
  const getDesignWhatsAppLink = useCallback((designTitle) => {
    const number = getCleanWhatsAppNumber();
    if (!number) return '#';
    const message = `Hi, I'm interested in the '${designTitle}' design. I would like to know more details.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [getCleanWhatsAppNumber]);

  /**
   * Generates direct tel: call link
   */
  const getPhoneLink = useCallback(() => {
    const phone = (settings.phone || '').trim();
    return phone ? `tel:${phone}` : '#';
  }, [settings.phone]);

  /**
   * Generates direct mailto: link
   */
  const getEmailLink = useCallback((subject = '') => {
    const email = (settings.email || '').trim();
    if (!email) return '#';
    return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
  }, [settings.email]);

  const value = {
    settings,
    loading,
    refreshSettings: fetchSettings,
    getWhatsAppLink,
    getDesignWhatsAppLink,
    getPhoneLink,
    getEmailLink,
    cleanWhatsAppNumber: getCleanWhatsAppNumber(),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
