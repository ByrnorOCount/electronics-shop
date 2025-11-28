import * as cartModel from "./cart.model.js";
import * as productModel from "../products/product.model.js";
import httpStatus from "http-status";
import ApiError from "../../core/utils/ApiError.js";
import logger from "../../config/logger.js";

/**
 * Get all items in a user's cart.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getCartByUserId = async (userId) => {
  return cartModel.findByUserId(userId);
};

/**
 * Add an item to the cart or update its quantity if it already exists.
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 * @returns {Promise<{item: object, wasCreated: boolean}>}
 */
export const addItemToCart = async (userId, productId, quantity) => {
  const product = await productModel.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
  }

  const existingItem = await cartModel.findOne(userId, productId);
  const requestedQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  // Check stock before any database operation.
  if (product.stock === 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `'${product.name}' is out of stock.`
    );
  }

  if (product.stock < requestedQuantity) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Only ${product.stock} of '${product.name}' left in stock. You cannot add ${requestedQuantity} to your cart.`
    );
  }

  if (existingItem) {
    const [updatedItem] = await cartModel.update(
      existingItem.id,
      requestedQuantity,
      userId
    );
    const itemWithDetails = await cartModel.findById(updatedItem.id);
    // The item details from findById don't include stock, so we add it back for consistency.
    itemWithDetails.stock = product.stock;
    return { item: itemWithDetails, wasCreated: false };
  } else {
    const newItem = await cartModel.create(userId, productId, quantity);
    const itemWithDetails = await cartModel.findById(newItem.id);
    itemWithDetails.stock = product.stock;
    return { item: itemWithDetails, wasCreated: true };
  }
};

/**
 * Update a cart item's quantity.
 * @param {number} userId
 * @param {number} itemId
 * @param {number} quantity
 * @returns {Promise<object>}
 */
export const updateCartItem = async (userId, itemId, quantity) => {
  // We need to get the product details to check stock.
  const item = await cartModel.findById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart item not found.");
  }

  const product = await productModel.findById(item.product_id);
  if (!product) {
    // This case is unlikely if the cart item exists, but it's good practice.
    throw new ApiError(httpStatus.NOT_FOUND, "Associated product not found.");
  }

  // Check stock before updating.
  if (product.stock === 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `'${product.name}' is now out of stock. Please remove it from your cart.`
    );
  }

  if (product.stock < quantity) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Only ${product.stock} of '${product.name}' left in stock. You cannot set quantity to ${quantity}.`
    );
  }

  const [updatedItem] = await cartModel.update(itemId, quantity, userId);
  if (!updatedItem) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cart item not found or you do not have permission to update it."
    );
  }
  // Return the full item details including the latest stock.
  const itemWithDetails = await cartModel.findById(updatedItem.id);
  itemWithDetails.stock = product.stock;
  return itemWithDetails;
};

/**
 * Remove an item from the cart.
 * @param {number} userId
 * @param {number} itemId
 * @returns {Promise<void>}
 */
export const removeCartItem = async (userId, itemId) => {
  const deletedCount = await cartModel.remove(itemId, userId);
  if (deletedCount === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cart item not found or you do not have permission to delete it."
    );
  }
};

/**
 * Synchronize a local cart with the user's cart in the database.
 * @param {number} userId
 * @param {Array<{productId: number, quantity: number}>} items
 * @returns {Promise<Array>} The full, updated cart.
 */
export const syncUserCart = async (userId, body) => {
  logger.info(`Starting cart sync for user ID: ${userId}`);
  // Using an object for the second argument allows for structured logging.
  logger.debug("Received raw body for sync:", { body });

  // The validation allows the body to be an array or an object { items: [...] }.
  // We normalize it to just the array of items.
  const itemsToSync = Array.isArray(body) ? body : body.items;
  logger.debug("Normalized items to sync:", { itemsToSync });

  if (!itemsToSync) {
    logger.error(
      `Cart sync failed for user ID: ${userId}. 'itemsToSync' is falsy after normalization.`,
      { body }
    );
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid sync data provided.");
  }

  logger.info(
    `Replacing cart for user ID: ${userId} with ${itemsToSync.length} items.`
  );
  await cartModel.replace(userId, itemsToSync);
  const updatedCart = await cartModel.findByUserId(userId);
  return updatedCart;
};

/**
 * Moves an item from the user's cart to their wishlist in a single transaction.
 * @param {number} userId
 * @param {number} cartItemId
 * @returns {Promise<{message: string}>}
 */
export const saveItemForLater = async (userId, cartItemId) => {
  const result = await cartModel.saveForLater(userId, cartItemId);
  if (!result.success) {
    throw new ApiError(result.status, result.message);
  }
  return {
    message: result.message,
  };
};
