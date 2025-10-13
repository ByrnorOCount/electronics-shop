import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Admin</h2>
                    <nav className="flex gap-4">
                        <Link to="/admin" className="text-sm text-blue-600">Dashboard</Link>
                        <Link to="/admin/products" className="text-sm">Products</Link>
                        <Link to="/admin/orders" className="text-sm">Orders</Link>
                        <Link to="/admin/users" className="text-sm">Users</Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
