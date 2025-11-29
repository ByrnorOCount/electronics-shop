// Old GHN shit, planned to be replaced with GHTK
import * as cartModel from "../cart/cart.model.js";
import * as shippingIntegration from "../../core/integrations/shipping.service.js";
import { convertUSDtoVND } from "../../core/utils/currency.js";
import ApiError from "../../core/utils/ApiError.js";
import httpStatus from "http-status";

/**
 * Get shipping fee for the user's current cart.
 * @param {number} userId - The ID of the user.
 * @param {object} destination - The destination address details.
 * @param {number} destination.districtId - The destination district ID from GHN.
 * @param {string} destination.wardCode - The destination ward code from GHN.
 * @returns {Promise<{shippingFeeVND: number, shippingFeeUSD: number}>}
 */
export const getCartShippingFee = async (userId, destination) => {
  const cartItems = await cartModel.findByUserId(userId);
  if (cartItems.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart is empty. Cannot calculate shipping fee."
    );
  }

  // Calculate total weight and value from cart items
  const totals = cartItems.reduce(
    (acc, item) => {
      const quantity = item.quantity;
      // Sum weights
      acc.weightGrams += (item.weight_kg || 0.5) * quantity * 1000;
      // Sum value
      acc.valueUSD += item.price * item.quantity;
      // Estimate package dimensions: stack items vertically, take max length/width
      acc.totalHeightCm += (item.height_cm || 10) * quantity;
      acc.maxLengthCm = Math.max(acc.maxLengthCm, item.length_cm || 10);
      acc.maxWidthCm = Math.max(acc.maxWidthCm, item.width_cm || 10);
      return acc;
    },
    {
      weightGrams: 0,
      valueUSD: 0,
      totalHeightCm: 0,
      maxLengthCm: 0,
      maxWidthCm: 0,
    }
  );

  const totalValueVND = await convertUSDtoVND(totals.valueUSD);

  const feeVND = await shippingIntegration.calculateShippingFee({
    toDistrictId: destination.districtId,
    toWardCode: destination.wardCode,
    totalWeightGrams: totals.weightGrams,
    totalValueVND,
    packageDimensions: {
      height: totals.totalHeightCm,
      length: totals.maxLengthCm,
      width: totals.maxWidthCm,
    },
  });

  const rate = await convertUSDtoVND(1);
  return { shippingFeeVND: feeVND, shippingFeeUSD: feeVND / rate };
};
