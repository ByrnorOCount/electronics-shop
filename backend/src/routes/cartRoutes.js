import express from 'express';
import { getCart, addItemToCart, updateCartItem, removeCartItem, syncCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All cart routes should be protected
router.route('/')
  .get(protect, getCart)
  .post(protect, addItemToCart);

router.post('/sync', protect, syncCart);

router.route('/items/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

export default router;
