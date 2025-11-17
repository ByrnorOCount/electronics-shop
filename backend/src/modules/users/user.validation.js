import Joi from "joi";

const password = Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  });

export const updateProfile = {
  body: Joi.object()
    .keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
    })
    .min(1), // Require at least one field to be updated
};

export const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: password,
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: password,
  }),
};

export const verifyEmail = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
