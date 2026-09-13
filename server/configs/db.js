import mongoose from 'mongoose';
import dns from 'dns';

// Use public DNS for SRV queries if needed
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Ignore if not supported in environment
}

let isListenerAttached = false;

const connectDB = async () => {
    try {
        if (!isListenerAttached) {
            mongoose.connection.on('connected', () => console.log('🍃 MongoDB connected successfully!'));
            mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err.message));
            isListenerAttached = true;
        }

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ MONGODB_URI is not defined in server/.env');
            return;
        }

        await mongoose.connect(uri, {
            dbName: 'KISAN3',
            serverSelectionTimeoutMS: 8000,
        });
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
};

export default connectDB;