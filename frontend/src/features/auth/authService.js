import api from "../../api/axios";

/**
 * Registers a new user.
 * @param {object} userData - The user's registration data (first_name, last_name, email, password).
 */
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

/**
 * Logs in a user.
 * @param {object} userData - The user's login credentials (email, password).
 * @returns {Promise<object>} The user and token data.
 */
const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data; // Return the whole response data for the slice to handle
};

/**
 * Logs out the user by calling the backend endpoint.
 */
const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * Fetches the current user's profile from the backend.
 * This relies on the httpOnly cookie being sent automatically by the browser.
 * @returns {Promise<object>} The user object.
 */
const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;
