import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3001),
    FRONTEND_URL: Joi.string().required().description("Frontend base URL"),

    // Security
    JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
    JWT_EXPIRES_IN: Joi.string()
      .default("24h")
      .description("JWT expiration time"),

    // Stripe
    STRIPE_SECRET_KEY: Joi.string().required().description("Stripe Secret Key"),
    STRIPE_WEBHOOK_SECRET: Joi.string()
      .required()
      .description("Stripe webhook secret"),

    // Email
    EMAIL_HOST: Joi.string().description("Email SMTP host"),
    EMAIL_PORT: Joi.number().description("Email SMTP port"),
    EMAIL_USER: Joi.string().description("Email username"),
    EMAIL_PASS: Joi.string().description("Email password"),

    // OAuth
    GOOGLE_CLIENT_ID: Joi.string().required().description("Google Client ID"),
    GOOGLE_CLIENT_SECRET: Joi.string()
      .required()
      .description("Google Client Secret"),
    FACEBOOK_APP_ID: Joi.string().required().description("Facebook App ID"),
    FACEBOOK_APP_SECRET: Joi.string()
      .required()
      .description("Facebook App Secret"),

    // Shipping & Currency
    USD_TO_VND_RATE: Joi.number()
      .required()
      .description("USD to VND exchange rate"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default envVars;
