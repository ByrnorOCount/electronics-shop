import dotenv from "dotenv";
// It's crucial to call dotenv.config() at the very top
// so that environment variables are available in all imported modules.
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import httpStatus from "http-status";

import apiRouter from './routes.js';
import { errorHandler, notFound } from './core/middlewares/error.middleware.js';
import ApiError from './core/utils/ApiError.js';
import './config/passport.js';

const app = express();

// Middleware
app.use(cors({
    // Explicitly allow your frontend origin
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    // Allow cookies and other credentials to be sent
    credentials: true,
}));
app.use(express.json());

// Initialize cookie-parser without a secret. The Double-Submit pattern does not require signed cookies.
app.use(cookieParser());

// Initialize Passport and use session
app.use(passport.initialize());

// --- Double-Submit Cookie CSRF Protection ---
const csrfProtection = (req, res, next) => {
    const excludedRoutes = [
        '/api/auth/login', // Login doesn't need CSRF
        '/api/auth/register', // Public registration
        '/api/users/forgot-password', // Public
        '/api/orders/webhook', // External service webhook
        '/api/csrf-token', // The token-issuing route is always excluded
    ];

    // Only apply CSRF protection to state-changing methods and non-excluded routes
    const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
    const isExcluded = excludedRoutes.some(route => req.originalUrl.startsWith(route));

    if (!isStateChanging || isExcluded) {
        return next();
    }

    const tokenFromCookie = req.cookies['XSRF-TOKEN'];
    // Express lowercases all incoming header keys. 'X-XSRF-TOKEN' becomes 'x-xsrf-token'.
    const tokenFromHeader = req.headers['x-xsrf-token'];

    if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
        console.error(`CSRF Token Mismatch: Cookie=${tokenFromCookie}, Header=${tokenFromHeader}`);
        return next(new ApiError(httpStatus.FORBIDDEN, 'Invalid or missing CSRF token.'));
    }

    next();
};

// --- API Routes ---
// Apply CSRF protection before the main router.
app.use('/api', csrfProtection);
app.use('/api', apiRouter);

// Root (API health check)
app.get("/api", (req, res) => {
    res.json({ message: "Backend is running 🚀" });
});

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

export default app;
