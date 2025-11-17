import * as productModel from './product.model.js';
import httpStatus from 'http-status';
import ApiError from '../../core/utils/ApiError.js';

/**
 * Get products with optional filtering.
 * @param {object} query - Request query object
 * @returns {Promise<Array>} list of products
 */
export const getProducts = async (query = {}) => {
    const {
        search,
        category,
        brand,
        featured,
        min_price,
        max_price,
    } = query;

    let categoryId;
    if (category) {
        const categoryRecord = await productModel.findCategoryByName(category);
        if (!categoryRecord) {
            // return empty array when invalid category name provided
            return [];
        }
        categoryId = categoryRecord.id;
    }

    const filters = {
        search,
        category_id: categoryId,
        brand,
        is_featured: featured === 'true' || featured === true,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined,
    };

    const products = await productModel.find(filters);
    return products;
};

/**
 * Get a single product by id
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export const getProductById = async (id) => {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid product id');
    }

    const product = await productModel.findById(parsed);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return product;
};

/**
 * Get all product categories
 */
export const getProductCategories = async () => {
    return productModel.findAllCategories();
};
