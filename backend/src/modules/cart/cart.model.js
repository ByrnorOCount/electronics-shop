import db from "../../config/db.js";

/**
 * Finds all items in a user's cart, joining with product details.
 * @param {number} userId - The ID of the user.
 * @param {import("knex").Knex.Transaction} [trx] - Optional Knex transaction object.
 * @returns {Promise<Array>} A promise that resolves to an array of cart items.
 */
export const findByUserId = (userId, trx) => {
  const queryBuilder = trx || db;
  return queryBuilder("cart_items")
    .join("products", "cart_items.product_id", "products.id")
    .where("cart_items.user_id", userId)
    .select(
      "cart_items.id",
      "products.id as product_id",
      "products.name",
      "products.price",
      "products.image_url",
      "cart_items.quantity",
      "products.stock"
    )
    .orderBy("cart_items.id", "asc");
};

/**
 * Finds a single cart item by its ID, joining with product details.
 * @param {number} itemId - The ID of the cart item.
 * @returns {Promise<object|undefined>} The cart item with product details.
 */
export const findById = (itemId) => {
  return db("cart_items")
    .join("products", "cart_items.product_id", "products.id")
    .where("cart_items.id", itemId)
    .select(
      "cart_items.id",
      "products.id as product_id",
      "products.name",
      "products.price",
      "products.image_url",
      "cart_items.quantity",
      "products.stock"
    )
    .first();
};

/**
 * Finds a single cart item by product and user ID.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<object|undefined>} The cart item or undefined if not found.
 */
export const findOne = (userId, productId) => {
  return db("cart_items")
    .where({ user_id: userId, product_id: productId })
    .first();
};

/**
 * Creates a new item in the cart.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The quantity to add.
 * @returns {Promise<object>} The newly created cart item.
 */
export const create = async (userId, productId, quantity) => {
  const [newItem] = await db("cart_items")
    .insert({ user_id: userId, product_id: productId, quantity })
    .returning("*");
  return newItem;
};

/**
 * Updates the quantity of an existing cart item.
 * @param {number} itemId - The ID of the cart item.
 * @param {number} quantity - The new quantity.
 * @param {number} userId - The ID of the user (for ownership verification).
 * @returns {Promise<number>} The number of updated rows.
 */
export const update = (itemId, quantity, userId) => {
  return db("cart_items")
    .where({ id: itemId, user_id: userId }) // Enforce ownership
    .update({
      quantity,
      updated_at: db.fn.now(),
    })
    .returning("*");
};

/**
 * Deletes an item from the cart.
 * @param {number} itemId - The ID of the cart item.
 * @param {number} userId - The ID of the user (for ownership verification).
 * @returns {Promise<number>} The number of deleted rows.
 */
export const remove = (itemId, userId) => {
  return db("cart_items").where({ id: itemId, user_id: userId }).del();
};

/**
 * Replaces the entire cart for a user. Used for syncing.
 * @param {number} userId - The ID of the user.
 * @param {Array<{productId: number, quantity: number}>} items - The array of items to set as the new cart.
 * @returns {Promise<void>}
 */
export const replace = (userId, items) => {
  return db.transaction(async (trx) => {
    // 1. Clear the user's existing cart.
    await trx("cart_items").where({ user_id: userId }).del();

    // 2. If there are items to sync, insert them.
    if (items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        user_id: userId,
        product_id: item.productId,
        quantity: item.quantity,
      }));
      await trx("cart_items").insert(itemsToInsert);
    }
  });
};

/**
 * Moves an item from the user's cart to their wishlist in a single transaction.
 * @param {number} userId
 * @param {number} cartItemId
 * @returns {Promise<{message: string}>}
 */
export const saveForLater = (userId, cartItemId) => {
  return db.transaction(async (trx) => {
    // 1. Find the cart item and ensure it belongs to the user.
    const cartItem = await trx("cart_items")
      .where({ id: cartItemId, user_id: userId })
      .first();

    if (!cartItem) {
      return {
        success: false,
        status: httpStatus.NOT_FOUND,
        message: "Cart item not found.",
      };
    }

    const { product_id: productId } = cartItem;

    // 2. Check if the item is already in the wishlist.
    const wishlistItem = await trx("wishlists")
      .where({ user_id: userId, product_id: productId })
      .first();

    // 3. Add to wishlist if it's not already there.
    if (!wishlistItem) {
      await trx("wishlists").insert({
        user_id: userId,
        product_id: productId,
      });
    }

    // 4. Delete the item from the cart.
    await trx("cart_items").where({ id: cartItemId }).del();

    const message = wishlistItem
      ? "Item already in wishlist."
      : "Item added to wishlist.";
    return { success: true, message: `Item moved to wishlist. (${message})` };
  });
};
