import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'], // contact@example.com
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength: 6,
        
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;