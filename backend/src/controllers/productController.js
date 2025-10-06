import * as Product from '../models/productModel.js';

/**
 * Gets a list of products, optionally filtering for featured ones.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getProducts = async (req, res) => {
  try {
    const filters = {};
    // Check for the 'featured' query parameter (e.g., /api/products?featured=true)
    if (req.query.featured === 'true') {
      filters.featured = true;
    }
    const products = await Product.find(filters);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};
