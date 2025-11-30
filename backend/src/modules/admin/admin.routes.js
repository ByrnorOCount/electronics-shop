import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardMetrics,
  createCategory,
  getAnalyticsData, // Import new controller function
  getSystemLogs, // Import new controller function
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "./admin.controller.js";
import {
  authenticate,
  isAdmin,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
import * as adminValidation from "./admin.validation.js";

const router = express.Router();

router.use(authenticate, isAuthenticated, isAdmin); // All routes in this file are protected and for admins only.

// Admin Dashboard & Analytics
// The existing /dashboard route provides basic metrics.
// More detailed analytics can be added to a dedicated /analytics route.

router.get("/dashboard", getDashboardMetrics);

router.route("/users").get(validate(adminValidation.getAllUsers), getAllUsers);
router
  .route("/users/:userId")
  .put(validate(adminValidation.updateUserRole), updateUserRole)
  .delete(validate(adminValidation.deleteUser), deleteUser);

// Analytics Routes
router.get(
  "/analytics",
  validate(adminValidation.getAnalyticsData),
  getAnalyticsData
); // Route for detailed analytics

// System Logs Routes
router.get("/logs", validate(adminValidation.getSystemLogs), getSystemLogs); // Route for system logs

router
  .route("/categories")
  .get(getAllCategories)
  .post(validate(adminValidation.createCategory), createCategory);
router
  .route("/categories/:categoryId")
  .put(validate(adminValidation.updateCategory), updateCategory)
  .delete(validate(adminValidation.deleteCategory), deleteCategory);

export default router;
