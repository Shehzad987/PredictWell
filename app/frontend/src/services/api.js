import axios from 'axios';

// Central Axios instance. Vite proxies "/api" to the FastAPI server in dev.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Normalize error shape so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    let message = error.message || 'Something went wrong';

    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail) && detail.length > 0) {
      // FastAPI/Pydantic validation error array
      message = detail.map((d) => d.msg).join(', ');
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;
