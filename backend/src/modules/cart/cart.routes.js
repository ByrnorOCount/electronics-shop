import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  syncCart
} from './cart.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';
import validate from '../../core/middlewares/validation.middleware.js';
import * as cartValidation from './cart.validation.js';

const router = express.Router();

// All cart routes should be protected
router.route('/').get(authenticate, getCart).post(authenticate, validate(cartValidation.addItem), addItemToCart);

router.post('/sync', authenticate, validate(cartValidation.syncCart), syncCart);

router
  .route('/items/:itemId')
  .put(authenticate, validate(cartValidation.updateItem), updateCartItem)
  .delete(authenticate, validate(cartValidation.removeItem), removeCartItem);

export default router;
