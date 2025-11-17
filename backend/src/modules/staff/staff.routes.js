import express from 'express';
import * as staffController from './staff.controller.js';
import * as staffValidation from './staff.validation.js';
import { authenticate, isStaff } from '../../core/middlewares/auth.middleware.js';
import validate from '../../core/middlewares/validation.middleware.js';

const router = express.Router();

router.use(authenticate, isStaff);

router
  .route('/products')
  .post(validate(staffValidation.createProduct), staffController.createProduct)
  .get(staffController.getAllProducts);

router
  .route('/products/:id')
  .put(validate(staffValidation.updateProduct), staffController.updateProduct)
  .delete(validate(staffValidation.deleteProduct), staffController.deleteProduct);

router
  .route('/orders')
  .get(staffController.getAllOrders);

router
  .route('/orders/:id')
  .put(validate(staffValidation.updateOrderStatus), staffController.updateOrderStatus);

router
  .route('/support-tickets')
  .get(staffController.getAllSupportTickets);

router
  .route('/support-tickets/:ticketId/reply')
  .post(validate(staffValidation.replyToTicket), staffController.replyToTicket);

export default router;
