import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios'; // for API calls

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Mark all notifications as read locally and backend
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.patch('/api/notifications/read-all'); // adjust URL as needed
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  }, []);

  // Mark a single notification as read locally and backend
  const markAsRead = useCallback(async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }, []);

  // Fetch initial notifications on user login
  useEffect(() => {
    if (!user) return;

const fetchNotifications = async () => {
  try {
    const res = await axios.get('/api/notifications');

    const data = res.data?.notifications || []; // Adjust this line
    if (!Array.isArray(data)) {
      throw new Error("Notifications response is not an array");
    }

    setNotifications(data);
    const unread = data.filter((n) => !n.read).length;
    setUnreadCount(unread);
  } catch (err) {
    console.error('❌ Failed to fetch notifications', err);
  }
};


    fetchNotifications();

    console.log('🔌 Connecting to socket server...');
    const newSocket = io('http://localhost:3000', { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`✅ Socket connected: ${newSocket.id}`);
      newSocket.emit('register', user._id);
    });

    newSocket.on('new-notification', (notification) => {
      console.log('📬 New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    newSocket.on('connect_error', (err) => {
      console.log('❌ Socket connection error:', err.message);
    });

    return () => {
      console.log('🔌 Socket disconnected');
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAllAsRead,
      markAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
