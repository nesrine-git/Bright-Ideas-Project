import express, { Router } from 'express';
import ideaController from '../controllers/idea.controller.js';
import authenticate from '../config/jwt.config.js'; // Auth middleware

const router = Router();

// =======================
// Routes for /api/ideas/
// =======================

// GET: Retrieve all ideas (only for authenticated users)
// POST: Create a new idea (authenticated user is the creator)
router.route('/')
  .get(authenticate, ideaController.getAll)
  .post(authenticate, ideaController.create);

// Get most-likes ideas
router.route('/most-liked')
    .get(authenticate, ideaController.getMostLiked);

// ===========================
// Routes for /api/ideas/:id
// ===========================

// GET: Get one idea by ID (auth required)
// DELETE: Delete idea by ID (only creator can delete)
// PATCH: Update idea by ID (only creator can update)
router.route('/:id')
  .get(authenticate, ideaController.getOne)
  .delete(authenticate, ideaController.delete)
  .patch(authenticate, ideaController.update);

// ================================
// Route for toggling like status
// ================================

// PATCH: Like/unlike an idea by ID (auth required)
router.patch('/:id/like', authenticate, ideaController.toggleLike);
// Get likers
router.get('/:id/likes',authenticate, ideaController.getLikes)

export default router;
