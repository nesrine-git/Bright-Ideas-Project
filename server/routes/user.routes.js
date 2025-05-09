import express, { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authenticate  from '../config/jwt.config.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// 🔐 Protected routes
router.get('/users', authenticate, userController.getAll);
router.get('/users/current', authenticate, userController.getCurrentUser);
router.get('/users/:id', authenticate, userController.getOne);


export default router;
