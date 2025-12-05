import app from '../app.js';
import connectDB from '../database/mongodb.js';
import mongoose from 'mongoose';

// Initialize database connection (runs once per serverless instance)
let dbConnectionPromise = null;

const connectDatabase = async () => {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  // If connection is in progress, wait for it
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }
  
  // Start new connection
  dbConnectionPromise = (async () => {
    try {
      await connectDB();
      console.log('Database connected for serverless function');
    } catch (error) {
      console.error('Database connection error:', error);
      dbConnectionPromise = null; // Reset on error so we can retry
      throw error;
    }
  })();
  
  return dbConnectionPromise;
};

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Connect to database
    await connectDatabase();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
    return;
  }

  // Handle the request with Express app
  try {
    return app(req, res);
  } catch (error) {
    console.error('Express handler error:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}

