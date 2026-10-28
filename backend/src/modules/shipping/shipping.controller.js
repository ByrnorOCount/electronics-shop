import * as shippingService from "./shipping.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Calculate a local simulated shipping quote for the user's cart.
 * @route POST /api/shipping/calculate-fee
 * @access Private
 */
export const calculateFee = async (req, res, next) => {
  const { zone } = req.body;
  const userId = req.user.id;

  try {
    const fee = await shippingService.getCartShippingFee(userId, zone);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          fee,
          "Shipping fee calculated successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};
