import axios from 'axios';

/**
 * Pre-configured axios instance for the Kisan API with automatic JWT bearer token attachment.
 */
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;

// In development, connect to localhost:4000. In production, use same-domain relative path ''
const backendUrl = import.meta.env.DEV
  ? (rawBackendUrl || 'http://localhost:4000').replace(/\/+$/, '')
  : (rawBackendUrl && !rawBackendUrl.includes('localhost') ? rawBackendUrl.replace(/\/+$/, '') : '');

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kisan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear local storage and dispatch event
      if (localStorage.getItem('kisan_token')) {
        localStorage.removeItem('kisan_token');
        localStorage.removeItem('kisan_user');
        window.dispatchEvent(new Event('kisan-auth-logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
