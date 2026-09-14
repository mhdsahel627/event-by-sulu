/**
 * Centralized API client for Event by Sulu
 */

const API_HOST = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const BASE_URL = `${API_HOST}/api`;

export function getAuthToken() {
  return localStorage.getItem('sulu_auth_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('sulu_auth_token', token);
  } else {
    localStorage.removeItem('sulu_auth_token');
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = options.headers || {};

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error || data?.detail || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Site Configuration
  getSettings: () => request('/site-settings/'),
  updateSettings: (data) => request('/site-settings/', { method: 'PATCH', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => request('/categories/'),
  getCategory: (idOrSlug) => request(`/categories/${idOrSlug}/`),
  createCategory: (formData) => request('/categories/', { method: 'POST', body: formData }),
  updateCategory: (id, formData) => request(`/categories/${id}/`, { method: 'PATCH', body: formData }),
  deleteCategory: (id) => request(`/categories/${id}/`, { method: 'DELETE' }),

  // Designs
  getDesigns: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.featured) query.append('featured', 'true');
    const qs = query.toString();
    return request(`/designs/${qs ? `?${qs}` : ''}`);
  },
  getDesign: (idOrSlug) => request(`/designs/${idOrSlug}/`),
  createDesign: (formData) => request('/designs/', { method: 'POST', body: formData }),
  updateDesign: (id, formData) => request(`/designs/${id}/`, { method: 'PATCH', body: formData }),
  deleteDesign: (id) => request(`/designs/${id}/`, { method: 'DELETE' }),

  // Design Images (Single Source of Truth for Gallery)
  getDesignImages: (designId) => request(`/design-images/?design=${designId}`),
  uploadDesignImages: (formData) => request('/design-images/', { method: 'POST', body: formData }),
  deleteDesignImage: (id) => request(`/design-images/${id}/`, { method: 'DELETE' }),

  // Public Aggregated Gallery
  getGallery: (categorySlug = null) => {
    const qs = categorySlug && categorySlug !== 'all' ? `?category=${categorySlug}` : '';
    return request(`/gallery/${qs}`);
  },

  // Contact Inquiries
  submitInquiry: (data) => request('/inquiries/', { method: 'POST', body: JSON.stringify(data) }),
  getInquiries: () => request('/inquiries/'),
  markInquiryRead: (id) => request(`/inquiries/${id}/mark_read/`, { method: 'POST' }),
  deleteInquiry: (id) => request(`/inquiries/${id}/`, { method: 'DELETE' }),

  // Dashboard Stats
  getDashboardStats: () => request('/dashboard-stats/'),

  // Authentication
  login: (username, password) => request('/auth/login/', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  getMe: () => request('/auth/me/'),
};
