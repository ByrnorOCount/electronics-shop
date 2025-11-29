// Old GHN shit, planned to be replaced with GHTK
import Joi from "joi";

export const calculateFee = {
  body: Joi.object({
    districtId: Joi.number()
      .integer()
      .required()
      .description("Giao Hàng Nhanh district ID"),
    wardCode: Joi.string().required().description("Giao Hàng Nhanh ward code"),
  }),
};
