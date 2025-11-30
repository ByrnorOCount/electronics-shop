import db from "../../config/db.js";
import * as cartModel from "../cart/cart.model.js";
import * as productModel from "../products/product.model.js";
import { createOrderFromCart } from "../../core/integrations/payment.service.js";
import ApiError from "../../core/utils/ApiError.js";
import httpStatus from "http-status";

/**
 * Updates a user's record with an OTP hash and expiration.
 * @param {number} userId - The ID of the user.
 * @param {string} otpHash - The hashed OTP.
 * @returns {Promise<void>}
 */
export const saveOtpForUser = (userId, otpHash) => {
  return db("users")
    .where({ id: userId })
    .update({
      otp_hash: otpHash,
      otp_expires: db.raw("NOW() + INTERVAL '10 minutes'"),
    });
};

/**
 * Finds a user by their ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findUserById = (userId) => {
  return db("users").where({ id: userId }).first();
};

/**
 * Finds all cart items for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of cart items.
 */
export const findCartItemsByUserId = (userId) => {
  return db("cart_items").where({ user_id: userId });
};

/**
 * Finds a single order by its ID, including its items.
 * @param {number} orderId - The ID of the order.
 * @returns {Promise<object|undefined>} An order object with its items, or undefined.
 */
export const findOrderByIdWithItems = async (orderId) => {
  const order = await db("orders").where({ id: orderId }).first();

  if (!order) {
    return undefined;
  }

  const items = await db("order_items")
    .join("products", "order_items.product_id", "products.id")
    .where("order_items.order_id", orderId)
    .select("order_items.*", "products.name", "products.image_url");

  return {
    ...order,
    items,
  };
};
/**
 * Finds all orders for a user, including their items.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of order objects with their items.
 */
export const findOrdersByUserIdWithItems = async (userId) => {
  const orders = await db("orders")
    .where({ user_id: userId })
    .orderBy("created_at", "desc");

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((o) => o.id);
  const items = await db("order_items")
    .join("products", "order_items.product_id", "products.id")
    .whereIn("order_items.order_id", orderIds)
    .select("order_items.*", "products.name", "products.image_url");

  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.order_id === order.id),
  }));
};

/**
 * Clears the OTP fields for a user after successful use.
 * @param {number} userId - The ID of the user.
 */
export const clearUserOtp = (userId) => {
  return db("users")
    .where({ id: userId })
    .update({ otp_hash: null, otp_expires: null });
};

/**
 * Creates an order within a database transaction, ensuring stock is sufficient
 * and decrementing it atomically. This is the primary function for order creation.
 * @param {number} userId
 * @param {string} shippingAddress
 * @param {string} paymentMethod
 * @param {object} [paymentDetails={}]
 * @returns {Promise<object>} The newly created order.
 */
export const createOrderFromCartInTransaction = (
  userId,
  shippingAddress,
  paymentMethod,
  paymentDetails = {}
) => {
  return db.transaction(async (trx) => {
    // 1. Get cart items for the user within the transaction.
    const cartItems = await cartModel.findByUserId(userId, trx);
    if (cartItems.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty.");
    }

    // 2. Get product details and lock rows for update.
    const productIds = cartItems.map((item) => item.product_id);
    const products = await productModel.findByIdsForUpdate(productIds, trx);
    const productMap = new Map(products.map((p) => [p.id, p]));

    // 3. Verify stock.
    for (const item of cartItems) {
      const product = productMap.get(item.product_id);
      if (!product || product.stock < item.quantity) {
        throw new ApiError(
          httpStatus.CONFLICT,
          `Not enough stock for ${item.name}. Only ${product?.stock || 0} left.`
        );
      }
    }

    // 4. Delegate to the payment service to create order, items, and update stock.
    // This function contains the logic for creating order records, order items,
    // decrementing stock, and clearing the cart, all within the provided transaction.
    const order = await createOrderFromCart(
      userId,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      trx
    );

    // The transaction will be committed automatically if no errors are thrown.
    // If any error occurs (e.g., stock issue), the transaction is rolled back.
    return order;
  });
};

/**
 * Finds an order by the Stripe session ID stored in payment_details.
 * @param {string} sessionId The Stripe checkout session ID.
 * @param {number} userId The ID of the user.
 * @returns {Promise<object|undefined>} The order object or undefined.
 */
export const findOrderBySessionId = (sessionId, userId) => {
  return db("orders")
    .where({
      user_id: userId,
      payment_method: "stripe",
    })
    .whereRaw("payment_details->>'sessionId' = ?", [sessionId])
    .first();
};
