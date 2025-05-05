import express, { Router } from 'express';
import commentController from '../controllers/comment.controller.js';
import authenticate from '../config/jwt.config.js';

const router = Router();

// Prefix will be /api/comments

// POST: Create a new comment for a specific idea (content optional)
router.post('/idea/:ideaId', authenticate, commentController.create);

// GET: Get all comments for a specific idea
router.get('/idea/:ideaId', authenticate, commentController.getAllByIdea);

// PATCH: Update a specific comment (only by creator)
router.patch('/:id', authenticate, commentController.update);

// PATCH: Toggle like/unlike on a comment
router.patch('/:id/like', authenticate, commentController.toggleLike);

// DELETE: Delete a specific comment (only by creator)
router.delete('/:id', authenticate, commentController.delete);

export default router;
