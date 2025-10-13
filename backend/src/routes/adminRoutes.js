import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected and require admin privileges.
router.use(protect, isAdmin);

router.route('/users').get(getAllUsers);

router.route('/users/:id').put(updateUserRole).delete(deleteUser);

export default router;
