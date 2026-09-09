import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('🍃 MongoDB connected successfully!'));
        mongoose.connection.on('error', (err) => console.error('❌ MongoDB connection error:', err.message));

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ MONGODB_URI is not defined in server/.env');
            return;
        }

        // Clean URI to base cluster URL and specify dbName in connection options
        // This avoids SSL Alert 80 and invalid certificate handshake errors on MongoDB Atlas
        const cleanUri = uri.split('?')[0].replace(/\/+$/, '');
        const baseUri = cleanUri.includes('.mongodb.net/')
            ? cleanUri.substring(0, cleanUri.lastIndexOf('.mongodb.net') + 12)
            : cleanUri;

        await mongoose.connect(baseUri, {
            dbName: 'KISAN3',
            retryWrites: true,
            w: 'majority',
        });
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
};

export default connectDB;