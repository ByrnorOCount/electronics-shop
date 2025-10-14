import db from '../config/db.js';

/**
 * Get all items in the user's cart.
 * @route GET /api/cart
 * @access Private
 */
export const getCart = async (req, res) => {
  try {
    const cartItems = await db('cart_items')
      .join('products', 'cart_items.product_id', 'products.id')
      .where('cart_items.user_id', req.user.id)
      .select(
        'cart_items.id', // This is the cart_item id
        'products.id as product_id',
        'products.name',
        'products.price',
        'products.image_url',
        'cart_items.quantity'
      )
      .orderBy('cart_items.id', 'asc');
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
    const existingItem = await db('cart_items')
      .where({ user_id: userId, product_id: productId })
      .first();

    if (existingItem) {
      // Item exists, update quantity
      const [updatedItem] = await db('cart_items')
        .where({ id: existingItem.id })
        .update({ quantity: existingItem.quantity + quantity })
        .returning('*');
      res.status(200).json(updatedItem);
    } else {
      // Item does not exist, insert new
      const [newItem] = await db('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity })
        .returning('*');
      res.status(201).json(newItem);
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart.' });
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
    const [updatedItem] = await db('cart_items')
      .where({ id: itemId, user_id: req.user.id })
      .update({ quantity })
      .returning('*');

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
    const deletedCount = await db('cart_items')
      .where({ id: itemId, user_id: userId })
      .del();

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
