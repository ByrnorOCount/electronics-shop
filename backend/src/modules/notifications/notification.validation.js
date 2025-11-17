import Joi from "joi";

export const getNotifications = {
  query: Joi.object({
    limit: Joi.number().integer().min(1).optional(),
  }),
};

export const markAsRead = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
};
