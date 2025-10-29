import React from 'react';
import CartSummary from '../components/CartSummary';

export default function CheckoutPage() {
    return (
        <main className="flex-grow max-w-screen-xl mx-auto px-4 py-12 w-full">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    {/* A placeholder for the form */}
                    <form>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                            <textarea id="address" name="address" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="123 Main St, Anytown, USA"></textarea>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-1">
                    <CartSummary />
                </div>
            </div>
        </main>
    );
}
