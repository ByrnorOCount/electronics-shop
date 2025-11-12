import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCart, setCartSyncStatus } from '../features/cart/cartSlice';
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
    // Reset sync status on logout, allowing the next login to trigger a sync.
    if (!token) {
      hasSynced.current = false;
      return; // Exit early if logged out
    }

    // This effect should ONLY run once when a user logs in.
    // It should not re-run if the cart state changes for other reasons.

    // Do nothing if there's no token or if we've already synced/fetched.
    if (hasSynced.current) {
      return;
    }

    const syncAndFetchCart = async () => {
      // Mark as synced immediately to prevent re-runs.
      hasSynced.current = true;
      dispatch(setCartSyncStatus('syncing'));

      try {
        let mergedCart;

        if (localCartItems.length > 0) {
          // 1. If there's a guest cart (from browsing before login), sync it.
          // The backend is responsible for merging the guest cart with any existing cart.
          const itemsToSync = localCartItems.map(item => ({
            productId: item.id,
            quantity: item.qty,
            modifiedAt: item.modifiedAt,
          }));
          mergedCart = await cartService.syncCart(itemsToSync);
        } else {
          // 2. If there's no guest cart, it means the user was already logged in
          // when the app loaded, so we just fetch their existing cart from the DB.
          mergedCart = await cartService.getCartItems();
        }

        // 3. Set the new, authoritative cart from the backend.
        const normalizedMergedCart = mergedCart.map(item => ({
          id: item.product_id,
          cartItemId: item.id,
          name: item.name,
          price: item.price,
          qty: item.quantity,
          img: item.image_url,
        }));
        dispatch(setCart(normalizedMergedCart));

      } catch (error) {
        console.error("Failed to sync cart:", error);
        dispatch(setCartSyncStatus('failed'));
        // If sync fails, we reset the flag to allow another attempt later.
        hasSynced.current = false;
      }
    };

    syncAndFetchCart();

  }, [token, dispatch, localCartItems]);

  return null; // This component does not render anything.
};

export default CartSyncManager;
