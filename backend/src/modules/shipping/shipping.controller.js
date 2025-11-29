// Old GHN shit, planned to be replaced with GHTK
import * as shippingService from "./shipping.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Calculate shipping fee for the user's cart.
 * @route POST /api/shipping/calculate-fee
 * @access Private
 */
export const calculateFee = async (req, res, next) => {
  const { districtId, wardCode } = req.body;
  const userId = req.user.id;

  try {
    const fee = await shippingService.getCartShippingFee(userId, {
      districtId,
      wardCode,
    });
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
