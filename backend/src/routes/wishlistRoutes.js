const express = require('express');
const router = express.Router();
// const wishlistController = require('../controllers/wishlistController');
// const { protect } = require('../middlewares/authMiddleware');

// All wishlist routes should be protected
router.get('/', /* protect, wishlistController.getWishlist */);
router.post('/', /* protect, wishlistController.addItemToWishlist */);
router.delete('/:productId', /* protect, wishlistController.removeItemFromWishlist */);

module.exports = router;
