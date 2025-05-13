// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import normalizeError from './utils/normalizeError.js';
import userRoutes from './routes/user.routes.js';
import ideaRoutes from './routes/idea.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';

import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSocket } from './utils/socket.js';

const app = express();
const server = http.createServer(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env variables
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO
initSocket(server);

// Routes
app.use('/api', userRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// MongoDB connection
dbConnect();

// 404 + Error handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  err.name = 'Not Found';
  next(err);
});
app.use((err, req, res, next) => {
  const normalized = normalizeError(err);
  res.status(normalized.statusCode).json(normalized);
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
