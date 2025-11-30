import dotenv from "dotenv";
// It's crucial to call dotenv.config() at the very top
// so that environment variables are available in all imported modules.
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import apiRouter from "./routes.js";
import { errorHandler, notFound } from "./core/middlewares/error.middleware.js";
import { csrfProtection } from "./core/middlewares/csrf.middleware.js";
import "./config/passport.js";
import env from "./config/env.js";

const app = express();

// Middleware
app.use(
  cors({
    // Explicitly allow your frontend origin
    origin: env.FRONTEND_URL || "http://localhost:5173",
    // Allow cookies and other credentials to be sent
    credentials: true,
  })
);

// Initialize cookie-parser without a secret. The Double-Submit pattern does not require signed cookies.
app.use(cookieParser());

// Initialize Passport and use session
app.use(passport.initialize());

// --- API Routes ---
// Apply CSRF protection and a general JSON body parser before the main router.
// Note: The Stripe webhook route will use a different parser and must be defined
// before this general parser is used inside `apiRouter`.
app.use("/api", csrfProtection);
app.use("/api", apiRouter);

// Root (API health check)
app.get("/api", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

export default app;
