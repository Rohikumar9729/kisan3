import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisan_jwt_secret_key_2025';

// Protect Routes (JWT)
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.headers['x-auth-token']) {
            token = req.headers['x-auth-token'];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No authentication token provided.',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user from DB (excluding password)
        const user = await User.findById(decoded.id || decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists.',
            });
        }

        // Set user on request object
        req.user = user;
        // Backward compatibility for existing controllers referencing req.auth.userId
        req.auth = { userId: user._id.toString() };

        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token. Please log in again.',
        });
    }
};
