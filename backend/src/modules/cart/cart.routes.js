import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  syncCart,
} from "./cart.controller.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
import * as cartValidation from "./cart.validation.js";

const router = express.Router();

// Cart endpoints should be accessible to both guests and authenticated users.
// Only the sync endpoint requires authentication (to merge guest cart into user cart).
router
  .route("/")
  .get(authenticate, getCart)
  .post(authenticate, validate(cartValidation.addItem), addItemToCart); // Ensure authenticate is here

// This route requires a logged-in user to merge the guest cart.
router.post(
  "/sync",
  authenticate,
  isAuthenticated,
  validate(cartValidation.syncCart),
  syncCart
);

router
  .route("/items/:itemId") // All operations on a specific cart item require authentication
  .put(authenticate, validate(cartValidation.updateItem), updateCartItem)
  .delete(authenticate, validate(cartValidation.removeItem), removeCartItem);

export default router;
