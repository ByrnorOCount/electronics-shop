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

// All cart routes are for authenticated users only.
router.use(authenticate);

router.route('/').get(getCart).post(validate(cartValidation.addItem), addItemToCart);

router.post('/sync', validate(cartValidation.syncCart), syncCart);

router
  .route('/items/:itemId')
  .put(validate(cartValidation.updateItem), updateCartItem)
  .delete(validate(cartValidation.removeItem), removeCartItem);

export default router;
