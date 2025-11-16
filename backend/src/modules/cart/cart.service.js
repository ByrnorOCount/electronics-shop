import * as cartModel from './cart.model.js';
import httpStatus from 'http-status';
import ApiError from '../../core/utils/ApiError.js';

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
    const existingItem = await cartModel.findOne(userId, productId);

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const [updatedItem] = await cartModel.update(existingItem.id, newQuantity, userId);
        const itemWithDetails = await cartModel.findById(updatedItem.id);
        return { item: itemWithDetails, wasCreated: false };
    } else {
        const newItem = await cartModel.create(userId, productId, quantity);
        const itemWithDetails = await cartModel.findById(newItem.id);
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
    const [updatedItem] = await cartModel.update(itemId, quantity, userId);
    if (!updatedItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found or you do not have permission to update it.');
    }
    return updatedItem;
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
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found or you do not have permission to delete it.');
    }
};

/**
 * Synchronize a local cart with the user's cart in the database.
 * @param {number} userId
 * @param {Array<{productId: number, quantity: number}>} items
 * @returns {Promise<Array>} The full, updated cart.
 */
export const syncUserCart = async (userId, items) => {
    // The body can be an array directly, or an object { items: [...] }
    const itemsToSync = Array.isArray(items) ? items : items.items;

    if (!itemsToSync) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid sync data provided.');
    }

    await cartModel.replace(userId, itemsToSync);
    const updatedCart = await cartModel.findByUserId(userId);
    return updatedCart;
};
