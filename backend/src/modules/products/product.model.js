import db from "../../config/db.js";

/**
 * Fetches a list of products from the database.
 * Can be filtered by various criteria.
 * @param {object} filters - The filter criteria.
 * @param {string} [filters.search] - Search term for product name.
 * @param {string} [filters.category] - Filter by category.
 * @param {string} [filters.brand] - Filter by brand.
 * @param {boolean} [filters.is_featured] - Filter for featured products.
 * @param {number} [filters.min_price] - Minimum price.
 * @param {number} [filters.max_price] - Maximum price.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const find = async (filters = {}) => {
  const query = db("products").select(
    "products.*",
    "categories.name as category_name"
  );

  query.leftJoin("categories", "products.category_id", "categories.id");

  if (filters.search) {
    query.where("name", "ilike", `%${filters.search}%`);
  }

  if (filters.category_id) {
    query.where({ category_id: filters.category_id });
  }

  if (filters.brand) {
    query.where({ brand: filters.brand });
  }

  if (filters.is_featured) {
    query.where({ is_featured: filters.is_featured });
  }

  if (filters.min_price) {
    query.where("price", ">=", filters.min_price);
  }

  if (filters.max_price) {
    query.where("price", "<=", filters.max_price);
  }

  return query;
};

/**
 * Fetches a single product by its ID from the database.
 * @param {number} id - The ID of the product to find.
 * @returns {Promise<object|undefined>} A promise that resolves to the product object or undefined if not found.
 */
export const findById = async (id) => {
  return db("products")
    .select("products.*", "categories.name as category_name")
    .leftJoin("categories", "products.category_id", "categories.id")
    .where("products.id", id)
    .first();
};

/**
 * Fetches multiple products by their IDs within a transaction and locks them for update.
 * @param {Array<number>} ids - An array of product IDs.
 * @param {import("knex").Knex.Transaction} trx - The Knex transaction object.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products.
 */
export const findByIdsForUpdate = (ids, trx) => {
  return trx("products")
    .whereIn("id", ids)
    .forUpdate() // This locks the selected rows until the transaction is committed or rolled back.
    .select("*");
};

/**
 * Fetches all product categories from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 */
export const findAllCategories = () => {
  return db("categories").orderBy("name", "asc");
};

/**
 * Finds a category by its name.
 * @param {string} name - The name of the category.
 * @returns {Promise<object|undefined>} The category object or undefined.
 */
export const findCategoryByName = (name) => {
  return db("categories").where({ name }).first();
};
