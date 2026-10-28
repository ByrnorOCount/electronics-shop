import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/admin/admin.model.js", () => ({
  deleteUser: vi.fn(),
  fetchAnalyticsData: vi.fn(),
  updateUserRole: vi.fn(),
}));

import * as adminModel from "../../src/modules/admin/admin.model.js";
import {
  deleteUser,
  getAnalyticsData,
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
