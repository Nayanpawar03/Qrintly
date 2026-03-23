const Job = require('../models/Job');
const Shop = require('../models/Shop');
const cloudinary = require('../config/cloudinary');

// Helper : Upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            })
            .end(fileBuffer);
    });
};

// @route POST /api/jobs/:shopId
// @desc Create a new print job (customer upload)
// @access Public
const createJob = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { customerName, copies, color, pageSize, sided, notes } = req.body;

        // Find the shop
        const shop = await Shop.findOne({ shopId });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length == 0) {
            return res.status(400).json({ message: 'Please upload atleast one file ' });
        }

        // Upload files to Cloudinary 
        const uploadedFiles = [];
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, `qrintly/${shopId}`);
            uploadedFiles.push({
                originalName: file.originalname,
                url: result.secure_url,
                publicId: result.public_id,
                size: file.size,
            });
        }

        // Generate job ID (3-digit, resets daily per shop)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayJobCount = await Job.countDocuments({
            shop: shop._id,
            createdAt: { $gte: today },
        });

        const jobNumber = (todayJobCount + 1).toString().padStart(3, '0');
        const jobId = `#${jobNumber}`;

        // Calculate expiry time
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + shop.settings.autoDeleteHours);

        // Create Job
        const job = await Job.create({
            jobId,
            shop: shop._id,
            customerName: customerName || 'Guest',
            files: uploadedFiles,
            preferences: {
                copies: copies || 1,
                color: color || 'bw',
                pageSize: pageSize || 'A4',
                sided: sided || 'single',
            },
            notes,
            expiresAt,
        });

        res.status(201).json({
            messgae: 'Job Created Successfully',
            jobId: job.jobId,
            filesCount: uploadedFiles.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/jobs/:jobId/status
// @desc Update job status
// @access Private
const getJobs = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const jobs = await Job.find({ shop: shop._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/jobs/:jobId
// @desc Get single job details (for shop owner - marks as viewed)
// @access Private
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const job = await Job.findOne({ jobId, shop: shop._id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found ' });
        }

        // Auto-update status to "viewed" when owner first opens it
        if (job.status == 'uploaded') {
            job.status = 'viewed';
            job.viewedAt = new Date();
            await job.save();
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/jobs/track/:jobId
// @desc Track job status (for customers)
// @access Public
const trackJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findOne({ jobId }).select(
            'jobId status customerName createdAt viewedAt printingAt readyAt collectedAt preferences'
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/jobs/:jobId/status
// @desc Update job status (shop owner actions)
// @access Private
const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { jobId } = req.params;

        const validStatuses = ['printing', 'ready', 'collected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const job = await Job.findOne({ jobId, shop: shop._id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Update status and corresponding timestamp
        job.status = status;
        if (status === 'printing') job.printingAt = new Date();
        if (status === 'ready') job.readyAt = new Date();
        if (status === 'collected') job.collectedAt = new Date();

        await job.save();

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @router GET /api/jobs/analytics
// @desc Get dashboard analytics for shop owner
// @access Private
const getAnalytics = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [todayJobs, completed, total] = await Promise.all([
            Job.countDocuments({ shop: shop._id, createdAt: { $gte: today } }),
            Job.countDocuments({ shop: shop._id, status: { $in: ['ready', 'collected'] } }),
            Job.countDocuments({ shop: shop._id }),
        ]);

        res.json({ todayJobs, completed, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createJob, getJobs, getJobById, trackJob, updateJobStatus, getAnalytics };