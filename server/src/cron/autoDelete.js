const cron = require('node-cron');
const Job = require('../models/Job');
const cloudinary = require('../config/cloudinary');

const startAutoDeleteCron = () => {
    // Runs every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Running auto-delete check...');

        try {
            // Find expired jobs that haven't been marked expired yet
            const expiredJobs = await Job.find({
                expiresAt: { $lte: new Date() },
                status: { $ne: 'expired' },
            });

            if (expiredJobs.length === 0) {
                console.log('[Cron] No expired jobs found.');
                return;
            }

            for (const job of expiredJobs) {
                // Delete each file from Cloudinary
                for (const file of job.files) {
                    try {
                        await cloudinary.uploader.destroy(file.publicId, {
                            resource_type: 'raw',
                        });
                    } catch (err) {
                        console.error(`[Cron] Failed to delete file ${file.publicId}:`, err.message);
                    }
                }

                // Mark job as expired
                job.status = 'expired';
                job.files = []; // clear file references since they're deleted
                await job.save();
            }

            console.log(`[Cron] Cleaned up ${expiredJobs.length} expired job(s).`);
        } catch (error) {
            console.error('[Cron] Auto-delete error:', error.message);
        }
    });

    console.log('[Cron] Auto-delete job scheduled (every hour).');
};

module.exports = startAutoDeleteCron;