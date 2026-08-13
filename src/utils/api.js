import axios from 'axios';
import { getAccessToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Reusable, authenticated API helper.
 * @param {string} path - The request path/endpoint
 * @param {object} options - Options containing method, data/body, headers, etc.
 * @returns {Promise<any>}
 */
export const apiRequest = async (path, options = {}) => {
  const token = getAccessToken();
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await client({
      url: path,
      method: options.method || 'GET',
      data: options.body || options.data || null,
      headers,
      ...options.axiosConfig, // Allow overriding config directly
    });

    return response;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_URL}/api/auth/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('access_token', newAccessToken);

          const retryHeaders = {
            ...headers,
            'Authorization': `Bearer ${newAccessToken}`,
          };

          const retryResponse = await client({
            url: path,
            method: options.method || 'GET',
            data: options.body || options.data || null,
            headers: retryHeaders,
            ...options.axiosConfig,
          });

          return retryResponse;
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          throw refreshErr;
        }
      }
    }
    throw err;
  }
};

export default apiRequest;
