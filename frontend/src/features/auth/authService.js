import api from '../../api/api';

/**
 * Registers a new user.
 * @param {object} userData - The user's registration data (first_name, last_name, email, password).
 */
const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

/**
 * Logs in a user.
 * @param {object} userData - The user's login credentials (email, password).
 * @returns {Promise<object>} The user and token data.
 */
const login = async (userData) => {
  const response = await api.post('/users/login', userData);
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;