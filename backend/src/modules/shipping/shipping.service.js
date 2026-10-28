import * as cartModel from "../cart/cart.model.js";
import * as localShippingProvider from "./local-shipping.provider.js";
import { convertUSDtoVND } from "../../core/utils/currency.js";
import ApiError from "../../core/utils/ApiError.js";
import httpStatus from "http-status";

/**
 * Get a local simulated shipping quote for the user's current cart.
 * @param {number} userId - The ID of the user.
 * @param {string} zone - A supported local delivery zone.
 */
export const getCartShippingFee = async (userId, zone = "local") => {
  const cartItems = await cartModel.findByUserId(userId);
  if (cartItems.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart is empty. Cannot calculate shipping fee."
    );
  }

  // Products without package data use a small electronics parcel estimate.
  const totals = cartItems.reduce(
    (acc, item) => {
      const quantity = item.quantity;
      acc.actualWeightGrams += (item.weight_kg || 0.5) * quantity * 1000;
      acc.packageVolumeCm3 +=
        (item.length_cm || 20) *
        (item.width_cm || 15) *
        (item.height_cm || 10) *
        quantity;
      return acc;
    },
    { actualWeightGrams: 0, packageVolumeCm3: 0 }
  );

  const volumetricWeightGrams = (totals.packageVolumeCm3 / 5_000) * 1_000;
  const chargeableWeightGrams = Math.max(
    totals.actualWeightGrams,
    volumetricWeightGrams
  );
  const quote = localShippingProvider.calculateLocalShippingQuote({
    zone,
    chargeableWeightGrams,
  });
  const rate = await convertUSDtoVND(1);
  const shippingFeeUSD =
    Math.round((quote.shippingFeeVND / rate) * 100) / 100;
  return {
    ...quote,
    shippingFeeUSD,
    chargeableWeightKg: Math.round((chargeableWeightGrams / 1_000) * 100) / 100,
  };
};
