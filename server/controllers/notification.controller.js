import Notification from '../models/notification.model.js';
import { sendNotificationToUser } from '../utils/socket.js';

const notificationController = {
  // Get all notifications for a user with pagination
  getNotifications: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  // Default to page 1
      const limit = parseInt(req.query.limit) || 10;  // Default to 10 notifications per page
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
      // Create the notification in the database
      const notification = await Notification.create({
        recipient: recipientUserId,
        sender: senderId,
        idea: ideaId,
        type,
        content,
        read: false,
        createdAt: new Date(),
      });

      // Populate sender and idea before emitting
      const populated = await Notification.findById(notification._id)
        .populate('sender', 'name alias image')
        .populate('idea', 'content');

      // Emit the notification to the recipient via socket
      sendNotificationToUser(recipientUserId, populated);

      return populated;
    } catch (err) {
      console.error('❌ Failed to send notification:', err);
    }
  }
};

export default notificationController;
