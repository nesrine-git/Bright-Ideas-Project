import express, { Router } from 'express';
import userController from '../controllers/user.controller.js';
//import { authenticate } from '../config/jwt.config.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

//router.get('/users', authenticate, userController.getAll);

export default router;
