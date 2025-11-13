import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

/**
 * Axios request interceptor.
 * This function runs before each request is sent. It gets the auth token
 * from the Redux store and adds it to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    // Only add the Authorization header if the token is a valid string.
    // This prevents sending "Bearer null" or the placeholder "Bearer social_login"
    // when using cookie-based auth.
    if (token && token !== 'social_login') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
