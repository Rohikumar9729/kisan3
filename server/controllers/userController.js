import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisan_jwt_secret_key_2025';

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ─── POST /api/users/register ──────────────────────────────────────────────────
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long',
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Generate avatar using user's initials
        const defaultImage = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=cec382&textColor=1a1a1a`;

        // Create new user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role === 'farmer' ? 'farmer' : (role === 'admin' ? 'admin' : 'user'),
            phone: phone || '',
            address: address || '',
            image: defaultImage,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
    }
};

// ─── POST /api/users/login ─────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter both email and password',
            });
        }

        // Check user existence
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Validate password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=cec382&textColor=1a1a1a`,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error during login' });
    }
};

// ─── GET /api/users/me (auth) ──────────────────────────────────────────────────
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=cec382&textColor=1a1a1a`,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── PUT /api/users/profile (auth) ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { name, phone, address, image } = req.body;
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (image !== undefined) user.image = image;

        if (req.body.password && req.body.password.length >= 6) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image,
                phone: updatedUser.phone,
                address: updatedUser.address,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── GET /api/users/admin/dashboard (admin) ────────────────────────────────────
export const getDashboard = async (req, res) => {
    try {
        const [totalProduct, totalUser, totalOrders, recentOrders] = await Promise.all([
            Product.countDocuments({ isActive: true }),
            User.countDocuments(),
            Order.countDocuments(),
            Order.find().populate('product').sort({ createdAt: -1 }).limit(10),
        ]);
        res.json({
            success: true,
            stats: { totalProduct, totalUser, totalOrders },
            recentOrders,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── GET /api/users (admin) ────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
