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

  const response = await client({
    url: path,
    method: options.method || 'GET',
    data: options.body || options.data || null,
    headers,
    ...options.axiosConfig, // Allow overriding config directly
  });

  return response;
};

export default apiRequest;
