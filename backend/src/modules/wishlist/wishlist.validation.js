import Joi from "joi";

export const getWishlist = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const addToWishlist = {
  body: Joi.object().keys({
    productId: Joi.number().integer().required(),
  }),
};

export const removeFromWishlist = {
  params: Joi.object().keys({
    productId: Joi.number().integer().required(),
  }),
};
