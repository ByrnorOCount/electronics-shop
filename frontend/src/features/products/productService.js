import api from '../../api/axios'; // Import a pre-configured axios instance

/**
 * Fetches a list of products, with optional filtering.
 * @param {object} [filters] - An object containing filter criteria.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products.
 */
const getProducts = async (filters) => {
  // Clean up filters to remove empty values before sending to the API
  const cleanFilters = Object.fromEntries(
    Object.entries(filters || {}).filter(([, value]) => value !== '' && value !== null)
  );
  const response = await api.get('/products', { params: cleanFilters });
  return response.data;
};

/**
 * Fetches a single product by its ID.
 * @param {string|number} id The ID of the product to fetch.
 * @returns {Promise<object>} A promise that resolves to the product object.
 */
const getProductById = async (id) => {
    if (!id) throw new Error("Product ID is required.");
    const response = await api.get(`/products/${id}`);
    return response.data;
};

/**
 * Fetches a list of featured products from the backend.
 * The backend should have an endpoint that returns a curated list of products.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of product objects.
 */
const getFeaturedProducts = async () => {
    // The backend controller `getProducts` expects a query parameter `?featured=true`
    const response = await api.get('/products', { params: { featured: true } });
    return response.data;
};

/**
 * Fetches a list of all product categories.
 * This is a public endpoint.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of category objects.
 */
const getProductCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

const productService = {
    getProducts,
    getProductById,
    getFeaturedProducts,
    getProductCategories,
};

export default productService;
