import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllSupportTickets,
} from '../controllers/staffController.js';
import { protect, isStaff } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Note: Staff login is handled by the main /api/users/login endpoint.
// These routes are protected and require a valid token with a 'staff' or 'admin' role.

// Product Management (FR19)
router.route('/products')
  .post(protect, isStaff, createProduct);

router.route('/products/:id')
  .put(protect, isStaff, updateProduct)
  .delete(protect, isStaff, deleteProduct);

// Order Management (FR20)
router.route('/orders').get(protect, isStaff, getAllOrders);
router.route('/orders/:id').put(protect, isStaff, updateOrderStatus);

// Customer Support Ticket Management (FR21)
router.route('/support-tickets').get(protect, isStaff, getAllSupportTickets);

export default router;
