import React from 'react';

export default function OrderConfirmationPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Order Confirmed</h1>
                <p className="text-gray-600">Thank you for your order. Order details will appear here.</p>
            </main>
        </div>
    );
}
