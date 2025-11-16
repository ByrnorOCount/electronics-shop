import Joi from 'joi';

const updateUserRole = {
    body: Joi.object().keys({
        role: Joi.string().valid('customer', 'staff', 'admin').required(),
    }),
    params: Joi.object().keys({
        userId: Joi.number().integer().required(),
    }),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.number().integer().required(),
    }),
};

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().required().max(255),
        description: Joi.string().allow(null, ''),
    }),
};

const updateCategory = {
    body: Joi.object().keys({
        name: Joi.string().max(255),
        description: Joi.string().allow(null, ''),
    }).min(1), // Require at least one field to be updated
    params: Joi.object().keys({
        categoryId: Joi.number().integer().required(),
    }),
};

const deleteCategory = {
    params: Joi.object().keys({
        categoryId: Joi.number().integer().required(),
    }),
};

export default {
    updateUserRole,
    deleteUser,
    createCategory,
    updateCategory,
    deleteCategory,
};
