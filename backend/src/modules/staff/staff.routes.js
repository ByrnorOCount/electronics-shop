import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  getAllSupportTickets,
  replyToTicket,
} from './staff.controller.js';
import {
  authenticate,
  isStaff
} from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Note: Staff login is handled by the main /api/users/login endpoint.
// These routes are protected and require a valid token with a 'staff' or 'admin' role.

// Product Management (FR19)
router.route('/products')
  .post(authenticate, isStaff, createProduct)
  .get(authenticate, isStaff, getAllProducts);

router.route('/products/:id')
  .put(authenticate, isStaff, updateProduct)
  .delete(authenticate, isStaff, deleteProduct);

// Order Management (FR20)
router.route('/orders').get(authenticate, isStaff, getAllOrders);
router.route('/orders/:id').put(authenticate, isStaff, updateOrderStatus);
// Customer Support Ticket Management (FR21)
router.route('/support-tickets').get(authenticate, isStaff, getAllSupportTickets);
router.route('/support-tickets/:ticketId/reply').post(authenticate, isStaff, replyToTicket);

export default router;
