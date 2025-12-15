import db from "../../config/db.js";
import { createNotification } from "../../modules/notifications/notification.service.js";
import logger from "../../config/logger.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

/**
 * Creates an order from cart items within a provided database transaction.
 * This function assumes stock has already been verified and locked by the caller.
 *
 * @param {number} userId - The ID of the user placing the order.
 * @param {string} shippingAddress - The shipping address for the order.
 * @param {string} paymentMethod - The payment method used (e.g., 'cod', 'stripe').
 * @param {object} paymentDetails - Additional details from the payment gateway (e.g., transaction ID).
 * @param {import("knex").Knex.Transaction} trx - The Knex transaction object.
 * @returns {Promise<object>} The newly created order object.
 */
export const createOrderFromCart = async (
  userId,
  shippingAddress,
  paymentMethod,
  paymentDetails = {},
  trx
) => {
  logger.info("Attempting to create order from cart within transaction.", {
    userId,
    paymentMethod,
  });

  const user = await trx("users").where({ id: userId }).first();
  if (!user) throw new Error("User not found");

  const cartItems = await trx("cart_items")
    .join("products", "cart_items.product_id", "products.id")
    .where("cart_items.user_id", userId)
    .select(
      "products.id as product_id",
      "products.price",
      "cart_items.quantity",
      "products.name",
      "products.stock"
    );

  logger.info(`Found ${cartItems.length} cart items for user ${userId}.`);

  if (cartItems.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create order with an empty cart."
    );
  }

  let totalAmount = 0;
  const stockUpdates = [];

  for (const item of cartItems) {
    // This check is a final safeguard within the transaction.
    if (item.stock === 0) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `'${item.name}' is now out of stock. Please remove it from your cart.`
      );
    }
    if (item.stock < item.quantity) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Not enough stock for '${item.name}'. Only ${item.stock} left, but you have ${item.quantity} in your cart.`
      );
    }
    totalAmount += item.price * item.quantity;
    // Prepare stock update promise
    stockUpdates.push(
      trx("products")
        .where({ id: item.product_id })
        .decrement("stock", item.quantity)
    );
  }

  // 1. Create the order record.
  const [order] = await trx("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_details: JSON.stringify(paymentDetails),
      status: "Pending",
    })
    .returning("*");

  // 2. Create order items.
  const orderItemsToInsert = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));
  await trx("order_items").insert(orderItemsToInsert);

  // 3. Decrement product stock for all items.
  await Promise.all(stockUpdates);

  // 4. Clear the user's cart.
  await trx("cart_items").where({ user_id: userId }).del();

  // 5. Create a notification for the user.
  await createNotification(
    userId,
    `Your order #${order.id} has been placed successfully.`,
    "/orders",
    trx
  );
  logger.info(
    `Order #${order.id} and associated records created in transaction.`,
    {
      orderId: order.id,
      userEmail: user.email,
      total: order.total_amount,
    }
  );

  return order;
};
