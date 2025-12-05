import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import User from '../models/user.model.js';
// what is a request body? req.body is an object containing the data from the client (post request).
export const signUp = async (req, res, next) => {
    // implement the signup logic 
   const session = await mongoose.startSession();
   session.startTransaction();

   // this is the transaction block means all the operations are atomic and if one operation fails, all the operations are rolled back
   try{
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required');
        error.statusCode = 400;
        throw error;
    }
    
    //  check if the user already exists (email is stored in lowercase in the database)
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 409;
        throw error;
    }

    //Hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  create a new user (email will be automatically lowercased by the schema)
    const newUser = await User.create([{ name, email: email.toLowerCase().trim(), password: hashedPassword }], { session });
    const token = jwt.sign({ id: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, message: 'User created successfully', newUser, token });
   } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
   }
};

export const signIn = async (req, res, next) => {
    // implement the signin logic 
    try{
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.statusCode = 400;
            throw error;
        }
        
        // check if the user exists (email is stored in lowercase in the database)
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        // check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        // generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({ success: true, message: 'User signed in successfully', user, token });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    // implement the signout logic 
    try{
        const { email, password } = req.body;
    } catch (error) {
        next(error);
    }
};