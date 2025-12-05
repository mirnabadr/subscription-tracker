import mongoose from 'mongoose';
import { MONGO_URI , NODE_ENV} from '../config/env.js';
 

if (!MONGO_URI) {
    throw new Error('Please provide a MongoDB URI in the environment variables in the .env<development|production>.local file');
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected to ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to Database:', error);
        process.exit(1);
    }
};

export default connectDB;