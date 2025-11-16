import * as notificationModel from './notification.model.js';
import httpStatus from 'http-status';
import ApiError from '../../core/utils/ApiError.js';

/**
 * Creates a notification for a user.
 * @param {number} userId - The ID of the user to notify.
 * @param {string} message - The notification message.
 * @param {string|null} [link=null] - An optional URL for the notification.
 * @param {object} [trx] - Optional Knex transaction object.
 */
export const createNotification = async (userId, message, link = null, trx) => {
  const notificationData = { user_id: userId, message, link };
  // Use the newly created model function for consistency.
  await notificationModel.create(notificationData, trx);
};

/**
 * Get notifications for a user.
 * @param {number} userId
 * @param {number} [limit]
 * @returns {Promise<Array>}
 */
export const getNotificationsForUser = (userId, limit) => {
  return notificationModel.findByUserId(userId, limit); // This is correct, it passes the limit.
};

/**
 * Get the count of unread notifications for a user.
 * @param {number} userId
 * @returns {Promise<number>}
 */
export const getUnreadCountForUser = async (userId) => {
  const count = await notificationModel.countUnreadByUserId(userId);
  return parseInt(count, 10);
};

/**
 * Mark a single notification as read.
 * @param {number} notificationId
 * @param {number} userId
 * @returns {Promise<object>}
 */
export const markOneAsRead = async (notificationId, userId) => {
  const notification = await notificationModel.updateAsRead(notificationId, userId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found or you do not have permission to view it.');
  }
  return notification;
};

/**
 * Mark all of a user's notifications as read.
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const markAllAsRead = async (userId) => {
  await notificationModel.updateAllAsRead(userId);
};
