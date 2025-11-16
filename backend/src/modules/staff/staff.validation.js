import Joi from 'joi';

export const createProduct = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        category_id: Joi.number().integer().allow(null),
        price: Joi.number().precision(2).required(),
        stock: Joi.number().integer().min(0).required(),
        image_url: Joi.string().uri().allow(null, ''),
        is_featured: Joi.boolean(),
    }),
};

export const updateProduct = {
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object({
        name: Joi.string(),
        description: Joi.string().allow(null, ''),
        category_id: Joi.number().integer().allow(null),
        price: Joi.number().precision(2),
        stock: Joi.number().integer().min(0),
        image_url: Joi.string().uri().allow(null, ''),
        is_featured: Joi.boolean(),
    }).min(1), // Require at least one field to be updated
};

export const deleteProduct = {
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
};

export const updateOrderStatus = {
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object({
        status: Joi.string().required(),
    }),
};

export const replyToTicket = {
    params: Joi.object({
        ticketId: Joi.number().integer().required(),
    }),
    body: Joi.object({
        message: Joi.string().required(),
    }),
};