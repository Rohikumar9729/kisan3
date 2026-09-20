import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Dynamic CORS configuration supporting local development and deployed frontend (Vercel, Render, etc.)
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, mobile apps, Postman, server-to-server)
        if (!origin) return callback(null, true);

        // Allow any configured CLIENT_URL, localhost, or any vercel.app deployment preview
        if (
            process.env.CLIENT_URL === '*' ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        }

        // Permissive fallback so cross-origin requests with JWT Bearer tokens don't fail
        return callback(null, true);
    },
    credentials: true,
}));

// Database connection middleware to ensure DB is ready on serverless cold starts
app.use(async (_req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error in request middleware:', err.message);
        return res.status(503).json({
            success: false,
            message: 'Database connection failed. Please check MONGODB_URI and MongoDB Atlas Network Access (whitelist 0.0.0.0/0 for Vercel).',
            error: err.message,
        });
    }
});

// Health check endpoints
app.get('/', (_req, res) => res.json({ message: 'Kisan API is live!', status: 'ok' }));
app.get('/api', (_req, res) => res.json({ message: 'Kisan API is live!', status: 'ok' }));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server locally / in traditional Node process (Render, local dev, Docker)
// In Vercel serverless functions, Vercel manages the HTTP server via the exported app
if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    });
}

export default app;
