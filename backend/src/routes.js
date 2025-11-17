import { Router } from "express";
import crypto from "crypto";

import { authenticate } from "./core/middlewares/auth.middleware.js";
import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import supportRoutes from "./modules/support/support.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import staffRoutes from "./modules/staff/staff.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const apiRouter = Router();

// Route to provide the CSRF token to the frontend.
// This implements the "Double-Submit Cookie" pattern.
apiRouter.get("/csrf-token", (req, res) => {
  const csrfToken = crypto.randomBytes(16).toString("hex");

  // Send the token in a cookie that is NOT httpOnly, so the frontend JS can read it.
  res.cookie("XSRF-TOKEN", csrfToken, {
    path: "/",
    secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
    sameSite: "lax", // Recommended for CSRF protection
  });

  // Also send the token in the response body. Axios doesn't strictly need this,
  // but it can be useful for other clients or for debugging.
  res.json({ csrfToken });
});

apiRouter.use("/users", userRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/wishlist", wishlistRoutes);
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/support", supportRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/staff", staffRoutes);
apiRouter.use("/admin", adminRoutes);

export default apiRouter;
