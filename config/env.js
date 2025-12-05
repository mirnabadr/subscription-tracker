import {config} from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
// Try .local file first, then fall back to regular .env file
config({path: `.env.${nodeEnv}.local`});
config({path: `.env.${nodeEnv}`});

export const PORT = Number(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE; 
export const ARCJET_API_KEY = process.env.ARCJET_API_KEY;
export const ARCJET_ENV = process.env.ARCJET_ENV;
export const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
export const QSTASH_URL = process.env.QSTASH_URL;
export const QSTASH_CURRENT_SIGNING_KEY = process.env.QSTASH_CURRENT_SIGNING_KEY;
export const QSTASH_NEXT_SIGNING_KEY = process.env.QSTASH_NEXT_SIGNING_KEY;
export const SERVER_URL = process.env.SERVER_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5500');
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
