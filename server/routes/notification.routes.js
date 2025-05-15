import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import authenticate from '../config/jwt.config.js';

const router = express.Router();

// Get all notifications for the logged-in user (with pagination support)
router.get('/', authenticate, notificationController.getNotifications);
// Mark all notifications as read for the logged-in user
router.patch('/read-all', authenticate, notificationController.markAllAsRead);

// (Optional) You can add more routes here in the future if needed
router.delete('/delete/:id', authenticate, notificationController.deleteNotification);
// Mark a specific notification as read by ID
router.patch('/:id/read', authenticate, notificationController.markAsRead);

export default router;
