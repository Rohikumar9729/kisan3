import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
} from '../controllers/userController.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
