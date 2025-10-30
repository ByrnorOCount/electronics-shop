import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeItem, updateQuantity, clearCart, setCart } from '../features/cart/cartSlice';
import { useApi } from '../hooks/useApi';
import cartService from '../services/cartService';
import QuantityInput from '../components/QuantityInput';
import CartSummary from '../components/CartSummary';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart); // Local cart state
  const { token } = useAppSelector((state) => state.auth); // Auth state
  const { loading, error, request: fetchCart } = useApi(cartService.getCartItems);
  const isSyncing = useRef(false); // Ref to prevent multiple sync operations

  useEffect(() => {
    // This effect handles fetching and synchronizing the cart.
    if (!token || isSyncing.current) {
      return; // Do nothing if logged out or a sync is already in progress.
    }

    const syncAndFetchCart = async () => {
      isSyncing.current = true;
      try {
        // If there are items in the local/guest cart, sync them with the backend first.
        if (items.length > 0) {
          const localItemsToSync = items.map(item => ({ productId: item.id, quantity: item.qty }));
          await cartService.syncCart(localItemsToSync);
          // Clear the local cart immediately after starting the sync to prevent duplicates.
          // The backend is now the source of truth.
          dispatch(clearCart());
        }

        // Now, fetch the authoritative cart from the backend.
        const backendCartItems = await fetchCart();
        const adaptedItems = backendCartItems.map(item => ({
          id: item.product_id,
          cartItemId: item.id, // This is the actual ID of the row in cart_items table
          name: item.name,
          price: item.price,
          qty: item.quantity,
          img: item.image_url,
        }));
        dispatch(setCart(adaptedItems));
      } catch (syncError) {
        console.error("Failed to sync or fetch cart:", syncError);
        // The useApi hook will set the 'error' state if fetchCart fails.
      } finally {
        isSyncing.current = false;
      }
    };

    syncAndFetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // This effect should run only when the user's login status changes.

  const handleQuantityChange = async (item, newQuantity) => {
    dispatch(updateQuantity({ id: item.id, qty: newQuantity }));
    if (token && item.cartItemId) {
      await cartService.updateCartItemQuantity(item.cartItemId, newQuantity);
    }
  };

  const handleRemoveItem = async (item) => {
    dispatch(removeItem(item.id));
    if (token && item.cartItemId) {
      await cartService.removeCartItem(item.cartItemId);
    }
  };

  // Show loading state only for logged-in users.
  if (loading && token) return <p className="text-center py-12">Loading your cart...</p>;
  // Show error state only for logged-in users.
  if (error && token) return <p className="text-center py-12 text-red-500">Could not load your cart.</p>;

  return (
    <main className="flex-grow max-w-screen-xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link to="/products" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <img src={`${it.img}`} className="w-24 h-24 object-cover rounded" alt={it.name} />
                <div className="flex-1">
                  <h3 className="font-semibold">{it.name}</h3>
                  <p className="text-sm text-gray-600">${Number(it.price).toFixed(2)}</p>
                  <button onClick={() => handleRemoveItem(it)} className="text-xs text-red-600 hover:underline mt-1">Remove</button>
                </div>
                <QuantityInput value={it.qty} onChange={(newQty) => handleQuantityChange(it, newQty)} />
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </main>
  );
}
