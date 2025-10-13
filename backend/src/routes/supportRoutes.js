import express from 'express';
import { submitTicket, getUserTickets, getTicketById, getFaqs } from '../controllers/supportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for support tickets (protected)
router.route('/')
  .post(protect, submitTicket)
  .get(protect, getUserTickets);

// Route for a single support ticket
router.route('/:ticketId')
  .get(protect, getTicketById);

// Route for FAQs (public)
router.route('/faq').get(getFaqs);

export default router;
