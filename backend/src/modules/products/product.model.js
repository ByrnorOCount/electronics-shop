import db from "../../config/db.js";

/**
 * Builds a query for products with optional filters.
 * @param {object} filters - The filter criteria.
 * @param {string} [filters.search] - Search term for product name.
 * @param {string} [filters.category] - Filter by category.
 * @param {string} [filters.brand] - Filter by brand.
 * @param {boolean} [filters.is_featured] - Filter for featured products.
 * @param {number} [filters.min_price] - Minimum price.
 * @param {number} [filters.max_price] - Maximum price.
 * @param {boolean} [filters.hide_out_of_stock] - If true, only returns products with stock > 0.
 * @returns {import("knex").Knex.QueryBuilder} A Knex query builder instance.
 */
const buildQuery = (filters = {}) => {
  const query = db("products").select(
    "products.*",
    "categories.name as category_name"
  );

  query.leftJoin("categories", "products.category_id", "categories.id");

  if (filters.search && filters.search.trim() !== "") {
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

  if (filters.hide_out_of_stock) {
    query.where("stock", ">", 0);
  }

  return query;
};

/**
 * Fetches a list of products from the database.
 * Can be filtered by various criteria and paginated.
 * @param {object} filters - The filter criteria.
 * @param {object} pagination - Pagination options.
 * @param {number} pagination.limit - Number of items per page.
 * @param {number} pagination.offset - Number of items to skip.
 * @param {object} sort - Sorting options.
 * @param {string} sort.sortBy - The column to sort by.
 * @param {string} sort.sortOrder - The sort order ('asc' or 'desc').
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const find = async (filters = {}, pagination = {}, sort = {}) => {
  const query = buildQuery(filters);

  if (pagination.limit) {
    query.limit(pagination.limit);
  }
  if (pagination.offset) {
    query.offset(pagination.offset);
  }

  const { sortBy = "created_at", sortOrder = "desc" } = sort;
  // Ensure we are referencing the table for clarity, especially for 'created_at'
  const sortColumn = sortBy === "created_at" ? "products.created_at" : sortBy;

  return query.orderBy(sortColumn, sortOrder);
};

/**
 * Counts the total number of products matching the filters.
 * @param {object} filters - The filter criteria.
 * @returns {Promise<number>} The total count of matching products.
 */
export const count = async (filters = {}) => {
  // Clone the query, remove existing select columns, and then apply the count.
  const query = buildQuery(filters);
  const result = await query
    .clearSelect()
    .count("products.id as total")
    .first();
  return result ? parseInt(result.total, 10) : 0;
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
