import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../features/auth/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login: set user and fake token
        dispatch(setCredentials({ user: { email }, token: 'fake-jwt-token' }));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-md mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-4">Sign in</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-sm">
                    <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="w-full">Sign in</Button>
                    <div className="text-sm text-center text-gray-600">
                        dont have an accout? <Link to="/register" className="text-blue-600">register</Link>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
