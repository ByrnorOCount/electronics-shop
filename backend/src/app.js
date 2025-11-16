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
app.use(cookieParser(process.env.SESSION_SECRET)); // Pass secret for signed cookies

app.use(
    session({
        secret: process.env.SESSION_SECRET, // Get from .env file
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

// Initialize Passport and use session
app.use(passport.initialize());
app.use(passport.session());

if (!process.env.CSRF_SECRET || process.env.CSRF_SECRET.length < 32) {
    console.warn('WARNING: CSRF_SECRET is not defined or is too short. Using a temporary, insecure secret. Please set a 32-character string in your .env file for production.');
    if (process.env.NODE_ENV !== 'production') {
        process.env.CSRF_SECRET = 'a_temporary_insecure_secret_32ch';
    }
}

// CSRF Protection Middleware
const csrfProtection = csrf(
    process.env.CSRF_SECRET,
    ['POST', 'PUT', 'DELETE', 'PATCH'],
    [
        '/api/users/login',
        '/api/users/register',
        '/api/users/forgot-password',
        '/api/cart/sync',
        '/api/orders/webhook',
    ]
);

app.use(csrfProtection);

// --- API Routes ---
app.use('/api', apiRouter);

// A simple route for the frontend to fetch the current CSRF token
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Root (API health check)
app.get("/api", (req, res) => {
    res.json({ message: "Backend is running 🚀" });
});

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

export default app;
