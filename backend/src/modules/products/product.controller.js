import * as productService from './product.service.js';
import httpStatus from 'http-status';
import ApiResponse from '../../core/utils/ApiResponse.js';

/**
 * @summary Get all products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts(req.query);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, products, 'Products retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get a single product by id
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, product, 'Product retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get all product categories
 * @route GET /api/products/categories
 * @access Public
 */
export const getProductCategories = async (req, res, next) => {
  try {
    const categories = await productService.getProductCategories();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, categories, 'Categories retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};
