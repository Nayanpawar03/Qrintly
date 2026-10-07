const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const { register, login, updateProfile, updatePassword } = require('../controllers/authController');

// Email-Password routes
router.post('/register', register);
router.post('/login', login);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, updatePassword);
router.get('/me', protect, (req, res) => {
    const u = req.user;
    res.json({ _id: u._id, name: u.name, email: u.email, phone: u.phone, avatar: u.avatar });
});

// Avatar upload
router.patch('/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'qrintly/avatars', resource_type: 'image' },
                (error, result) => { if (error) reject(error); else resolve(result); }
            ).end(req.file.buffer);
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: result.secure_url },
            { new: true }
        );

        res.json({ avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google OAuth routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        //Generate JWT
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
);

module.exports = router;