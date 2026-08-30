import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT to every request automatically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trackr_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s globally (token expired / invalid)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is bad — clear it and force re-login
      localStorage.removeItem('trackr_token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.match(/\/(login|signup)/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;