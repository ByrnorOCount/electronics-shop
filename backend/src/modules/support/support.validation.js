import Joi from "joi";

export const submitTicket = {
  body: Joi.object().keys({
    subject: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

export const getTicketById = {
  params: Joi.object().keys({
    ticketId: Joi.number().integer().required(),
  }),
};

export const getUserTickets = {
  query: Joi.object().keys({
    status: Joi.string().valid("open", "in_progress", "closed"),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const addTicketReply = {
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
