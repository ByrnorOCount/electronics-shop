const express = require('express');
const router = express.Router();
// const supportController = require('../controllers/supportController');
// const { protect } = require('../middlewares/authMiddleware');

// All support routes should be protected
router.post('/', /* protect, supportController.createTicket */);
router.get('/:id', /* protect, supportController.getTicketById */);

module.exports = router;
