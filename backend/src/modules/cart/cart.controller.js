import * as Cart from './cart.model.js';

/**
 * Get all items in the user's cart.
 * @route GET /api/cart
 * @access Private
 */
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findByUserId(req.user.id);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Server error while retrieving cart.' });
  }
};

/**
 * Add an item to the cart. If it exists, update quantity.
 * @route POST /api/cart
 * @access Private
 */
export const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
  }

  try {
    let statusCode = 201; // Default to 201 (Created)
    const existingItem = await Cart.findOne(userId, productId);

    if (existingItem) {
      // Item exists, update quantity
      await Cart.update(existingItem.id, quantity, true); // true for increment
      statusCode = 200; // Set to 200 (OK) for an update
    } else {
      // Item does not exist, insert new
      await Cart.create(userId, productId, quantity);
    }

    const updatedCart = await Cart.findByUserId(userId);
    const itemToReturn = updatedCart.find((item) => item.product_id === productId);

    res.status(statusCode).json(itemToReturn || {});
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart.' });
  }
};

/**
 * Synchronizes a local (guest) cart with the user's database cart.
 * @route POST /api/cart/sync
 * @access Private
 */
export const syncCart = async (req, res) => {
  const itemsToSync = req.body.items || req.body; // Accept {items: []} or []
  const userId = req.user.id;

  if (!Array.isArray(itemsToSync)) {
    return res.status(400).json({ message: 'Request body must be an array of cart items.' });
  }

  try {
    await Cart.replace(userId, itemsToSync);

    // After sync, fetch the entire updated cart to return to the client.
    const updatedCart = await Cart.findByUserId(userId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ message: error.message || 'Server error while syncing cart.' });
  }
};

/**
 * Update a specific cart item's quantity.
 * @route PUT /api/cart/items/:itemId
 * @access Private
 */
export const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'A valid quantity is required.' });
  }

  try {
    const [updatedItem] = await Cart.update(itemId, quantity);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error while updating cart item.' });
  }
};

/**
 * Remove an item from the cart.
 * @route DELETE /api/cart/items/:itemId
 * @access Private
 */
export const removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const deletedCount = await Cart.remove(itemId, userId);

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Cart item not found or you do not have permission to delete it.' });
    }

    // Successfully deleted, send 204 No Content.
    res.status(204).send();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error while removing item from cart.' });
  }
};
