const express = require('express');
const router = express.Router();
// const cartController = require('../controllers/cartController');
// const { protect } = require('../middlewares/authMiddleware');

// All cart routes should be protected
router.get('/', /* protect, cartController.getCart */);
router.post('/', /* protect, cartController.addItemToCart */);
router.put('/items/:id', /* protect, cartController.updateCartItem */);
router.delete('/items/:id', /* protect, cartController.removeCartItem */);

module.exports = router;
