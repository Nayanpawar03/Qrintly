const express = require('express');
const router = express.Router();
const https = require('https');
const {
    createJob,
    getJobs,
    getJobById,
    trackJob,
    updateJobStatus,
    getAnalytics,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.post('/:shopId', upload.array('files', 10), createJob);
router.get('/track/:jobId', trackJob);

// PDF proxy — streams Cloudinary file with correct headers for browser rendering
router.get('/proxy', protect, (req, res) => {
    const { url } = req.query;
    if (!url || !url.startsWith('https://res.cloudinary.com')) {
        return res.status(400).json({ message: 'Invalid URL' });
    }

    https.get(url, (stream) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        stream.pipe(res);
    }).on('error', () => res.status(500).json({ message: 'Failed to fetch file' }));
});

// Private routes (shop owner)
router.get('/', protect, getJobs);
router.get('/analytics', protect, getAnalytics);
router.get('/:jobId', protect, getJobById);
router.patch('/:jobId/status', protect, updateJobStatus);

module.exports = router;