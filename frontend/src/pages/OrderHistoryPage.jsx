import React from 'react';

export default function OrderHistoryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Order History</h1>
                <p className="text-gray-600">Your past orders will appear here.</p>
            </main>
        </div>
    );
}
