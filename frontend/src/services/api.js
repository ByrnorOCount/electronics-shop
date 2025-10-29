import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor.
 * This function runs before each request is sent. It gets the auth token
 * from the Redux store and adds it to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchHome() {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (err) {
    console.error("API fetch error:", err);
    return { message: "Error connecting to backend" };
  }
}

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (err) {
    console.error('fetchProducts error:', err);
    // fallback to empty array
    return [];
  }
}