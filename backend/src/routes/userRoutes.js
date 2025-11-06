import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getNotifications,
} from '../controllers/userController.js';
import { protect, isStaff, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.put('/me/password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/me/notifications', protect, getNotifications);

export default router;
