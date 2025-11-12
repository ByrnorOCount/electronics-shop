import dotenv from "dotenv";
// It's crucial to call dotenv.config() at the very top
// so that environment variables are available in all imported modules.
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

// Import all your route files
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// --- API Routes ---
// This is now the single source of truth for routing
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes); // FAQ route is at /api/support/faq
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes); //Authentication routes Google OAuth

// Root (API health check)
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
