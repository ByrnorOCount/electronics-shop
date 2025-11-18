import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardMetrics,
  createCategory,
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

router.use(authenticate, isAuthenticated, isAdmin); // All routes in this file are protected and for admins only

router.get("/dashboard", getDashboardMetrics);

router.route("/users").get(validate(adminValidation.getAllUsers), getAllUsers);
router
  .route("/users/:userId")
  .put(validate(adminValidation.updateUserRole), updateUserRole)
  .delete(validate(adminValidation.deleteUser), deleteUser);

router
  .route("/categories")
  .get(getAllCategories)
  .post(validate(adminValidation.createCategory), createCategory);
router
  .route("/categories/:categoryId")
  .put(validate(adminValidation.updateCategory), updateCategory)
  .delete(validate(adminValidation.deleteCategory), deleteCategory);

export default router;
