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
import validate from '../../core/middlewares/validation.middleware.js';
import * as staffValidation from './staff.validation.js';

const router = express.Router();

// Note: Staff login is handled by the main /api/users/login endpoint.
// These routes are protected and require a valid token with a 'staff' or 'admin' role.

router.use(authenticate, isStaff);

// Product Management (FR19)
router.route('/products')
  .post(validate(staffValidation.createProduct), createProduct)
  .get(getAllProducts);

router.route('/products/:id')
  .put(validate(staffValidation.updateProduct), updateProduct)
  .delete(validate(staffValidation.deleteProduct), deleteProduct);

// Order Management (FR20)
router.route('/orders').get(getAllOrders);
router.route('/orders/:id').put(validate(staffValidation.updateOrderStatus), updateOrderStatus);
// Customer Support Ticket Management (FR21)
router.route('/support-tickets').get(getAllSupportTickets);
router.route('/support-tickets/:ticketId/reply').post(validate(staffValidation.replyToTicket), replyToTicket);

export default router;
