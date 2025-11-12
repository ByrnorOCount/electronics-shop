// frontend/src/pages/GoogleAuthCallback.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

// This page is an "intermediary" page.
// It captures the "token" and "user" from the URL sent by the backend,
// then saves them to Redux and redirects the user.

const GoogleAuthCallback = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // useSearchParams is a hook to read query params from the URL
    const [searchParams] = useSearchParams();
    // Use a ref to prevent the effect from running twice in React.StrictMode
    const effectRan = useRef(false);

    useEffect(() => {
        // In StrictMode, this effect will run twice. This ref ensures our logic only executes once.
        if (effectRan.current === true) {
            return;
        }

        // Get 'token' and 'user' from the URL
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        if (token && userParam) {
            try {
                // Decode user data (because it was encoded to be sent via URL)
                const user = JSON.parse(decodeURIComponent(userParam));

                // Save to redux and local store
                dispatch(setCredentials({ token, user }));

                // Show a welcome message and redirect
                toast.success(`Welcome back, ${user.first_name}!`);
                navigate('/profile'); // Redirect to the profile page

            } catch (error) {
                console.error("Error decoding user data from URL:", error);
                toast.error('Google login failed. Please try again.');
                navigate('/login');
            }
        } else {
            // If there's no token, the login failed
            toast.error('Google login failed. Please try again.');
            navigate('/login');
        }

        // Mark the effect as having run
        return () => {
            effectRan.current = true;
        };
    }, [dispatch, navigate, searchParams]); // Dependencies remain the same

    // Display a loading message while processing
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Authenticating, please wait...</p>
        </div>
    );
};

export default GoogleAuthCallback;