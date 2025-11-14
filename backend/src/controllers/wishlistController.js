import * as Wishlist from '../models/wishlistModel.js';

/**
 * Get all items in the user's wishlist.
 * @route GET /api/wishlist
 * @access Private
 */
export const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findByUserId(req.user.id);
    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ message: 'Server error while retrieving wishlist.' });
  }
};

/**
 * Add a product to the wishlist.
 * @route POST /api/wishlist
 * @access Private
 */
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const existingItem = await Wishlist.findOne(userId, productId);
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist.' });
    }

    await Wishlist.create(userId, productId);
    res.status(201).json({ message: 'Product added to wishlist.' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist.' });
  }
};

/**
 * Remove a product from the wishlist.
 * @route DELETE /api/wishlist/:productId
 * @access Private
 */
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const deletedCount = await Wishlist.remove(userId, productId);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found in wishlist.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist.' });
  }
};
