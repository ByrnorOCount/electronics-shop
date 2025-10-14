import express from 'express';
import { createOrder, getOrders, generateCheckoutOtp } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, createOrder);

router.post('/generate-otp', protect, generateCheckoutOtp);

export default router;
