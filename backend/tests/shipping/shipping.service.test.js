import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/cart/cart.model.js", () => ({
  findByUserId: vi.fn(),
}));

vi.mock("../../src/core/utils/currency.js", () => ({
  convertUSDtoVND: vi.fn(),
}));

import * as cartModel from "../../src/modules/cart/cart.model.js";
import { convertUSDtoVND } from "../../src/core/utils/currency.js";
import { getCartShippingFee } from "../../src/modules/shipping/shipping.service.js";

describe("shipping service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an empty cart without calling shipping providers", async () => {
    cartModel.findByUserId.mockResolvedValue([]);

    await expect(
      getCartShippingFee(7, "local")
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(convertUSDtoVND).not.toHaveBeenCalled();
  });

  it("calculates a local quote using chargeable weight and delivery zone", async () => {
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

    await expect(
      getCartShippingFee(7, "nearby")
    ).resolves.toMatchObject({
      zone: "nearby",
      zoneName: "Nearby province",
      shippingFeeVND: 28_000,
      shippingFeeUSD: 1.12,
      estimatedDelivery: "2–3 business days",
      chargeableWeightKg: 1,
    });
  });

  it("uses realistic default parcel measurements when product data is absent", async () => {
    cartModel.findByUserId.mockResolvedValue([
      { product_id: 2, quantity: 1, price: 5 },
    ]);
    convertUSDtoVND.mockImplementation(async (amount) => amount * 25_000);

    await expect(getCartShippingFee(7, "local")).resolves.toMatchObject({
      shippingFeeVND: 20_000,
      chargeableWeightKg: 0.6,
    });
  });

  it("uses volumetric chargeable weight and rounds surcharges by 500 grams", async () => {
    cartModel.findByUserId.mockResolvedValue([
      { product_id: 3, quantity: 3, price: 5 },
    ]);
    convertUSDtoVND.mockImplementation(async (amount) => amount * 25_000);

    await expect(getCartShippingFee(7, "local")).resolves.toMatchObject({
      shippingFeeVND: 32_000,
      shippingFeeUSD: 1.28,
      chargeableWeightKg: 1.8,
    });
  });
});
