import express from 'express';
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from './notification.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import validate from '../../core/middlewares/validation.middleware.js';
import * as notificationValidation from './notification.validation.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.get('/', validate(notificationValidation.getNotifications), getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/mark-all-read', markAllNotificationsAsRead);
router.put('/:id', validate(notificationValidation.markAsRead), markNotificationAsRead);

export default router;
