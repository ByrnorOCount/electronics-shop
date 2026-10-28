import Joi from "joi";

const deliveryZone = Joi.string()
  .valid("local", "nearby", "regional", "remote")
  .default("local");

export const createOrder = {
  body: Joi.object({
    shippingAddress: Joi.string().required(),
    zone: deliveryZone,
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
    shippingAddress: Joi.string().required(),
    zone: deliveryZone,
  }),
};

export const getOrders = {
  // No validation needed for this route
};
