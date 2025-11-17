import Joi from "joi";

export const getProducts = {
  query: Joi.object().keys({
    search: Joi.string().allow("", null),
    category: Joi.string(),
    brand: Joi.string(),
    featured: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid("true", "false")
    ),
    min_price: Joi.number(),
    max_price: Joi.number(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

export const getProductById = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};
