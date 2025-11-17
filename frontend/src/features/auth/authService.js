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

const authService = {
  register,
  login,
  logout,
};

export default authService;
