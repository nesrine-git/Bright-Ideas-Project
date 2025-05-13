import express from 'express';
import ideaController from '../controllers/idea.controller.js';
import authenticate from '../config/jwt.config.js';

const router = express.Router();

// 🚀 Create and List Ideas
router.post('/create', authenticate, ideaController.create); // Create a new idea
router.get('/user/:userId', ideaController.getByUser); // ✅ Specific route - get ideas by a user
router.get('/most-supported', ideaController.getMostSupported); // Get most supported ideas
router.get('/most-inspiring', ideaController.getMostInspiring); // Get most inspiring ideas
router.get('/:id/reactions', ideaController.getReactions); // Get reactions for a single idea
router.get('/', ideaController.getAll); // Get all ideas
router.get('/:id', ideaController.getOne); // ✅ General route - must come after others

// 🚀 Idea Reactions
router.post('/:id/toggle-inspiration', authenticate, ideaController.toggleInspiration); // Toggle inspiration
router.post('/:id/toggle-support', authenticate, ideaController.toggleSupport); // Toggle support

// 🚀 Idea Comments
router.post('/:id/comments', authenticate, ideaController.createComment); // Create comment

// 🚀 Update and Delete
router.put('/:id', authenticate, ideaController.update); // Update an idea
router.delete('/:id', authenticate, ideaController.delete); // Delete an idea

export default router;
