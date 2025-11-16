import express from 'express';
import {
  submitTicket,
  getUserTickets,
  getTicketById,
  getFaqs
} from './support.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Route for FAQs (public)
router.route('/faq').get(getFaqs);

// Routes for support tickets (protected)
router.route('/').post(authenticate, submitTicket).get(authenticate, getUserTickets);

// Route for a single support ticket
router.route('/:ticketId').get(authenticate, getTicketById);

export default router;
