import mongoose from 'mongoose';
import { MONGO_URI , NODE_ENV} from '../config/env.js';
 

if (!MONGO_URI) {
    throw new Error('Please provide a MongoDB URI in the environment variables in the .env<development|production>.local file');
}

const connectDB = async () => {
    try {
        // Check if already connected (for serverless environments like Vercel)
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log(`MongoDB connected to ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to Database:', error);
        // Don't exit process in serverless environment
        if (process.env.VERCEL || process.env.VERCEL_ENV) {
            throw error; // Let the handler catch it
        }
        process.exit(1);
    }
};

export default connectDB;