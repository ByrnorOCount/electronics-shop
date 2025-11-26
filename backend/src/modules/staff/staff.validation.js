import Joi from "joi";

// image_url doesn't have uri rule to allow flexibility in storing different types of image references (e.g., base64, relative paths)

export const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    category_id: Joi.number().integer().allow(null),
    price: Joi.number().precision(2).required(),
    stock: Joi.number().integer().min(0).required(),
    image_url: Joi.string().allow(null, "").max(255), // Assuming a common VARCHAR(255) limit in DB
    is_featured: Joi.boolean(),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string().allow(null, ""),
      category_id: Joi.number().integer().allow(null),
      price: Joi.number().precision(2),
      stock: Joi.number().integer().min(0),
      image_url: Joi.string().allow(null, "").max(255), // Assuming a common VARCHAR(255) limit in DB
      is_featured: Joi.boolean(),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

export const updateOrderStatus = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
  }),
};

export const getAllProducts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getAllOrders = {
  query: Joi.object().keys({
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getAllSupportTickets = {
  query: Joi.object().keys({
    status: Joi.string().valid("open", "in_progress", "closed"),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const replyToTicket = {
  params: Joi.object().keys({
    ticketId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
};

export const updateTicketStatus = {
  params: Joi.object().keys({
    ticketId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid("open", "in_progress", "closed").required(),
  }),
};
