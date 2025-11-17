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

// Cart endpoints should be accessible to both guests and authenticated users.
// Only the sync endpoint requires authentication (to merge guest cart into user cart).
router
  .route('/')
  .get(getCart)
  .post(validate(cartValidation.addItem), addItemToCart);

router.post('/sync', authenticate, validate(cartValidation.syncCart), syncCart);

router
  .route('/items/:itemId')
  .put(validate(cartValidation.updateItem), updateCartItem)
  .delete(validate(cartValidation.removeItem), removeCartItem);

export default router;
