import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// --- Robust CSRF Token Management ---

// This variable will hold the promise of the token fetch.
let csrfTokenPromise = null;

const getCsrfToken = () => {
  if (!csrfTokenPromise) {
    // If no request is in flight, create one.
    // The promise is stored, so subsequent calls within the same event loop tick
    // will get the same promise.
    csrfTokenPromise = api.get('/csrf-token').then(({ data }) => {
      // Once resolved, set the token on the default headers for all future requests.
      api.defaults.headers.common['csrf-token'] = data.csrfToken;
      return data.csrfToken;
    }).catch(error => {
      console.error('Could not fetch CSRF token:', error);
      // Reset the promise on failure to allow for a retry.
      csrfTokenPromise = null;
      // Propagate the error to the request that initiated the fetch.
      return Promise.reject(error);
    });
  }
  return csrfTokenPromise;
};

/**
 * Axios request interceptor.
 * This function runs before each request is sent. It gets the auth token
 * from the Redux store and adds it to the Authorization header.
 */
api.interceptors.request.use(
  async (config) => {
    // --- Step 1: Attach Authentication Token ---
    // This must happen first, so that any requests made by the interceptor
    // itself (like fetching the CSRF token) are authenticated.
    const token = store.getState().auth.token;
    if (token && token !== 'social_login') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // --- Step 2: Ensure CSRF Token for State-Changing Requests ---
    const methods = ['post', 'put', 'delete', 'patch'];
    const isStateChanging = methods.includes(config.method?.toLowerCase());
    const isFetchingCsrf = config.url.endsWith('/csrf-token');

    if (isStateChanging && !isFetchingCsrf) {
      try {
        // Await the token and assign it directly to the current request's header.
        // This is crucial because the `config` object was created *before* the
        // default header was set by the getCsrfToken promise.
        config.headers['csrf-token'] = await getCsrfToken();
      } catch (error) {
        // This must return a rejected promise with config to cancel
        return Promise.reject(error);
      }
    }

    return config; // Always return config
  },
  (error) => Promise.reject(error)
);

export default api;
