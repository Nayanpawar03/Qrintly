const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        jobId: { type: String },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true, maxlength: 300 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
