import * as Product from '../models/productModel.js';

/**
 * Gets a list of products with filtering and searching.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getProducts = async (req, res) => {
  try {
    // Extract filters from query parameters
    const { search, category, brand, featured, min_price, max_price } = req.query;

    const filters = {
      search,
      category,
      brand,
      is_featured: featured === 'true',
      min_price: min_price ? parseFloat(min_price) : undefined,
      max_price: max_price ? parseFloat(max_price) : undefined,
    };

    const products = await Product.find(filters);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

/**
 * Gets a single product by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error fetching product with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};
