const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            unique: true,
            required: true,
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            reuired: true,
        },
        customerName: {
            type: String,
            trim: true,
            default: 'Guest',
        },
        files: [
            {
                originalName: String,
                url: String,
                publicId: String,
                size: Number,
            },
        ],
        preferences: {
            copies: {
                type: Number,
                default: 1,
                min: 1,
            },
            color: {
                type: String,
                enum: ['bw', 'color'],
                default: 'bw',
            },
            pageSize: {
                type: String,
                enum: ['A4', 'A3', 'Letter', 'Legal'],
                default: 'A4',
            },
            sided: {
                type: String,
                enum: ['single', 'double'],
                default: 'single',
            },
        },
        notes: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['uploaded', 'viewed', 'printing', 'ready', 'collected', 'expired'],
            default: 'uploaded',
        },
        viewedAt: {
            type: Date,
        },
        printingAt: {
            type: Date,
        },
        readyAt: {
            type: Date,
        },
        collectedAt: {
            type: Date,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Job', jobSchema);