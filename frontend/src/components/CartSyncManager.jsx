import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCart, clearCart } from '../features/cart/cartSlice';
import cartService from '../services/cartService';

/**
 * A headless component that manages the synchronization of the local (guest)
 * cart with the backend when a user logs in.
 */
const CartSyncManager = () => {
  const dispatch = useAppDispatch();
  const { items: localCartItems } = useAppSelector((state) => state.cart);
  const { token } = useAppSelector((state) => state.auth);
  const hasSynced = useRef(false);

  useEffect(() => {
    // This effect should only run when a user logs in and has items in their local cart.
    if (!token || localCartItems.length === 0 || hasSynced.current) {
      return;
    }

    const syncAndFetchCart = async () => {
      // Mark as synced immediately to prevent re-runs if the component re-renders.
      hasSynced.current = true;

      try {
        // 1. Prepare local cart items for the sync endpoint.
        const itemsToSync = localCartItems.map(item => ({
          productId: item.id,
          quantity: item.qty,
        }));

        // 2. Send the local cart to the backend to be merged.
        // The backend will now return the fully merged cart.
        const mergedCart = await cartService.syncCart(itemsToSync);

        // 3. Clear the old local cart and set the new, authoritative cart from the backend.
        dispatch(clearCart());
        dispatch(setCart(mergedCart));

      } catch (error) {
        console.error("Failed to sync cart:", error);
        // If sync fails, we reset the flag to allow another attempt later.
        hasSynced.current = false;
      }
    };

    syncAndFetchCart();

  }, [token, localCartItems, dispatch]);

  return null; // This component does not render anything.
};

export default CartSyncManager;
