import express, { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authenticate  from '../config/jwt.config.js';
import multer from 'multer';

const router = Router();

// storage image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage });
  
router.put('/users/update', authenticate, upload.single('profilePicture'), userController.updateUserProfile);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// 🔐 Protected routes
router.get('/users', authenticate, userController.getAll);
router.get('/users/current', authenticate, userController.getCurrentUser);
router.get('/users/:id', authenticate, userController.getOne);




export default router;
