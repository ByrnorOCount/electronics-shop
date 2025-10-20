import api from './api'; // Import a pre-configured axios instance

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
    getFeaturedProducts,
};

export default productService;