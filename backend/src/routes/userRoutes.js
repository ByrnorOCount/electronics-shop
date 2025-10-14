import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getNotifications,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/me/notifications', protect, getNotifications);

export default router;
