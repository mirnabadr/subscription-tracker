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

        // Check if connection is in progress
        if (mongoose.connection.readyState === 2) {
            console.log('MongoDB connection in progress, waiting...');
            // Wait for connection to complete (max 10 seconds)
            let attempts = 0;
            while (mongoose.connection.readyState === 2 && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
            if (mongoose.connection.readyState === 1) {
                console.log('MongoDB connected after waiting');
                return;
            }
        }

        // Connect to MongoDB with optimized settings for serverless
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000, // 10 seconds for serverless
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            connectTimeoutMS: 10000, // 10 seconds to establish connection
            maxPoolSize: 1, // Maintain up to 1 socket connection (good for serverless)
            minPoolSize: 0, // Allow connection pool to close when idle
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        };

        await mongoose.connect(MONGO_URI, connectionOptions);
        console.log(`MongoDB connected to ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to Database:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            MONGO_URI_set: !!MONGO_URI,
            MONGO_URI_length: MONGO_URI ? MONGO_URI.length : 0
        });
        // Don't exit process in serverless environment
        if (process.env.VERCEL || process.env.VERCEL_ENV) {
            throw error; // Let the handler catch it
        }
        process.exit(1);
    }
};

export default connectDB;