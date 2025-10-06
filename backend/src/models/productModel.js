import db from '../config/db.js';

/**
 * Fetches a list of products from the database.
 * Can be filtered by the 'is_featured' flag.
 * @param {object} filters - The filter criteria.
 * @param {boolean} [filters.featured] - Filter for featured products.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const find = async (filters = {}) => {
  const query = db('products');

  if (filters.featured) {
    query.where('is_featured', true);
  }

  // Add other filters like category, price range, etc. here in the future

  return query.select('*');
};

// Future functions like findById, create, update, etc. will go here.
