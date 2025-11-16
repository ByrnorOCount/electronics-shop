import express from 'express';
import {
  createOrder,
  getOrders,
  generateCheckoutOtp,
  createPaymentSession,
  handlePaymentWebhook,
} from './order.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// This route needs to be before the express.json() middleware in your main app file
// or use this special middleware to get the raw body for signature verification.
router.post('/webhook', express.raw({ type: 'application/json' }), handlePaymentWebhook);

router.route('/').get(protect, getOrders).post(protect, createOrder);

router.post('/generate-otp', protect, generateCheckoutOtp);
router.post('/create-payment-session', protect, createPaymentSession);

export default router;
