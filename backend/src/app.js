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

// This custom middleware conditionally applies the JSON body parser.
// It skips the Stripe webhook route, which needs a raw body for signature verification.
app.use("/api", (req, res, next) => {
  if (req.originalUrl === "/api/orders/webhook") {
    return next(); // Skip JSON parsing for the webhook
  }
  // For all other /api routes, parse the JSON body.
  express.json()(req, res, next);
});

// --- API Routes ---
// Apply CSRF protection after the body has been parsed (for most routes).
app.use("/api", csrfProtection);

// Use the main API router.
app.use("/api", apiRouter);

// Root (API health check)
app.get("/api", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

export default app;
