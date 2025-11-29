import * as productModel from "./product.model.js";
import httpStatus from "http-status";
import ApiError from "../../core/utils/ApiError.js";

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
    hide_out_of_stock,
    page = 1,
    limit = 12,
    sortBy = "created_at",
    sortOrder = "desc",
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
    is_featured: featured === "true" || featured === true,
    hide_out_of_stock:
      hide_out_of_stock === "true" || hide_out_of_stock === true,
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined)
  );

  const totalProducts = await productModel.count(cleanFilters);
  const totalPages = Math.ceil(totalProducts / limit);
  const offset = (page - 1) * limit;

  const products = await productModel.find(
    cleanFilters,
    { limit, offset },
    { sortBy, sortOrder }
  );

  return {
    products,
    page: Number(page),
    totalPages,
  };
};

/**
 * Get a single product by id
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export const getProductById = async (id) => {
  const parsed = Number(id);
  if (Number.isNaN(parsed)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product id");
  }

  const product = await productModel.findById(parsed);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

/**
 * Get all product categories
 */
export const getProductCategories = async () => {
  return productModel.findAllCategories();
};
