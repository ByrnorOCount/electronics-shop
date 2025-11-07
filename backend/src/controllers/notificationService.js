import api from './api';

/**
 * Fetches all notifications for the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of notification objects.
 */
const getNotifications = async (limit) => {
  const params = limit ? { limit } : {};
  const response = await api.get('/users/me/notifications', { params });
  return response.data;
};

/**
 * Marks a single notification as read.
 * @param {number} id - The ID of the notification to mark as read.
 * @returns {Promise<object>} A promise that resolves to the updated notification object.
 */
const markAsRead = async (id) => {
  const response = await api.put(`/users/me/notifications/${id}`);
  return response.data;
};

/**
 * Marks all of the user's notifications as read.
 * @returns {Promise<object>} A promise that resolves to a success message.
 */
const markAllAsRead = async () => {
  const response = await api.post('/users/me/notifications/mark-all-read');
  return response.data;
};

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
