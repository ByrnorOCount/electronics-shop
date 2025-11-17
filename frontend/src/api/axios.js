import axios from "axios";
import { store } from "../store";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
  // Disable default XSRF handling to implement it manually in the interceptor.
  // This provides more control and avoids cross-domain issues.
  xsrfHeaderName: false,
});

/**
 * Axios request interceptor.
 * This function runs before each request is sent. It handles two critical tasks:
 * 1. JWT Authentication: Adds the `Authorization` header if a token exists.
 * 2. CSRF Protection: Manually implements the Double-Submit Cookie pattern by
 *    reading the `XSRF-TOKEN` cookie and setting the `X-XSRF-TOKEN` header.
 */
api.interceptors.request.use(
  (config) => {
    // 1. Add JWT Authorization header for authenticated requests
    const { token } = store.getState().auth;
    if (token && token !== "social_login" && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Manually set the CSRF token header for all state-changing requests
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken && config.headers) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
