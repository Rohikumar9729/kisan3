import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';

// Route imports
import productRoutes from './routes/productRoutes.js';
import orderRoutes   from './routes/orderRoutes.js';
import cartRoutes    from './routes/cartRoutes.js';
import userRoutes    from './routes/userRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const port = process.env.PORT || 4000;

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: '🌾 Kisan API is live!', status: 'ok' }));

// ── Inngest event handler ──────────────────────────────────────────────────────
app.use('/api/inngest', serve({ client: inngest, functions }));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/users',    userRoutes);

// ── Error Handling Middleware ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────────────
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`\n🚀 Server running on http://localhost:${port}`);
            console.log(`📦 API endpoints:`);
            console.log(`   GET  /api/products`);
            console.log(`   POST /api/products`);
            console.log(`   POST /api/users/register`);
            console.log(`   POST /api/users/login`);
            console.log(`   GET  /api/users/me`);
            console.log(`   GET  /api/orders/my`);
            console.log(`   GET  /api/cart`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
