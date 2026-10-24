import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/cart/cart.model.js", () => ({
  findByUserId: vi.fn(),
}));

vi.mock("../../src/core/integrations/shipping.service.js", () => ({
  calculateShippingFee: vi.fn(),
}));

vi.mock("../../src/core/utils/currency.js", () => ({
  convertUSDtoVND: vi.fn(),
}));

import * as cartModel from "../../src/modules/cart/cart.model.js";
import * as shippingIntegration from "../../src/core/integrations/shipping.service.js";
import { convertUSDtoVND } from "../../src/core/utils/currency.js";
import { getCartShippingFee } from "../../src/modules/shipping/shipping.service.js";

describe("shipping service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an empty cart without calling shipping providers", async () => {
    cartModel.findByUserId.mockResolvedValue([]);

    await expect(
      getCartShippingFee(7, { districtId: 12, wardCode: "WARD-1" })
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(convertUSDtoVND).not.toHaveBeenCalled();
    expect(shippingIntegration.calculateShippingFee).not.toHaveBeenCalled();
  });

  it("calculates shipping from cart weight, value, and package dimensions", async () => {
    cartModel.findByUserId.mockResolvedValue([
      {
        product_id: 1,
        quantity: 2,
        price: 10,
        weight_kg: 0.5,
        height_cm: 8,
        length_cm: 20,
        width_cm: 12,
      },
    ]);
    convertUSDtoVND.mockImplementation(async (amount) => amount * 25_000);
    shippingIntegration.calculateShippingFee.mockResolvedValue(30_000);

    await expect(
      getCartShippingFee(7, { districtId: 12, wardCode: "WARD-1" })
    ).resolves.toEqual({ shippingFeeVND: 30_000, shippingFeeUSD: 1.2 });
    expect(shippingIntegration.calculateShippingFee).toHaveBeenCalledWith({
      toDistrictId: 12,
      toWardCode: "WARD-1",
      totalWeightGrams: 1_000,
      totalValueVND: 500_000,
      packageDimensions: { height: 16, length: 20, width: 12 },
    });
  });

  it("uses default package measurements when products omit dimensions", async () => {
    cartModel.findByUserId.mockResolvedValue([
      { product_id: 2, quantity: 1, price: 5 },
    ]);
    convertUSDtoVND.mockImplementation(async (amount) => amount * 25_000);
    shippingIntegration.calculateShippingFee.mockResolvedValue(10_000);

    await getCartShippingFee(7, { districtId: 12, wardCode: "WARD-1" });

    expect(shippingIntegration.calculateShippingFee).toHaveBeenCalledWith(
      expect.objectContaining({
        totalWeightGrams: 500,
        totalValueVND: 125_000,
        packageDimensions: { height: 10, length: 10, width: 10 },
      })
    );
  });
});
