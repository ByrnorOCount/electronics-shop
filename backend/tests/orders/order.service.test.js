import bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/orders/order.model.js", () => ({
  clearUserOtp: vi.fn(),
  createOrderFromCartInTransaction: vi.fn(),
  findOrderByIdWithItems: vi.fn(),
  findUserById: vi.fn(),
}));

vi.mock("../../src/modules/cart/cart.model.js", () => ({
  findByUserId: vi.fn(),
}));

import * as cartModel from "../../src/modules/cart/cart.model.js";
import * as orderModel from "../../src/modules/orders/order.model.js";
import * as orderService from "../../src/modules/orders/order.service.js";

describe("order service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not start online checkout for an empty cart", async () => {
    cartModel.findByUserId.mockResolvedValue([]);

    await expect(
      orderService.createOnlinePaymentSession("stripe", 10, "123 Main St")
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects expired checkout OTPs without creating an order", async () => {
    const otp = "123456";
    const otpHash = await bcrypt.hash(otp, 4);
    orderModel.findUserById.mockResolvedValue({
      otp_hash: otpHash,
      otp_expires: new Date(Date.now() - 60_000),
    });

    await expect(
      orderService.createCodOrder(10, "123 Main St", otp)
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(orderModel.createOrderFromCartInTransaction).not.toHaveBeenCalled();
    expect(orderModel.clearUserOtp).not.toHaveBeenCalled();
  });

  it("creates a COD order and clears the verified OTP", async () => {
    const otp = "123456";
    const otpHash = await bcrypt.hash(otp, 4);
    const createdOrder = { id: 8 };
    const completedOrder = { id: 8, items: [{ product_id: 2, quantity: 1 }] };
    orderModel.findUserById.mockResolvedValue({
      otp_hash: otpHash,
      otp_expires: new Date(Date.now() + 60_000),
    });
    orderModel.createOrderFromCartInTransaction.mockResolvedValue(createdOrder);
    orderModel.findOrderByIdWithItems.mockResolvedValue(completedOrder);

    await expect(
      orderService.createCodOrder(10, "123 Main St", otp)
    ).resolves.toEqual(completedOrder);
    expect(orderModel.createOrderFromCartInTransaction).toHaveBeenCalledWith(
      10,
      "123 Main St",
      "cod"
    );
    expect(orderModel.clearUserOtp).toHaveBeenCalledWith(10);
    expect(orderModel.findOrderByIdWithItems).toHaveBeenCalledWith(8);
  });
});
