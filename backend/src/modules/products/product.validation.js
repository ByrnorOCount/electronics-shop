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
    hide_out_of_stock: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid("true", "false")
    ),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
    sortBy: Joi.string().valid("name", "price", "stock", "created_at"),
    sortOrder: Joi.string().valid("asc", "desc"),
  }),
};

export const getProductById = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};
