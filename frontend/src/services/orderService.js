import api from './api';

/**
 * Generates a One-Time Password (OTP) for checkout and sends it to the user's email.
 * @returns {Promise<object>} A promise that resolves to the success message.
 */
const generateOtp = async () => {
  const response = await api.post('/orders/generate-otp');
  return response.data;
};

/**
 * Creates a new order for Cash on Delivery (COD).
 * @param {string} shippingAddress The user's shipping address.
 * @param {string} otp The 6-digit OTP for verification.
 * @returns {Promise<object>} A promise that resolves to the newly created order details.
 */
const createCodOrder = async (shippingAddress, otp) => {
  const response = await api.post('/orders', {
    shippingAddress,
    paymentMethod: 'cod',
    otp,
  });
  return response.data;
};

/**
 * Creates a payment session for online payment providers like Stripe or VNPay.
 * @param {'stripe' | 'vnpay'} paymentMethod The selected online payment method.
 * @returns {Promise<{url: string}>} A promise that resolves to an object containing the payment URL.
 */
const createPaymentSession = async (paymentMethod) => {
  const response = await api.post('/orders/create-payment-session', { paymentMethod });
  return response.data;
};

const orderService = {
  generateOtp,
  createCodOrder,
  createPaymentSession,
};

export default orderService;
