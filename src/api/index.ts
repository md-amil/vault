import axios from 'axios';
import { getStoredToken, clearStoredToken } from './auth';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await clearStoredToken();
    }
    return Promise.reject(error);
  }
);

// Export all API modules
export { authAPI } from './auth';
export { usersAPI } from './users';
export { foldersAPI } from './folders';
export { filesAPI } from './files';

export default api;
