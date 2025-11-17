import Joi from 'joi';

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
