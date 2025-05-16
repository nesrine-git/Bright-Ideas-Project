import React, { createContext, useContext, useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

// Create context
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    notificationService.getAllNotifications()
      .then(data => {
        console.log(data);
        setNotifications(data);
      })
      .catch(err => {
        console.error('Failed to load notifications:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id) => {
  try {
    await notificationService.markAsRead(id); // call API, no need to await returned data
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, read: true } : notif
      )
    );
  } catch (err) {
    console.error('Failed to mark notification as read:', err.message);
  }
};



  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      loading,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

