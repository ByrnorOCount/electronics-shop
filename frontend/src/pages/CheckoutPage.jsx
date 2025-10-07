import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CheckoutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <p className="text-gray-600">Checkout form will go here.</p>
            </main>
            <Footer />
        </div>
    );
}
