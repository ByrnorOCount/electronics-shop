import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeItem, updateQuantity, clearCart, setCart } from '../features/cart/cartSlice';
import { useApi } from '../hooks/useApi';
import cartService from '../services/cartService';
import QuantityInput from '../components/QuantityInput';
import CartSummary from '../components/OrderSummary';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, status: cartStatus } = useAppSelector((state) => state.cart); // Get cart items and status
  const { token } = useAppSelector((state) => state.auth); // Auth state
  const { loading, error, request: fetchCartItems } = useApi(cartService.getCartItems); // This is for subsequent fetches, not the initial one.

  useEffect(() => {
    // This effect should only run to get the initial cart state if the user is already logged in
    // when they land on the page. The CartSyncManager handles the sync-on-login case.
    // We check for 'idle' status to ensure we only fetch if no sync/fetch has happened yet.
    const canFetch = token && cartStatus === 'idle';

    if (canFetch) {
      const getCart = async () => {
        try {
          const backendCartItems = await fetchCartItems();
          const adaptedItems = backendCartItems.map(item => ({
            id: item.product_id,
            cartItemId: item.id,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            img: item.image_url,
          }));
          dispatch(setCart(adaptedItems));
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      };
      getCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, cartStatus, dispatch]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (token && item.cartItemId) {
      try {
        // Wait for the backend to confirm, then update Redux state.
        await cartService.updateCartItemQuantity(item.cartItemId, newQuantity);
        dispatch(updateQuantity({ id: item.id, qty: newQuantity }));
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
    } else {
      // For guests, just update Redux state.
      dispatch(updateQuantity({ id: item.id, qty: newQuantity }));
    }
  };

  const handleRemoveItem = async (item) => {
    dispatch(removeItem(item.id));
    if (token && item.cartItemId) {
      await cartService.removeCartItem(item.cartItemId);
    }
  };

  // Show a loading indicator if the initial sync is happening or if we are fetching.
  if ((loading || cartStatus === 'syncing') && token) return <p className="text-center py-12">Loading your cart...</p>;
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
                  {it.stock !== undefined && <p className="text-xs text-gray-500 mt-1">In Stock: {it.stock}</p>}
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
