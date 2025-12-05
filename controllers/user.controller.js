import User from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try{
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};