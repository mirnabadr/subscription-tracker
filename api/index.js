import app from '../app.js';
import connectDB from '../database/mongodb.js';
import mongoose from 'mongoose';

// Vercel serverless function handler
export default async function handler(req, res) {
  // Connect to database if not already connected (for serverless cold starts)
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
      console.log('Database connected for serverless function');
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Handle the request with Express app
  return app(req, res);
}

