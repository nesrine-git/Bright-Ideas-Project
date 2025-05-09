import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import normalizeError from './utils/normalizeError.js';
import userRoutes from './routes/user.routes.js';
import ideaRoutes from './routes/idea.routes.js';
import commentRoutes from './routes/comment.routes.js';
//import response from './utils/response.js';

const app = express();
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
app.use(cors({credentials: true,  // allow cookies
    origin: 'http://localhost:5173' // frontend URL
}));

// Routes
app.use('/api', userRoutes); // all user routes prefixed with /api
app.use('/api/ideas', ideaRoutes); // all idea routes prefixed with /api/ideas
app.use('/api/comments', commentRoutes); // all comment routes prefixed with /api/comments


// DB 
dotenv.config();
const PORT = process.env.PORT;
dbConnect();

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    err.name = 'Not Found';
    next(err);
  });
  

// Global error handler
app.use((err, req, res, next) => {
    const normalized = normalizeError(err);
    //response(res,normalized.statusCode,false,normalized.message,normalized.validations) 
    res.status(normalized.statusCode).json(normalized);
  });


app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);