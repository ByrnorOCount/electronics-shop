import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/admin/admin.model.js", () => ({
  deleteUser: vi.fn(),
  fetchAnalyticsData: vi.fn(),
  findAllUsers: vi.fn(),
  updateUserRole: vi.fn(),
}));
vi.mock("../../src/modules/loyalty/loyalty.service.js", () => ({
  addLoyaltyInfo: vi.fn(async (users) => users),
}));

import * as adminModel from "../../src/modules/admin/admin.model.js";
import * as loyaltyService from "../../src/modules/loyalty/loyalty.service.js";
import {
  deleteUser,
  getAnalyticsData,
  getAllUsers,
  updateUserRole,
} from "../../src/modules/admin/admin.service.js";

describe("admin service account protections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents admins from changing their own role", async () => {
    await expect(updateUserRole("7", "customer", 7)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(adminModel.updateUserRole).not.toHaveBeenCalled();
  });

  it("prevents admins from deleting their own account", async () => {
    await expect(deleteUser("7", 7)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(adminModel.deleteUser).not.toHaveBeenCalled();
  });

  it("reports when a target user no longer exists", async () => {
    adminModel.updateUserRole.mockResolvedValue(undefined);

    await expect(updateUserRole(20, "staff", 7)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(adminModel.updateUserRole).toHaveBeenCalledWith(20, "staff");
  });

  it("adds loyalty status to the admin user list", async () => {
    const users = [{ id: 3, role: "customer" }];
    const usersWithLoyalty = [{ ...users[0], loyalty_tier: "Silver" }];
    adminModel.findAllUsers.mockResolvedValue(users);
    loyaltyService.addLoyaltyInfo.mockResolvedValue(usersWithLoyalty);

    await expect(getAllUsers({})).resolves.toEqual(usersWithLoyalty);
    expect(loyaltyService.addLoyaltyInfo).toHaveBeenCalledWith(users);
  });

  it("includes the full end date in analytics queries", async () => {
    adminModel.fetchAnalyticsData.mockResolvedValue({});

    await getAnalyticsData({
      startDate: "2099-01-01",
      endDate: new Date("2099-01-31T00:00:00.000Z"),
    });

    expect(adminModel.fetchAnalyticsData).toHaveBeenCalledWith({
      startDate: "2099-01-01",
      endDate: "2099-01-31T23:59:59.999Z",
    });
  });
});
