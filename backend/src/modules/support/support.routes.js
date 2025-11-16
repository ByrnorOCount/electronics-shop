import express from 'express';
import {
  submitTicket,
  getUserTickets,
  getTicketById,
  getFaqs
} from './support.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Route for FAQs (public)
router.route('/faq').get(getFaqs);

// Routes for support tickets (protected)
router.route('/')
  .post(protect, submitTicket)
  .get(protect, getUserTickets);

// Route for a single support ticket
router.route('/:ticketId')
  .get(protect, getTicketById);

export default router;
