import Joi from "joi";

export const createOrder = {
  body: Joi.object({
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().valid("cod").required().messages({
      "any.only":
        'This endpoint only supports "cod" (Cash on Delivery). For online payments, please use the create-payment-session endpoint.',
    }),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  }),
};

export const createPaymentSession = {
  body: Joi.object({
    paymentMethod: Joi.string().valid("stripe").required(),
  }),
};

export const getOrders = {
  // No validation needed for this route
};
