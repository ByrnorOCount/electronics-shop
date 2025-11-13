import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeItem, updateQuantity, clearCart, setCart } from './cartSlice';
import cartService from './cartService';
import QuantityInput from '../../components/ui/QuantityInput';
import OrderSummary from './components/OrderSummary';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, status: cartStatus } = useAppSelector((state) => state.cart); // Get cart items and status
  const { token } = useAppSelector((state) => state.auth);

  const handleQuantityChange = async (item, newQuantity) => {
    if (token && item.cartItemId) {
      try {
        // Wait for the backend to confirm, then update Redux state.
        await cartService.updateCartItemQuantity(item.cartItemId, newQuantity);
        dispatch(updateQuantity({ id: item.id, qty: newQuantity }));
        toast.success('Quantity updated.');
      } catch (err) {
        console.error("Failed to update quantity:", err);
        toast.error('Failed to update quantity.');
      }
    } else {
      // For guests, just update Redux state.
      dispatch(updateQuantity({ id: item.id, qty: newQuantity }));
    }
  };

  const handleRemoveItem = async (item) => {
    dispatch(removeItem(item.id));
    toast.success(`'${item.name}' removed from cart.`);
    if (token && item.cartItemId) {
      await cartService.removeCartItem(item.cartItemId);
    }
  };

  // Show a loading indicator if the initial sync is happening or if we are fetching.
  if (cartStatus === 'syncing' && token) return <p className="text-center py-12">Loading your cart...</p>;
  // Show error state only for logged-in users.
  if (cartStatus === 'failed' && token) return <p className="text-center py-12 text-red-500">Could not load your cart.</p>;

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
            <OrderSummary />
          </div>
        </div>
      )}
    </main>
  );
}
