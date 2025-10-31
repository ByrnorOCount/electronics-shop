import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch, useAppStore } from '../store/hooks';
import { setCart, clearCart, setCartSyncStatus } from '../features/cart/cartSlice';
import cartService from '../services/cartService';

/**
 * A headless component that manages the synchronization of the local (guest)
 * cart with the backend when a user logs in.
 */
const CartSyncManager = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore(); // Get a stable reference to the store
  const { items: localCartItems } = useAppSelector((state) => state.cart);
  const { token } = useAppSelector((state) => state.auth);
  const hasSynced = useRef(false);

  useEffect(() => {
    // This effect resets the sync status when the user logs out.
    if (!token) {
      hasSynced.current = false;
    }
  }, [token]);

  useEffect(() => {
    // This effect should ONLY run once when a user with a guest cart logs in.
    // It should not re-run if the cart state changes for any other reason.
    const state = store.getState();
    const guestCartItems = state.cart.items;
    if (!token || hasSynced.current || guestCartItems.length === 0) {
      return;
    }

    const syncAndFetchCart = async () => {
      // Mark as synced immediately to prevent re-runs if the component re-renders.
      hasSynced.current = true;
      dispatch(setCartSyncStatus('syncing'));

      try {
        // 1. Prepare local cart items for the sync endpoint.
        // We use the state directly from the store at the moment of firing,
        // avoiding a dependency on the selector that causes re-runs.
        const itemsToSync = guestCartItems.map(item => ({
          productId: item.id,
          quantity: item.qty,
          modifiedAt: item.modifiedAt, // <-- Send the timestamp
        }));

        // 2. Send the local cart to the backend to be merged.
        // The backend will now return the fully merged cart.
        const mergedCart = await cartService.syncCart(itemsToSync);

        // 3. Clear the old local cart and set the new, authoritative cart from the backend.
        dispatch(clearCart());
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

    // By removing `localCartItems` from the dependency array and using the store
    // to get the items, we ensure this effect only runs when the `token` appears,
    // not every time the cart is updated.
  }, [token, dispatch, store]);

  return null; // This component does not render anything.
};

export default CartSyncManager;
