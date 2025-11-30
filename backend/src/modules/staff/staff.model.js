import db from "../../config/db.js";

/**
 * Creates a new product.
 * @param {object} productData - The data for the new product.
 * @returns {Promise<object>} The newly created product object.
 */
export const createProduct = async (productData) => {
  const [newProduct] = await db("products").insert(productData).returning("*");
  return newProduct;
};

/**
 * Updates an existing product.
 * @param {number} productId - The ID of the product to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object|undefined>} The updated product object or undefined if not found.
 */
export const updateProduct = async (productId, updateData) => {
  const [updatedProduct] = await db("products")
    .where({ id: productId })
    .update(updateData)
    .returning("*");
  return updatedProduct;
};

/**
 * Deletes a product.
 * @param {number} productId - The ID of the product to delete.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deleteProduct = (productId) => {
  return db("products").where({ id: productId }).del();
};

/**
 * Finds all products.
 * @param {object} options - Query options.
 * @returns {Promise<Array>} An array of product objects.
 */
export const findAllProducts = (options = {}) => {
  const query = db("products");
  // Example sorting: ?sortBy=price:desc
  const [field, order] = options.sortBy
    ? options.sortBy.split(":")
    : ["id", "asc"];
  query.orderBy(field, order);
  return query;
};

/**
 * Finds all orders.
 * @param {object} options - Query options.
 * @returns {Promise<Array>} An array of order objects.
 */
export const findAllOrders = (options = {}) => {
  const query = db("orders")
    .select(
      "orders.*",
      db.raw("CONCAT(users.first_name, ' ', users.last_name) as customer_name")
    )
    .join("users", "orders.user_id", "users.id");

  if (options.status) {
    query.where("status", options.status);
  }
  const [field, order] = options.sortBy
    ? options.sortBy.split(":")
    : ["created_at", "desc"];
  query.orderBy(field, order);
  return query;
};

/**
 * Finds all items for a given order.
 * @param {number} orderId - The ID of the order.
 * @returns {Promise<Array>} An array of order item objects.
 */
export const findOrderItems = (orderId) => {
  return db("order_items")
    .select("order_items.*", "products.name", "products.image_url")
    .join("products", "order_items.product_id", "products.id")
    .where("order_items.order_id", orderId);
};

/**
 * Finds a single order by its ID.
 * @param {number} orderId - The ID of the order.
 * @returns {Promise<object|undefined>} An order object or undefined if not found.
 */
export const findOrderById = (orderId) => {
  return db("orders")
    .select(
      "orders.*",
      db.raw("CONCAT(users.first_name, ' ', users.last_name) as customer_name")
    )
    .join("users", "orders.user_id", "users.id")
    .where("orders.id", orderId)
    .first();
};
/**
 * Updates the status of an order.
 * @param {number} orderId - The ID of the order to update.
 * @param {string} status - The new status.
 * @returns {Promise<object|undefined>} The updated order object or undefined if not found.
 */
export const updateOrderStatus = async (orderId, status) => {
  const [updatedOrder] = await db("orders")
    .where({ id: orderId })
    .update({ status })
    .returning("*");
  return updatedOrder;
};

/**
 * Finds all support tickets.
 * @param {object} options - Query options.
 * @returns {Promise<Array>} An array of support ticket objects.
 */
export const findAllSupportTickets = (options = {}) => {
  const query = db("support_tickets")
    .select(
      "support_tickets.*",
      db.raw("CONCAT(users.first_name, ' ', users.last_name) as customer_name")
    )
    .join("users", "support_tickets.user_id", "users.id");
  if (options.status) {
    query.where("status", options.status);
  }
  const [field, order] = options.sortBy
    ? options.sortBy.split(":")
    : ["created_at", "desc"];
  query.orderBy(field, order);
  return query;
};

/**
 * Finds a single support ticket by its ID.
 * @param {number} ticketId - The ID of the ticket.
 * @returns {Promise<object|undefined>} The ticket object or undefined.
 */
export const findSupportTicketById = (ticketId) => {
  return db("support_tickets").where({ id: ticketId }).first();
};

/**
 * Creates a reply for a support ticket.
 * @param {object} replyData - The data for the reply.
 * @returns {Promise<object>} The newly created reply object.
 */
export const createSupportTicketReply = async (replyData) => {
  const [newReply] = await db("support_ticket_replies")
    .insert(replyData)
    .returning("*"); // Note: The link is constructed in the service layer for this one.
  return newReply;
};

/**
 * Updates a support ticket.
 * @param {number} ticketId - The ID of the ticket to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<Array<object>>} An array containing the updated ticket object.
 */
export const update = (ticketId, updateData) => {
  return db("support_tickets")
    .where({ id: ticketId })
    .update(updateData)
    .returning("*");
};
