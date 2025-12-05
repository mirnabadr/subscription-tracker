import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js'; 


// someone is making a request to get the user  details --> verify the token(call this middleware) --> if token is valid --> get the user details --> if token is invalid --> return 401 status code --> return 401 status code.
const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - No token provided. Please sign in first to get a token.' 
            });
        }
        
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error' 
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - User not found' 
            });
        }
        
        req.user = user;
        next();
         
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - Invalid token. Please sign in again.' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - Token expired. Please sign in again.' 
            });
        }
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized - Authentication failed' 
        });
    }
};

export default authorize;