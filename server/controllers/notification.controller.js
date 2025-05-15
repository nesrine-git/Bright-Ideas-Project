import Notification from '../models/notification.model.js';
import { sendNotificationToUser } from '../utils/socket.js';

// Allowed notification types (matching your schema enum)
const ALLOWED_TYPES = ['support', 'inspiration', 'comment'];

const notificationController = {
  // Get all notifications for a user with pagination
  getNotifications: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  // Default page 1
      const limit = parseInt(req.query.limit) || 10;  // Default 10 per page
      const skip = (page - 1) * limit;

      const notifications = await Notification.find({ recipient: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'name alias image')
        .populate('idea', 'content');

      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving notifications', error: err });
    }
  },

  // Mark a single notification as read
  markAsRead: async (req, res) => {
    try {
      await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.userId },
        { read: true }
      );
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: 'Error marking notification as read', error: err });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      await Notification.updateMany(
        { recipient: req.userId, read: false },
        { $set: { read: true } }
      );
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: 'Error marking all notifications as read', error: err });
    }
  },

  // Send and emit a notification
  sendNotification: async ({ recipientUserId, senderId, ideaId, type, content }) => {
    try {
      // Validate notification type
      if (!ALLOWED_TYPES.includes(type)) {
        throw new Error(`Invalid notification type: ${type}. Allowed types are: ${ALLOWED_TYPES.join(', ')}`);
      }

      // Create notification document
      const notification = await Notification.create({
        recipient: recipientUserId,
        sender: senderId,
        idea: ideaId,
        type,
        content,
        read: false,
        createdAt: new Date(),
      });

      // Populate sender and idea references before emitting
      const populated = await Notification.findById(notification._id)
        .populate('sender', 'name alias image')
        .populate('idea', 'content');

      // Emit notification via socket
      sendNotificationToUser(recipientUserId, populated);

      return populated;
    } catch (err) {
      console.error('❌ Failed to send notification:', err.message);
      if (err.name === 'ValidationError') {
        for (const field in err.errors) {
          console.error(`Field '${field}':`, err.errors[field].message);
        }
      }
      // Optionally: rethrow or return a failure result here
      throw err;
    }
  },
  // Delete a notification by ID for the logged-in user
  deleteNotification: async (req, res) => {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.userId,
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found or not authorized' });
      }

      res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting notification', error: err });
    }
  }
};

export default notificationController;
