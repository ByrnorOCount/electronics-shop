import api from './api'; // Import a pre-configured axios instance

/**
 * Fetches a list of all products from the backend.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of product objects.
 */
const getProducts = async () => {
    const response = await api.get('/products');
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

const productService = {
    getProducts,
    getProductById,
    getFeaturedProducts,
};

export default productService;
