import express from "express";
import * as wishlistController from "./wishlist.controller.js";
import * as wishlistValidation from "./wishlist.validation.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
const router = express.Router();

// All wishlist routes require an authenticated user.
router.use(authenticate, isAuthenticated);

router
  .route("/")
  .get(
    validate(wishlistValidation.getWishlist),
    wishlistController.getWishlistItems
  )
  .post(
    validate(wishlistValidation.addToWishlist),
    wishlistController.addWishlistItem
  );

router
  .route("/:productId")
  .delete(
    validate(wishlistValidation.removeFromWishlist),
    wishlistController.removeWishlistItem
  );

export default router;
