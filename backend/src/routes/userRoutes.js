import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  verifyEmail,
  getNotifications,
} from '../controllers/userController.js';
import { protect, isStaff, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// User Profile & Settings
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/me/password', protect, changePassword);

// User Notifications
router.get('/me/notifications', protect, getNotifications);
router.put('/me/notifications/:id', protect, markNotificationAsRead);
router.post('/me/notifications/mark-all-read', protect, markAllNotificationsAsRead);

export default router;
