import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement registration flow or mock
        alert('Register (mock) - implement API call');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-md mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-sm">
                    <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="w-full">Register</Button>
                    <div className="text-sm text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
