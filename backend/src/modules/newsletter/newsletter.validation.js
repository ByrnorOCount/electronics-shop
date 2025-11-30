import Joi from "joi";

const subscribe = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export default {
  subscribe,
};
