const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
    try {
        const { jobId, rating, comment } = req.body;
        if (!rating) return res.status(400).json({ message: 'Rating is required' });

        const feedback = await Feedback.create({ jobId, rating, comment });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
