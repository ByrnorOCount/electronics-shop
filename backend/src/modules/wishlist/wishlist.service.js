import * as wishlistModel from "./wishlist.model.js";
import httpStatus from "http-status";
import ApiError from "../../core/utils/ApiError.js";

/**
 * Get user's wishlist items.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>}
 */
export const getWishlistItems = async (userId) => {
  return wishlistModel.findByUserId(userId);
};

/**
 * Add an item to the user's wishlist.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<object>}
 */
export const addItemToWishlist = async (userId, productId) => {
  const existingItem = await wishlistModel.findOne(userId, productId);
  if (existingItem) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product is already in the wishlist."
    );
  }

  const newItem = await wishlistModel.create(userId, productId);
  return newItem;
};

/**
 * Remove an item from the user's wishlist.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<void>}
 */
export const removeItemFromWishlist = async (userId, productId) => {
  const deletedCount = await wishlistModel.remove(userId, productId);
  if (deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found in wishlist.");
  }
};
