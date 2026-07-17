import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Public GET endpoints are edge-cached (see server/middleware/cache.js).
// Append a timestamp to admin GETs so they always bypass the CDN cache
// and admins see their edits immediately.
api.interceptors.request.use(config => {
  if ((config.method || 'get').toLowerCase() === 'get') {
    config.params = { ...config.params, _ts: Date.now() };
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
