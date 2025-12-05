import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min:  [0, 'Subscription price must be greater than 0'],
       
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: [true, 'Subscription frequency is required'],
    },
    category: {
        type: String,
        enum: ['food', 'transport', 'housing', 'utilities', 'entertainment', 'health', 'education', 'technology', 'other'],
        required: [true, 'Subscription category is required'],
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, 'Subscription payment method is required'],
    },
   
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past or present'
        },
    },
    renewalDate: {
        type: Date,
        required: [true, 'Subscription renewal date is required'],
        validate: { 
            validator: function(value) { 
                return value > this.startDate; 
            }, 
            message: 'Renewal date must be after start date' 
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Subscription user is required'],
        index: true,
    },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;