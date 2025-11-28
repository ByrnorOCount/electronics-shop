import api from "../../api/axios";
import logger from "../../utils/logger";

/**
 * Fetches all items from the user's cart.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of cart items.
 */
const getCartItems = async () => {
  const response = await api.get("/cart");
  return response.data.data;
};

/**
 * Adds an item to the cart.
 * @param {number} productId The ID of the product to add.
 * @param {number} quantity The quantity to add.
 * @returns {Promise<object>} A promise that resolves to the added/updated cart item.
 */
const addItemToCart = async (productId, quantity) => {
  const response = await api.post("/cart", { productId, quantity });
  return response.data.data;
};

/**
 * Updates the quantity of an item in the cart.
 * @param {number} itemId The ID of the cart item.
 * @param {number} quantity The new quantity.
 * @returns {Promise<object>} A promise that resolves to the updated cart item.
 */
const updateCartItemQuantity = async (itemId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}`, { quantity });
  return response.data.data;
};

/**
 * Removes an item from the cart on the backend.
 * @param {number} itemId The ID of the cart item to remove.
 * @returns {Promise<void>}
 */
const removeCartItem = async (itemId) => {
  await api.delete(`/cart/items/${itemId}`);
};

/**
 * Synchronizes a local cart with the backend.
 * @param {Array<{productId: number, quantity: number}>} itemsToSync An array of items from the local cart.
 * @returns {Promise<Array<object>>} A promise that resolves to the fully merged cart from the backend.
 */
const syncCart = async (itemsToSync) => {
  logger.info("Attempting to sync cart with backend...");
  logger.info("Payload to be sent to /cart/sync:", { items: itemsToSync });

  // This sends the local cart to a new endpoint for the backend to merge.
  const response = await api.post("/cart/sync", { items: itemsToSync });
  logger.info("Cart sync successful. Response data:", response.data.data);
  return response.data.data;
};

/**
 * Moves an item from the cart to the wishlist via a dedicated backend endpoint.
 * @param {number} cartItemId The ID of the cart item to move.
 * @returns {Promise<object>} A promise that resolves to the success message from the backend.
 */
const saveForLater = async (cartItemId) => {
  const response = await api.post(`/cart/save-for-later/${cartItemId}`);
  return response.data;
};

const cartService = {
  getCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  syncCart,
  saveForLater,
};

export default cartService;
