import express from 'express';
import * as supportController from './support.controller.js';
import * as supportValidation from './support.validation.js';
import validate from '../../core/middlewares/validation.middleware.js';
import { authenticate, isStaff } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Route for FAQs (public)
router.route('/faq').get(supportController.getFaqs);

// All subsequent routes are for authenticated staff members
router.use(authenticate, isStaff);

router
  .route('/')
  .post(validate(supportValidation.submitTicket), supportController.submitTicket)
  .get(supportController.getUserTickets);

router.route('/:ticketId').get(validate(supportValidation.getTicketById), supportController.getTicketById);

export default router;
