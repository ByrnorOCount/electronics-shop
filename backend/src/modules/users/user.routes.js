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
} from './user.controller.js';
import {
  protect,
  isStaff,
  isAdmin
} from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// User Profile & Settings
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/me/password', protect, changePassword);

export default router;
