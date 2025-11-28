import * as cartService from "./cart.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Get all items in the user's cart.
 * @route GET /api/cart
 * @access Private
 */
export const getCart = async (req, res, next) => {
  try {
    const cartItems = await cartService.getCartByUserId(req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, cartItems));
  } catch (error) {
    next(error);
  }
};

/**
 * Add an item to the cart. If it exists, update quantity.
 * @route POST /api/cart
 * @access Private
 */
export const addItemToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const { item, wasCreated } = await cartService.addItemToCart(
      userId,
      productId,
      quantity
    );

    const statusCode = wasCreated ? httpStatus.CREATED : httpStatus.OK;
    const message = wasCreated
      ? "Item added to cart."
      : "Item quantity updated in cart.";

    res.status(statusCode).json(new ApiResponse(statusCode, item, message));
  } catch (error) {
    next(error);
  }
};

/**
 * Synchronizes a local (guest) cart with the user's database cart.
 * @route POST /api/cart/sync
 * @access Private
 */
export const syncCart = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const updatedCart = await cartService.syncUserCart(userId, req.body);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedCart,
          "Cart synchronized successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a specific cart item's quantity.
 * @route PUT /api/cart/items/:itemId
 * @access Private
 */
export const updateCartItem = async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    const updatedItem = await cartService.updateCartItem(
      userId,
      itemId,
      quantity
    );
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, updatedItem, "Cart item updated."));
  } catch (error) {
    next(error);
  }
};

/**
 * Remove an item from the cart.
 * @route DELETE /api/cart/items/:itemId
 * @access Private
 */
export const removeCartItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    await cartService.removeCartItem(userId, itemId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Move an item from the cart to the wishlist.
 * @route POST /api/cart/save-for-later/:itemId
 * @access Private
 */
export const saveForLater = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const result = await cartService.saveItemForLater(userId, Number(itemId));
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, result, result.message));
  } catch (error) {
    next(error);
  }
};
