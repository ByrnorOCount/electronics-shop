import * as Support from '../models/supportModel.js';

/**
 * Submit a new support ticket.
 * @route POST /api/support
 * @access Private
 */
export const submitTicket = async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.user.id;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required.' });
  }

  try {
    const newTicket = await Support.create({
      user_id: userId,
      subject,
      message,
      status: 'open',
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    res.status(500).json({ message: 'Server error while submitting ticket.' });
  }
};

/**
 * Get all support tickets for the logged-in user.
 * @route GET /api/support
 * @access Private
 */
export const getUserTickets = async (req, res) => {
  const userId = req.user.id;
  try {
    const tickets = await Support.findByUserId(userId);
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Server error while fetching tickets.' });
  }
};

/**
 * Get a single support ticket by ID.
 * @route GET /api/support/:ticketId
 * @access Private
 */
export const getTicketById = async (req, res) => {
  const { ticketId } = req.params;
  const userId = req.user.id;
  try {
    const ticket = await Support.findByIdAndUserId(ticketId, userId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found or you do not have permission to view it.' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ message: 'Server error while fetching ticket.' });
  }
};

/**
 * Get all Frequently Asked Questions.
 * @route GET /api/faq
 * @access Public
 */
export const getFaqs = (req, res) => {
  // For a real application, this data would come from a database table.
  // For this project, hardcoding is sufficient.
  const faqs = [
    {
      id: 1,
      question: 'What is your return policy?',
      answer: 'You can return any item within 30 days of purchase for a full refund, provided it is in its original condition.',
    },
    {
      id: 2,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Expedited shipping options are available at checkout.',
    },
    {
      id: 3,
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within the country. International shipping will be available in the future.',
    },
  ];
  res.status(200).json(faqs);
};
