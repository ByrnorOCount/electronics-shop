import * as notificationService from "./notification.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Get all notifications for the logged-in user.
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const notifications = await notificationService.getNotificationsForUser(
      req.user.id,
      limit
    );
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, notifications));
  } catch (error) {
    next(error);
  }
};

/**
 * Get the count of unread notifications for the logged-in user.
 * @route GET /api/notifications/unread-count
 * @access Private
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCountForUser(req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { count }));
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read.
 * @route PUT /api/notifications/:id
 * @access Private
 */
export const markNotificationAsRead = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const notification = await notificationService.markOneAsRead(id, userId);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          notification,
          "Notification marked as read."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read for the current user.
 * @route POST /api/notifications/mark-all-read
 * @access Private
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  const userId = req.user.id;

  try {
    await notificationService.markAllAsRead(userId);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          null,
          "All notifications marked as read."
        )
      );
  } catch (error) {
    next(error);
  }
};
