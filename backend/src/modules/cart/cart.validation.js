import Joi from 'joi';

const cartItemSchema = Joi.object({
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
});

export const addItem = {
    body: cartItemSchema,
};

export const updateItem = {
    params: Joi.object({
        itemId: Joi.number().integer().required(),
    }),
    body: Joi.object({
        quantity: Joi.number().integer().min(1).required(),
    }),
};

export const removeItem = {
    params: Joi.object({
        itemId: Joi.number().integer().required(),
    }),
};

export const syncCart = {
    body: Joi.alternatives().try(
        Joi.array().items(cartItemSchema),
        Joi.object({
            items: Joi.array().items(cartItemSchema).required()
        })
    ).messages({
        'alternatives.match': 'Request body must be an array of cart items or an object with an "items" array.'
    })
};
