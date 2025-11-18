import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { wishlistService } from "../../api";
import { addToWishlistLocal, removeFromWishlistLocal } from "./wishlistSlice";
import toast from "react-hot-toast";
import logger from "../../utils/logger";

/**
 * A custom hook to manage wishlist-related actions.
 * It encapsulates the logic for adding and removing items from the wishlist,
 * while managing its own loading and error states.
 *
 * @returns {{
 *  addItem: (product: object) => Promise<void>;
 *  removeItem: (productId: number) => Promise<void>;
 *  isLoading: (productId: number) => boolean;
 * }}
 */
export const useWishlistActions = () => {
  const dispatch = useAppDispatch();
  const [loadingItems, setLoadingItems] = useState([]);

  const addItem = async (product) => {
    setLoadingItems((prev) => [...prev, product.id]);
    try {
      await wishlistService.addToWishlist(product.id);
      dispatch(addToWishlistLocal(product));
      toast.success(`${product.name} added to wishlist!`);
    } catch (err) {
      logger.error("Failed to add to wishlist", err);
      toast.error(err.response?.data?.message || "Could not add to wishlist.");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== product.id));
    }
  };

  const removeItem = async (productId) => {
    setLoadingItems((prev) => [...prev, productId]);
    try {
      await wishlistService.removeFromWishlist(productId);
      dispatch(removeFromWishlistLocal(productId));
      toast.success("Item removed from wishlist.");
    } catch (err) {
      logger.error("Failed to remove from wishlist", err);
      toast.error(err.response?.data?.message || "Could not remove item.");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== productId));
    }
  };

  const isLoading = (productId) => loadingItems.includes(productId);

  return {
    addItem,
    removeItem,
    isLoading,
  };
};
