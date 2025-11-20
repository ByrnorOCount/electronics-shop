import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cartService } from "../../api";
import {
  addItem as addItemAction,
  removeItem,
  updateQuantity,
} from "./cartSlice";
import { selectToken } from "../auth/authSlice";
import toast from "react-hot-toast";
import logger from "../../utils/logger";

/**
 * A custom hook to abstract cart operations (add, update, remove).
 * It automatically handles the logic for both guest and authenticated users.
 */
export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  const handleUpdateQuantity = async (item, newQuantity) => {
    // If the new quantity is the same as the current quantity, do nothing.
    // This prevents unnecessary updates and toasts when the quantity doesn't actually change.
    if (newQuantity === item.qty) {
      return;
    }
    // If newQuantity is less than 1, the item should be removed, not updated to 0.
    // The "Remove" button should be used for this.
    if (newQuantity < 1) {
      return;
    }
    if (item.stock !== undefined && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items in stock.`);
      return;
    }

    // Optimistic UI update: Dispatch the change to Redux immediately.
    dispatch(updateQuantity({ id: item.id, qty: newQuantity }));
    toast.success("Quantity updated.");

    // If logged in, sync the change with the backend.
    if (token) {
      try {
        await cartService.updateCartItemQuantity(item.cartItemId, newQuantity);
      } catch (error) {
        logger.error("Failed to update cart on server:", error);
        toast.error("Failed to sync cart update.");
        // Optional: Revert the change in Redux on failure
        dispatch(updateQuantity({ id: item.id, qty: item.qty }));
      }
    }
  };

  const handleRemoveItem = async (item) => {
    // Optimistic UI update: Dispatch the removal to Redux immediately.
    dispatch(removeItem(item.id));
    toast.success(`'${item.name}' removed from cart.`);

    // If logged in, sync the change with the backend.
    if (token) {
      try {
        await cartService.removeCartItem(item.cartItemId);
      } catch (error) {
        logger.error("Failed to remove item on server:", error);
        toast.error("Failed to sync item removal.");
        // Optional: Revert the change by re-adding the item to Redux.
      }
    }
  };

  const handleAddItem = async (product) => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      qty: 1,
      img: product.image_url,
      stock: product.stock,
    };

    // Optimistic UI update for both guests and logged-in users.
    dispatch(addItemAction(itemToAdd));
    toast.success(`'${product.name}' added to cart!`);

    // If logged in, sync with the backend.
    if (token) {
      try {
        // The backend returns the created/updated cart item, including its unique ID.
        const backendItem = await cartService.addItemToCart(product.id, 1);
        // Dispatch again with the backend's cartItemId to keep Redux state in sync.
        // The reducer will find the existing item and just add the cartItemId.
        dispatch(addItemAction({ ...itemToAdd, cartItemId: backendItem.id }));
      } catch (error) {
        logger.error("Failed to add item to backend cart:", error);
        toast.error("Failed to add item to cart.");
        // Revert the change on failure.
        dispatch(removeItem(product.id));
      }
    }
  };

  return {
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    addItem: handleAddItem,
  };
};
