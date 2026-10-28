import Joi from "joi";

const deliveryZone = Joi.string().valid(
  "local",
  "nearby",
  "regional",
  "remote"
);

export const calculateFee = {
  body: Joi.object({
    zone: deliveryZone.required().description("Local simulated delivery zone"),
  }),
};
