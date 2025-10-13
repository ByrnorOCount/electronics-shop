const express = require('express');
const router = express.Router();
// const staffController = require('../controllers/staffController');
// const { protect, isStaff } = require('../middlewares/authMiddleware');

// Staff authentication
router.post('/login', /* staffController.login */);

// Product Management (FR19)
router.post('/products', /* protect, isStaff, staffController.createProduct */);
router.put('/products/:id', /* protect, isStaff, staffController.updateProduct */);
router.delete('/products/:id', /* protect, isStaff, staffController.deleteProduct */);

// Order Management (FR20)
router.get('/orders', /* protect, isStaff, staffController.getAllOrders */);
router.put('/orders/:id', /* protect, isStaff, staffController.updateOrderStatus */);

module.exports = router;
