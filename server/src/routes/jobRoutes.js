const express = require('express');
const router = express.Router();
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

// Private routes (shop owner)
router.get('/', protect, getJobs);
router.get('/analytics', protect, getAnalytics);
router.get('/:jobId', protect, getJobById);
router.patch('/:jobId/status', protect, updateJobStatus);

module.exports = router;