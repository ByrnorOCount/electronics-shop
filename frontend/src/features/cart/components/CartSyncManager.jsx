import { useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { store } from "../../../store";
import { setCart, setCartSyncStatus } from "../cartSlice";
import { cartService } from "../../../api";
import logger from "../../../utils/logger";

/**
 * A headless component that manages the synchronization of the local (guest)
 * cart with the backend when a user logs in.
 */
const CartSyncManager = () => {
  const dispatch = useAppDispatch();
  // Use a selector that only returns the length to prevent re-renders on item changes.
  const localCartItemCount = useAppSelector((state) => state.cart.items.length);
  const { token } = useAppSelector((state) => state.auth);
  const hasSynced = useRef(false);

  // Memoize the sync function to ensure it has a stable identity.
  const syncAndFetchCart = useCallback(async () => {
    // Mark as synced immediately to prevent re-runs.
    hasSynced.current = true;
    dispatch(setCartSyncStatus("syncing"));

    try {
      let mergedCart;
      // We need to get the latest cart items from the store *inside* the async function,
      // not from the component's render scope, to avoid stale data.
      const { items: currentLocalCart } = store.getState().cart;

      if (currentLocalCart.length > 0) {
        // 1. If there's a guest cart, sync it.
        const itemsToSync = currentLocalCart.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        }));
        mergedCart = await cartService.syncCart(itemsToSync);
      } else {
        // 2. If there's no guest cart, just fetch the user's existing cart.
        mergedCart = await cartService.getCartItems();
      }

      // 3. Set the new, authoritative cart from the backend.
      const normalizedMergedCart = mergedCart.map((item) => ({
        id: item.product_id,
        cartItemId: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        img: item.image_url,
      }));
      dispatch(setCart(normalizedMergedCart));
      dispatch(setCartSyncStatus("synced")); // Use a final 'synced' status
    } catch (error) {
      logger.error("Failed to sync cart:", error);
      dispatch(setCartSyncStatus("failed"));
      // If sync fails, we reset the flag to allow another attempt.
      hasSynced.current = false;
    }
  }, [dispatch]); // Removed localCartItems from dependencies

  useEffect(() => {
    if (!token) {
      // If user logs out, reset the sync flag for the next login.
      hasSynced.current = false;
      return;
    }

    // Only run the sync process if we have a token and haven't synced yet.
    if (token && !hasSynced.current) {
      syncAndFetchCart();
    }
    // The dependency array is now much safer. This effect will only re-evaluate
    // when the user logs in/out (token changes) or if the sync function itself changes (which it won't).
    // It will NOT re-run every time an item is added to the local cart.
  }, [token, syncAndFetchCart]);

  return null; // This component does not render anything.
};

export default CartSyncManager;
