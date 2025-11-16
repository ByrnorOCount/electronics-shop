import dotenv from "dotenv";
// It's crucial to call dotenv.config() at the very top
// so that environment variables are available in all imported modules.
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import csrf from 'tiny-csrf';
import cookieParser from "cookie-parser";
import passport from "passport";

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

// Initialize cookie-parser with a secret. This must come before the session middleware.
// The secret provided here MUST match the secret used by tiny-csrf, as cookie-parser
// is responsible for unsigning the CSRF cookie.
app.use(cookieParser(process.env.CSRF_SECRET));

app.use(
    session({
        secret: process.env.SESSION_SECRET, // Get from .env file
        resave: false,
        saveUninitialized: false,
        cookie: {
            // In production, you should use `secure: true` and `sameSite: 'none'` if your frontend and backend are on different domains.
            // For localhost development (even with different ports), `lax` is the correct and secure setting.
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

// Initialize Passport and use session
app.use(passport.initialize());
app.use(passport.session());

// CSRF Protection Middleware
// It's best practice to apply this after all parsing and session middleware.
const csrfProtection = csrf(
    process.env.CSRF_SECRET || 'a_temporary_insecure_secret_32ch', // Provide a fallback directly
    ['POST', 'PUT', 'DELETE', 'PATCH'], // 2. Methods to protect
    [
        // 3. Excluded routes
        '/api/auth/login',
        '/api/auth/register',
        '/api/users/forgot-password',
        '/api/cart/sync',
        '/api/orders/webhook',
    ],
    [], // 4. Excluded Referrers (we are not using this feature)
    { cookie: true } // 5. Options: Use a signed cookie to store the CSRF secret.
);

if (!process.env.CSRF_SECRET || process.env.CSRF_SECRET.length < 32) {
    console.warn('WARNING: CSRF_SECRET is not defined or is too short. Using a temporary, insecure secret. Please set a 32-character string in your .env file for production.');
}

app.use(csrfProtection);

// A simple route for the frontend to fetch the current CSRF token
// This MUST be defined before the main apiRouter.
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// --- API Routes ---
app.use('/api', apiRouter);

// Root (API health check)
app.get("/api", (req, res) => {
    res.json({ message: "Backend is running 🚀" });
});

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

export default app;
