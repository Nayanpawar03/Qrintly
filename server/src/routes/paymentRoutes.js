const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const Subscription = require('../models/Subscription');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_PRICES = {
    basic: { monthly: 49900, yearly: 39900 },
    pro: { monthly: 99900, yearly: 79900 },
    enterprise: { monthly: 199900, yearly: 159900 },
};

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
    try {
        const { plan, billing = 'monthly' } = req.body;

        if (!PLAN_PRICES[plan]) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        const amount = PLAN_PRICES[plan][billing];

        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: { plan, billing, userId: req.user._id.toString() },
        });

        res.json({ orderId: order.id, amount, currency: 'INR', plan, billing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify payment and activate subscription
router.post('/verify', protect, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billing } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Calculate end date
        const endDate = new Date();
        if (billing === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Save subscription
        const subscription = await Subscription.create({
            user: req.user._id,
            plan,
            billing,
            status: 'active',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amount: req.body.amount,
            endDate,
        });

        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user's active subscription
router.get('/subscription', protect, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user._id,
            status: 'active',
            endDate: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        res.json(subscription || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
