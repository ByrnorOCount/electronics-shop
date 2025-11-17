import * as wishlistService from "./wishlist.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Get all items in the user's wishlist.
 * @route GET /api/wishlist
 * @access Private
 */
export const getWishlistItems = async (req, res, next) => {
  try {
    const wishlistItems = await wishlistService.getWishlistItems(req.user.id);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          wishlistItems,
          "Wishlist retrieved successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Add a product to the wishlist.
 * @route POST /api/wishlist
 * @access Private
 */
export const addWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const newItem = await wishlistService.addItemToWishlist(
      req.user.id,
      productId
    );
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          newItem,
          "Product added to wishlist."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a product from the wishlist.
 * @route DELETE /api/wishlist/:id
 * @access Private
 */
export const removeWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await wishlistService.removeItemFromWishlist(req.user.id, productId);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          { productId },
          "Product removed from wishlist."
        )
      );
  } catch (error) {
    next(error);
  }
};
