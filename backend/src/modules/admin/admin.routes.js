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
import { protect, isAdmin } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin); // All routes in this file are protected and for admins only

router.get('/dashboard', getDashboardMetrics);

router.route('/users').get(getAllUsers);
router.route('/users/:id').put(updateUserRole).delete(deleteUser);

router.route('/categories').get(getAllCategories).post(createCategory);
router.route('/categories/:id').put(updateCategory).delete(deleteCategory);

export default router;
