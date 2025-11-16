import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  syncCart
} from './cart.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import validate from '../../core/middlewares/validation.middleware.js';
import * as cartValidation from './cart.validation.js';

const router = express.Router();

// All cart routes should be protected
router.route('/')
  .get(protect, getCart)
  .post(protect, validate(cartValidation.addItem), addItemToCart);

router.post('/sync', protect, validate(cartValidation.syncCart), syncCart);

router.route('/items/:itemId')
  .put(protect, validate(cartValidation.updateItem), updateCartItem)
  .delete(protect, validate(cartValidation.removeItem), removeCartItem);

export default router;
