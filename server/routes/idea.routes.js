import express, { Router } from 'express';
import ideaController from '../controllers/idea.controller.js';
import  authenticate  from '../config/jwt.config.js';

const router = Router();

// /api/ideas/
router.route('/')
  .get(authenticate, ideaController.getAll)
  .post(authenticate, ideaController.create);

// /api/ideas/:id
router.route('/:id')
  .get(authenticate, ideaController.getOne)
  .delete(authenticate, ideaController.delete)
  .patch(authenticate, ideaController.update); 

// /api/ideas/:id/like
router.patch('/:id/like', authenticate, ideaController.toggleLike);

export default router;
