import db from "../../config/db.js";

/**
 * Finds all products in a user's wishlist.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of product objects in the wishlist.
 */
export const findByUserId = (userId) => {
  return db("wishlists")
    .join("products", "wishlists.product_id", "products.id")
    .where("wishlists.user_id", userId)
    .select("products.*")
    .orderBy("wishlists.id", "asc");
};

/**
 * Finds a single item in a user's wishlist.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<object|undefined>} The wishlist item or undefined if not found.
 */
export const findOne = (userId, productId) => {
  return db("wishlists")
    .where({ user_id: userId, product_id: productId })
    .first();
};

/**
 * Adds a product to a user's wishlist.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to add.
 * @returns {Promise<void>}
 */
export const create = (userId, productId) => {
  return db("wishlists").insert({ user_id: userId, product_id: productId });
};

/**
 * Removes a product from a user's wishlist.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to remove.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const remove = (userId, productId) => {
  return db("wishlists")
    .where({ user_id: userId, product_id: productId })
    .del();
};

/**
 * Finds all user IDs who have a specific product in their wishlist.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of user IDs.
 */
export const findUsersByProductId = async (productId) => {
  const results = await db("wishlists")
    .where({ product_id: productId })
    .select("user_id");
  return results.map((r) => r.user_id);
};
