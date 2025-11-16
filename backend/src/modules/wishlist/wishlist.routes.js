import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from './wishlist.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(authenticate, getWishlist)
  .post(authenticate, addToWishlist);

router.route('/:productId')
  .delete(authenticate, removeFromWishlist);

export default router;
