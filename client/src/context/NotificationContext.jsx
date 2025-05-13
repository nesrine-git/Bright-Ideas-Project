import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!user) return;

    console.log('🔌 Connecting to socket server...');

    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Log when the socket connects successfully
    newSocket.on('connect', () => {
      console.log(`✅ Socket connected: ${newSocket.id}`);
      newSocket.emit('register', user._id);
    });

    // Log when the socket receives a notification
    newSocket.on('new-notification', (notification) => {
      console.log('📬 New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Log any errors
    newSocket.on('connect_error', (err) => {
      console.log('❌ Socket connection error:', err.message);
    });

    // Cleanup on component unmount
    return () => {
      console.log('🔌 Socket disconnected');
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
