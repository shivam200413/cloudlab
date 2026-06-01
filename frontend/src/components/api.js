import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cl_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('cl_token');
      localStorage.removeItem('cl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name }),
  me: () => api.get('/auth/me'),
};

export const wsApi = {
  list: () => api.get('/workspaces'),
  templates: () => api.get('/workspaces/templates'),
  create: (name, templateId) => api.post('/workspaces', { name, templateId }),
  stop: (id) => api.post(`/workspaces/${id}/stop`),
  start: (id) => api.post(`/workspaces/${id}/start`),
  delete: (id) => api.delete(`/workspaces/${id}`),
  stats: (id) => api.get(`/workspaces/${id}/stats`),
};

export const metricsApi = {
  host: () => api.get('/metrics/host'),
};

export default api;
