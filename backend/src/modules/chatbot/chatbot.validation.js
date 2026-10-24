import Joi from "joi";

export const chat = {
  body: Joi.object({
    message: Joi.string().trim().min(1).max(1000).required(),
    history: Joi.array()
      .items(
        Joi.object({
          role: Joi.string().valid("user").required(),
          content: Joi.string().trim().min(1).max(1000).required(),
        }).unknown(false)
      )
      .max(8)
      .default([]),
  }).unknown(false),
};