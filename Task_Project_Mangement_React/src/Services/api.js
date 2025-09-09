import axios from 'axios';
import { toast } from 'react-toastify';

// ALWAYS use the absolute backend URL from .env
const API_BASE = process.env.REACT_APP_API_BASE || 'https://localhost:7193';

const instance = axios.create({
  baseURL: API_BASE,            // absolute => https://localhost:7193
  withCredentials: false,
  timeout: 20000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('tpm.token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let last403Toast = 0;
instance.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status;
    if (status === 403) {
      // Only show toast once per error event (debounce)
      const now = Date.now();
      if (now - last403Toast > 1000) {
        toast.error('User Denied');
        last403Toast = now;
      }
    }
    if (status === 401) {
      localStorage.removeItem('tpm.token');
      localStorage.removeItem('tpm.user');
      // if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// named helpers (many service files import these)
const ok = (r) => r?.data ?? r;
export const get  = (url, config)      => instance.get(url, config).then(ok);
export const post = (url, data, config) => instance.post(url, data, config).then(ok);
export const put  = (url, data, config) => instance.put(url, data, config).then(ok);
export const del  = (url, config)      => instance.delete(url, config).then(ok);

export default instance;
