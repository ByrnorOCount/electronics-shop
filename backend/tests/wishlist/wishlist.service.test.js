import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/wishlist/wishlist.model.js", () => ({
  create: vi.fn(),
  findOne: vi.fn(),
  remove: vi.fn(),
}));

import * as wishlistModel from "../../src/modules/wishlist/wishlist.model.js";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "../../src/modules/wishlist/wishlist.service.js";

describe("wishlist service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects adding a product that is already in the user's wishlist", async () => {
    wishlistModel.findOne.mockResolvedValue({ id: 3, product_id: 7 });

    await expect(addItemToWishlist(10, 7)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(wishlistModel.create).not.toHaveBeenCalled();
  });

  it("creates a wishlist entry for the requesting user", async () => {
    const entry = { id: 4, user_id: 10, product_id: 7 };
    wishlistModel.findOne.mockResolvedValue(undefined);
    wishlistModel.create.mockResolvedValue(entry);

    await expect(addItemToWishlist(10, 7)).resolves.toEqual(entry);
    expect(wishlistModel.create).toHaveBeenCalledWith(10, 7);
  });

  it("reports when the user does not have the product in their wishlist", async () => {
    wishlistModel.remove.mockResolvedValue(0);

    await expect(removeItemFromWishlist(10, 7)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(wishlistModel.remove).toHaveBeenCalledWith(10, 7);
  });
});
