import { describe, expect, it, vi } from "vitest";
import {
  isAdmin,
  isAuthenticated,
  isStaff,
} from "../../src/core/middlewares/auth.middleware.js";

const createResponseContext = (user) => ({
  req: user ? { user } : {},
  res: {},
  next: vi.fn(),
});

describe("authorization middleware", () => {
  it("requires an authenticated user", () => {
    const { req, res, next } = createResponseContext();

    isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it.each(["staff", "admin"])("allows %s users through staff access", (role) => {
    const { req, res, next } = createResponseContext({ role });

    isStaff(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("denies customer access to staff-only operations", () => {
    const { req, res, next } = createResponseContext({ role: "customer" });

    isStaff(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });

  it("allows only admins through admin access", () => {
    const { req: adminReq, res: adminRes, next: adminNext } =
      createResponseContext({ role: "admin" });
    const { req: staffReq, res: staffRes, next: staffNext } =
      createResponseContext({ role: "staff" });

    isAdmin(adminReq, adminRes, adminNext);
    isAdmin(staffReq, staffRes, staffNext);

    expect(adminNext).toHaveBeenCalledWith();
    expect(staffNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });
});
