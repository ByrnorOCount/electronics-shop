import env from "../../config/env.js";

/**
 * Converts a USD amount to VND using a fixed exchange rate from environment variables.
 * @param {number} usdAmount - The amount in USD.
 * @returns {Promise<number>} The equivalent amount in VND.
 */
export const convertUSDtoVND = async (usdAmount) => {
  const rate = env.USD_TO_VND_RATE;
  return Promise.resolve(usdAmount * rate);
};
