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

// Import all your route files
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

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
//

if (!process.env.CSRF_SECRET || process.env.CSRF_SECRET.length < 32) {
  console.warn('WARNING: CSRF_SECRET is not defined or is too short. Using a temporary, insecure secret. Please set a 32-character string in your .env file for production.');
  if (process.env.NODE_ENV !== 'production') {
    process.env.CSRF_SECRET = 'a_temporary_insecure_secret_32ch';
  }
}

// CSRF Protection Middleware
// This must come after cookieParser and any session middleware.
const csrfProtection = csrf(
  process.env.CSRF_SECRET, // A 32-character secret from .env
  ['POST', 'PUT', 'DELETE', 'PATCH'], // Methods to protect
  [
    // Routes to exclude from CSRF protection
    '/api/users/login',
    '/api/users/register',
    '/api/users/forgot-password',
    '/api/cart/sync', // Cart sync happens immediately on login, may race for a new token.
    '/api/orders/webhook', // Webhooks are external and won't have a CSRF token
  ]
);

app.use(csrfProtection); // Apply CSRF protection before the routes that need it.

// --- API Routes ---
// This is now the single source of truth for routing
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes); // FAQ route is at /api/support/faq
app.use('/api/notifications', notificationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes); //Authentication routes Google OAuth

// A simple route for the frontend to fetch the current CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Root (API health check)
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
