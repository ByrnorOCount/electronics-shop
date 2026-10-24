import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/cart/cart.model.js", () => ({
  create: vi.fn(),
  findById: vi.fn(),
  findOne: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../../src/modules/products/product.model.js", () => ({
  findById: vi.fn(),
}));

import * as cartModel from "../../src/modules/cart/cart.model.js";
import * as productModel from "../../src/modules/products/product.model.js";
import {
  addItemToCart,
  removeCartItem,
  updateCartItem,
} from "../../src/modules/cart/cart.service.js";

describe("cart service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects adding more than available stock", async () => {
    productModel.findById.mockResolvedValue({
      id: 2,
      name: "Laptop",
      stock: 3,
    });
    cartModel.findOne.mockResolvedValue({ id: 5, quantity: 2 });

    await expect(addItemToCart(10, 2, 2)).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(cartModel.update).not.toHaveBeenCalled();
    expect(cartModel.create).not.toHaveBeenCalled();
  });

  it("updates a cart item only for its owner", async () => {
    cartModel.findById.mockResolvedValue({
      id: 5,
      product_id: 2,
      quantity: 1,
    });
    productModel.findById.mockResolvedValue({
      id: 2,
      name: "Laptop",
      stock: 5,
    });
    cartModel.update.mockResolvedValue([]);

    await expect(updateCartItem(99, 5, 2)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(cartModel.update).toHaveBeenCalledWith(5, 2, 99);
  });

  it("rejects removing a cart item owned by someone else", async () => {
    cartModel.remove.mockResolvedValue(0);

    await expect(removeCartItem(99, 5)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(cartModel.remove).toHaveBeenCalledWith(5, 99);
  });

  it("rejects adding items when the product is out of stock", async () => {
    productModel.findById.mockResolvedValue({
      id: 2,
      name: "Laptop",
      stock: 0,
    });
    cartModel.findOne.mockResolvedValue(undefined);

    await expect(addItemToCart(10, 2, 1)).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(cartModel.create).not.toHaveBeenCalled();
  });
});
