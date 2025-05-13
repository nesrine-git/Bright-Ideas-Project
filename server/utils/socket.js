import { Server } from 'socket.io';

let io;
const users = {}; // userId -> socketId

// Initialize Socket.IO and define handlers
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // Register user to the socket by userId
    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
    });

    // Handle disconnections and cleanup
    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

// Emit a notification to a specific user
export const sendNotificationToUser = (userId, notification) => {
  const socketId = users[userId];
  if (socketId && io) {
    io.to(socketId).emit('new-notification', notification);
  }
};
