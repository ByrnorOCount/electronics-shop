import bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/auth/auth.model.js", () => ({
  create: vi.fn(),
  findByEmail: vi.fn(),
}));

import * as authModel from "../../src/modules/auth/auth.model.js";
import { login, register } from "../../src/modules/auth/auth.service.js";

describe("authentication service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a customer with a hashed password", async () => {
    const userData = {
      first_name: "Test",
      last_name: "Customer",
      email: "new-customer@example.test",
      password: "StrongPassword123!",
    };
    authModel.findByEmail.mockResolvedValue(undefined);
    authModel.create.mockImplementation(async (user) => ({
      id: 15,
      ...user,
    }));

    const user = await register(userData);
    const [createdUser] = authModel.create.mock.calls[0];

    expect(createdUser.role).toBe("customer");
    expect(createdUser.password_hash).not.toBe(userData.password);
    await expect(
      bcrypt.compare(userData.password, createdUser.password_hash)
    ).resolves.toBe(true);
    expect(user.password).toBeUndefined();
  });

  it("rejects registration when the email is already used", async () => {
    authModel.findByEmail.mockResolvedValue({ id: 2 });

    await expect(
      register({
        first_name: "Existing",
        last_name: "Customer",
        email: "existing@example.test",
        password: "StrongPassword123!",
      })
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(authModel.create).not.toHaveBeenCalled();
  });

  it("returns a token and omits the password hash after login", async () => {
    const passwordHash = await bcrypt.hash("StrongPassword123!", 4);
    authModel.findByEmail.mockResolvedValue({
      id: 8,
      email: "customer@example.test",
      role: "customer",
      password_hash: passwordHash,
    });

    const result = await login("customer@example.test", "StrongPassword123!");

    expect(result.token).toEqual(expect.any(String));
    expect(result.user).toMatchObject({
      id: 8,
      email: "customer@example.test",
      role: "customer",
    });
    expect(result.user.password_hash).toBeUndefined();
  });

  it.each([
    ["unknown email", undefined, "StrongPassword123!"],
    ["social-only account", { id: 9, password_hash: null }, "StrongPassword123!"],
  ])("rejects login for an %s", async (_description, user, password) => {
    authModel.findByEmail.mockResolvedValue(user);

    await expect(login("customer@example.test", password)).rejects.toMatchObject(
      { statusCode: 401 }
    );
  });

  it("rejects an incorrect password", async () => {
    authModel.findByEmail.mockResolvedValue({
      id: 8,
      password_hash: await bcrypt.hash("CorrectPassword123!", 4),
    });

    await expect(
      login("customer@example.test", "WrongPassword123!")
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
