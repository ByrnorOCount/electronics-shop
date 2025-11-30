import api from "../../api/axios";

/**
 * Generates a One-Time Password (OTP) for checkout and sends it to the user's email.
 * @returns {Promise<object>} A promise that resolves to the success message.
 */
const generateOtp = async () => {
  const response = await api.post("/orders/generate-otp");
  return response.data.data;
};

/**
 * Creates a new order for Cash on Delivery (COD).
 * @param {string} shippingAddress The user's shipping address.
 * @param {string} otp The 6-digit OTP for verification.
 * @returns {Promise<object>} A promise that resolves to the newly created order details.
 */
const createCodOrder = async (shippingAddress, otp) => {
  const response = await api.post("/orders", {
    shippingAddress,
    paymentMethod: "cod",
    otp,
  });
  return response.data.data;
};

/**
 * Creates a payment session for online payment providers like Stripe.
 * @param {'stripe'} paymentMethod The selected online payment method (e.g., 'stripe').
 * @returns {Promise<{url: string}>} A promise that resolves to an object containing the payment URL.
 */
const createPaymentSession = async (paymentMethod, shippingAddress) => {
  const response = await api.post("/orders/create-payment-session", {
    paymentMethod,
    shippingAddress,
  });
  return response.data.data;
};

/**
 * Fetches the order history for the logged-in user.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of orders.
 */
const getOrderHistory = async () => {
  const response = await api.get("/orders");
  return response.data.data;
};

/**
 * Fetches a single order by the Stripe session ID.
 * This is used on the success page to find the order created by the webhook.
 * @param {string} sessionId The Stripe checkout session ID.
 * @returns {Promise<object|null>} A promise that resolves to an order object or null if not found.
 */
const getOrderBySessionId = async (sessionId) => {
  const response = await api.get(`/orders/by-session/${sessionId}`);
  return response.data.data;
};

const orderService = {
  generateOtp,
  createCodOrder,
  createPaymentSession,
  getOrderHistory,
  getOrderBySessionId,
};

export default orderService;
