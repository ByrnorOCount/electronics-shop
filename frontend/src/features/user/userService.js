import api from '../../api/axios';

/**
 * Updates the logged-in user's profile information.
 * @param {object} userData - An object containing the fields to update (e.g., { first_name, last_name, email }).
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
const updateUserProfile = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

/**
 * Changes the logged-in user's password.
 * @param {object} passwordData - An object containing { currentPassword, newPassword }.
 * @returns {Promise<object>} A promise that resolves to the success message.
 */
const changePassword = async (passwordData) => {
  const response = await api.put('/users/me/password', passwordData);
  return response.data;
};

const userService = {
  updateUserProfile,
  changePassword,
};

export default userService;
