import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token yaroqsiz');

      localStorage.clear();

      if (window.location.pathname !== '/login') {
        console.log("🔄 Login sahifasiga yo'naltirilmoqda...");
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.error("❌ 403 Forbidden - Ruxsat yo'q");
    }

    if (error.response?.status === 500) {
      console.error('❌ 500 Server Error - Server xatosi');
    }

    return Promise.reject(error);
  }
);

export default API;
