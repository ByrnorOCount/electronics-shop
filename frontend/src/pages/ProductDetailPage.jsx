import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';

export default function ProductDetailPage() {
    const { id } = useParams();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Product #{id}</h1>
                <p className="text-gray-600">Product detail coming soon.</p>
            </main>
            <Footer />
        </div>
    );
}
