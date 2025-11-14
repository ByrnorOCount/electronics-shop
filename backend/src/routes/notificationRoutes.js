import express from 'express';
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.get('/', getNotifications);
router.post('/mark-all-read', markAllNotificationsAsRead);
router.put('/:id', markNotificationAsRead);

export default router;
