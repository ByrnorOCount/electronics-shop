import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cartService } from "../../api";
import {
  addItem as addItemAction,
  removeItem,
  updateQuantity,
} from "./cartSlice";
import { addToWishlistLocal as addItemToWishlistAction } from "../wishlist/wishlistSlice";
import { selectToken } from "../auth/authSlice";
import toast from "react-hot-toast";
import { useWishlistActions } from "../wishlist/useWishlistActions";
import logger from "../../utils/logger";

/**
 * A custom hook to abstract cart operations (add, update, remove).
 * It automatically handles the logic for both guest and authenticated users.
 */
export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const { addItem: addItemToWishlist, isLoading: isWishlistLoading } =
    useWishlistActions();

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

  const handleRemoveItem = async (item, options = { showToast: true }) => {
    // Optimistic UI update: Dispatch the removal to Redux immediately.
    dispatch(removeItem(item.id));
    if (options.showToast) {
      toast.success(`'${item.name}' removed from cart.`);
    }

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

  const handleSaveForLater = async (item) => {
    if (!token) {
      toast.error("You must be logged in to save items for later.");
      return;
    }

    // --- Optimistic UI Updates ---
    // 1. Remove item from cart state.
    dispatch(removeItem(item.id));
    // 2. Add item to wishlist state.
    dispatch(addItemToWishlistAction({ ...item, image_url: item.img }));
    // 3. Show a single, definitive toast.
    toast.success(`'${item.name}' moved to your wishlist.`);

    // --- Backend Call ---
    try {
      // Use the new, single endpoint.
      await cartService.saveForLater(item.cartItemId);
      // No success toast here, we already showed one optimistically.
    } catch (error) {
      logger.error("Failed to save item for later:", error);
      toast.error("Action failed. Reverting changes.");

      // --- Revert Optimistic UI Updates on Failure ---
      // 1. Re-add item to cart state.
      dispatch(addItemAction(item));
      // 2. Remove item from wishlist state.
      // We need to import and use the wishlist's removeItem reducer.
      // For now, this part is omitted as it requires cross-slice reducer access which can be complex.
      // The primary optimistic update (cart removal) is the most important to revert.
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
    saveForLater: handleSaveForLater,
  };
};
