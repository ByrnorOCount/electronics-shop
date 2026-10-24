import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/staff/staff.model.js", () => ({
  findAllOrders: vi.fn(),
  findOrderById: vi.fn(),
  findOrderItems: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("../../src/modules/notifications/notification.service.js", () => ({
  createNotification: vi.fn(),
}));

vi.mock("../../src/modules/products/product.model.js", () => ({
  findById: vi.fn(),
}));

vi.mock("../../src/modules/wishlist/wishlist.model.js", () => ({
  findUsersByProductId: vi.fn(),
}));

import * as notificationService from "../../src/modules/notifications/notification.service.js";
import * as staffModel from "../../src/modules/staff/staff.model.js";
import { updateOrderStatus } from "../../src/modules/staff/staff.service.js";

describe("staff service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("notifies the customer after updating an order status", async () => {
    staffModel.updateOrderStatus.mockResolvedValue({
      id: 15,
      user_id: 7,
      status: "Shipped",
    });
    staffModel.findOrderById.mockResolvedValue({
      id: 15,
      user_id: 7,
      status: "Shipped",
    });
    staffModel.findOrderItems.mockResolvedValue([{ product_id: 3 }]);

    const result = await updateOrderStatus(15, "Shipped");

    expect(result).toMatchObject({
      id: 15,
      user_id: 7,
      status: "Shipped",
      items: [{ product_id: 3 }],
    });
    expect(notificationService.createNotification).toHaveBeenCalledWith(
      7,
      'Your order #15 has been updated to "Shipped".',
      "/orders/15"
    );
  });

  it("reports when the target order does not exist", async () => {
    staffModel.updateOrderStatus.mockResolvedValue(undefined);

    await expect(updateOrderStatus(999, "Shipped")).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(notificationService.createNotification).not.toHaveBeenCalled();
  });
});
