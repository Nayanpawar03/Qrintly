const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        plan: {
            type: String,
            enum: ['basic', 'pro', 'enterprise'],
            required: true,
        },
        billing: {
            type: String,
            enum: ['monthly', 'yearly'],
            default: 'monthly',
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        amount: { type: Number },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
