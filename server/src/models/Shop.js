const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
    {
        shopName: {
            type: String,
            required: [true, 'Shop name is required'],
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        shopId: {
            type: String,
            unique: true,
            required: true,
        },
        qrCodeUrl: {
            type: String,
        },
        settings: {
            autoDeleteHours: {
                type: Number,
                default: 24,
            },
        },
        jobCounter: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Shop', shopSchema);