import Joi from "joi";

export const createItem = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    // Add other fields here
  }),
};

export const getAllItems = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
