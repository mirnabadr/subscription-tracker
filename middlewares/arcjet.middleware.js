
import aj from '../config/arcjet.js';
import express from 'express';
const arcjetMiddleware = async (req, res, next) => {
   try {
    const decision = await aj.protect(req, { requested: 1});  // we are requesting 1 token from the bucket
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) 
            return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
        
         if (decision.reason.isBot()) 
            return res.status(403).json({ success: false, message: 'Bot detected' });
            return res.status(403).json({ success: false, message: 'Access denied' });
        
    }
    next();
   } catch (error) {
    console.log('Arcjet middleware error', `${error}`);
    next(error);
   }
};


export default arcjetMiddleware;