import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturedGrid from '../components/FeaturedGrid';

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <p className="text-gray-600 mb-8">Browse our catalog.</p>
                <FeaturedGrid />
            </main>
            <Footer />
        </div>
    );
}
