// Old GHN shit, planned to be replaced with GHTK
import axios from "axios";
import env from "../../config/env.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import logger from "../../config/logger.js";

const ghnApi = axios.create({
  baseURL: env.GHN_API_URL,
  headers: {
    "Content-Type": "application/json",
    Token: env.GHN_API_TOKEN,
    ShopId: env.GHN_SHOP_ID,
  },
});

/**
 * Calculates the shipping fee using Giao Hàng Nhanh API.
 * @param {object} orderDetails - Details of the order for fee calculation.
 * @param {number} orderDetails.toDistrictId - The destination district ID.
 * @param {string} orderDetails.toWardCode - The destination ward code.
 * @param {number} orderDetails.totalWeightGrams - Total weight of items in grams.
 * @param {number} orderDetails.totalValueVND - Total value of the order in VND.
 * @param {object} orderDetails.packageDimensions - The estimated package dimensions.
 * @returns {Promise<number>} The calculated shipping fee in VND.
 */
export const calculateShippingFee = async ({
  toDistrictId,
  toWardCode,
  totalWeightGrams,
  totalValueVND,
  packageDimensions,
}) => {
  try {
    // GHN requires a service_id to calculate the fee.
    // We first get available services for the destination.
    const servicesResponse = await ghnApi.post(
      "/v2/shipping-order/available-services",
      {
        shop_id: Number(env.GHN_SHOP_ID),
        from_district: Number(env.SHOP_DISTRICT_ID),
        to_district: toDistrictId,
      }
    );

    if (
      !servicesResponse.data.data ||
      servicesResponse.data.data.length === 0
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "No available shipping services for the destination."
      );
    }

    // For simplicity, we'll use the first available service.
    // In a real app, you might let the user choose.
    const serviceId = servicesResponse.data.data[0].service_id;

    const feeResponse = await ghnApi.post("/v2/shipping-order/fee", {
      from_district_id: Number(env.SHOP_DISTRICT_ID),
      from_ward_code: env.SHOP_WARD_CODE,
      service_id: serviceId,
      to_district_id: toDistrictId,
      to_ward_code: toWardCode,
      weight: Math.round(totalWeightGrams),
      insurance_value: Math.round(totalValueVND),
      height: Math.round(packageDimensions.height),
      length: Math.round(packageDimensions.length),
      width: Math.round(packageDimensions.width),
    });

    const fee = feeResponse.data.data.total;
    logger.info(
      `GHN Shipping Fee Calculated: ${fee} VND for district ${toDistrictId}`
    );
    return fee;
  } catch (error) {
    logger.error("Error calculating GHN shipping fee:", {
      message: error.response?.data?.message || error.message,
      requestData: { toDistrictId, toWardCode },
    });
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Could not calculate shipping fee. Please try again later."
    );
  }
};
