import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardMetrics,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from './admin.controller.js';
import validate from '../../core/middlewares/validation.middleware.js';
import adminValidation from './admin.validation.js';
import { protect, isAdmin } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin); // All routes in this file are protected and for admins only

router.get('/dashboard', getDashboardMetrics);

router.route('/users').get(getAllUsers);
router
  .route('/users/:userId')
  .put(validate(adminValidation.updateUserRole), updateUserRole)
  .delete(validate(adminValidation.deleteUser), deleteUser);

router.route('/categories').get(getAllCategories).post(validate(adminValidation.createCategory), createCategory);
router
  .route('/categories/:categoryId')
  .put(validate(adminValidation.updateCategory), updateCategory)
  .delete(validate(adminValidation.deleteCategory), deleteCategory);

export default router;
