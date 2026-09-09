import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    getDashboard,
    getAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/signup', registerUser);
router.post('/login', loginUser);

// ── Protected Routes ──────────────────────────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// ── Admin Routes ──────────────────────────────────────────────────────────────
router.get('/admin/dashboard', protect, adminOnly, getDashboard);
router.get('/', protect, adminOnly, getAllUsers);

export default router;
