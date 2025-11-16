import express from 'express';
import {
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
} from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// User Profile & Settings
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/me/password', protect, changePassword);

export default router;
