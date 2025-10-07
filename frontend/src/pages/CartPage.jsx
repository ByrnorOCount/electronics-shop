import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeItem, updateQuantity, clearCart } from '../features/cart/cartSlice';

export default function CartPage() {
    const items = useAppSelector((s) => s.cart.items || []);
    const dispatch = useAppDispatch();

    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
                {items.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="grid gap-6">
                        {items.map((it) => (
                            <div key={it.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                                <img src={it.img} className="w-24 h-24 object-cover rounded" alt={it.name} />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{it.name}</h3>
                                    <p className="text-sm text-gray-600">฿{it.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="number" min="1" value={it.qty} onChange={(e) => dispatch(updateQuantity({ id: it.id, qty: Number(e.target.value) }))} className="w-16 p-1 border rounded" />
                                    <button onClick={() => dispatch(removeItem(it.id))} className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end items-center gap-4">
                            <div className="text-lg font-semibold">Total: ฿{total.toFixed(2)}</div>
                            <button onClick={() => dispatch(clearCart())} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
