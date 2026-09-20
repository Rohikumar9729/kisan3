import mongoose from 'mongoose';
import dns from 'dns';

// Use public DNS for SRV queries if needed
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Ignore if not supported in environment
}

let cachedPromise = null;

const connectDB = async () => {
    // Return existing active connection if already established
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        const errorMsg = 'MONGODB_URI is not defined in environment variables. Please configure it in Vercel project settings.';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
    }

    if (!cachedPromise) {
        mongoose.connection.removeAllListeners('connected');
        mongoose.connection.removeAllListeners('error');
        mongoose.connection.on('connected', () => console.log('🍃 MongoDB connected successfully!'));
        mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err.message));

        cachedPromise = mongoose.connect(uri, {
            dbName: 'KISAN3',
            serverSelectionTimeoutMS: 8000,
        }).then((m) => {
            return m.connection;
        }).catch((err) => {
            cachedPromise = null;
            console.error('❌ MongoDB connection failed:', err.message);
            throw err;
        });
    }

    return cachedPromise;
};

export default connectDB;