import express from 'express';
import { register, login, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', /* userController.requestPasswordReset */);

// Protected routes
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

export default router;
