import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import authenticate from '../config/jwt.config.js';

const router = express.Router();

router.get('/', authenticate, notificationController.getNotifications);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead); // ✅ New route

export default router;
