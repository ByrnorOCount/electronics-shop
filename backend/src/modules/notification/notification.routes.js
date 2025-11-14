import express from 'express';
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from './notification.controller.js';
import { protect } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/mark-all-read', markAllNotificationsAsRead);
router.put('/:id', markNotificationAsRead);

export default router;
