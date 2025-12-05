import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controller.js'; 
 
const authRouter = Router();

// path: 
// path: http://localhost:5500/api/v1/auth/signIn
// path: /api/v1/auth/signOut

// POST request body --> name, email, password --> response --> user, token ---> creats a new user in the database.

authRouter.post('/signup',   signUp); 
authRouter.post('/signin',  signIn);
authRouter.post('/signout',  signOut);

export default authRouter;