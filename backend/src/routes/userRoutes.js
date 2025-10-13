import express from 'express';
import { register, login } from '../controllers/userController.js';

const router = express.Router();
// const userController = require('../controllers/userController');
// const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', /* userController.registerUser */);
router.post('/login', /* userController.loginUser */);
router.post('/reset-password', /* userController.requestPasswordReset */);

// Protected routes
router.get('/me', /* protect, userController.getUserProfile */);
router.put('/me', /* protect, userController.updateUserProfile */);

module.exports = router;
