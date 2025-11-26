import Joi from "joi";

export const getAllUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    role: Joi.string().valid("customer", "staff", "admin"),
  }),
};

export const updateUserRole = {
  body: Joi.object().keys({
    role: Joi.string().valid("customer", "staff", "admin").required(),
  }),
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

export const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required().max(255),
    description: Joi.string().allow(null, ""),
  }),
};

export const updateCategory = {
  body: Joi.object()
    .keys({
      name: Joi.string().max(255),
      description: Joi.string().allow(null, ""),
    })
    .min(1), // Require at least one field to be updated
  params: Joi.object().keys({
    categoryId: Joi.number().integer().required(),
  }),
};

export const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer().required(),
  }),
};

export const getAnalyticsData = {
  query: Joi.object().keys({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")),
    // Add other analytics-specific query parameters here (e.g., period, metric_type)
  }),
};

export const getSystemLogs = {
  query: Joi.object().keys({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")),
    level: Joi.string().valid("info", "warn", "error", "debug"),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
  }),
};
