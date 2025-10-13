const express = require('express');
const router = express.Router();
// const orderController = require('../controllers/orderController');
// const { protect } = require('../middlewares/authMiddleware');

// All order routes should be protected
router.post('/', /* protect, orderController.createOrder */);
router.get('/', /* protect, orderController.getOrderHistory */);

module.exports = router;
