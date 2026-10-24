import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/admin/admin.model.js", () => ({
  deleteUser: vi.fn(),
  updateUserRole: vi.fn(),
}));

import * as adminModel from "../../src/modules/admin/admin.model.js";
import {
  deleteUser,
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
});
