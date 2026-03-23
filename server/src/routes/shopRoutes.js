const express = require('express');
const router = express.Router();
const { createShop, getMyShop, getShopByShopId, updateShopSettings } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

// Private routes (require login) 
router.post('/', protect, createShop);
router.get('/me', protect, getMyShop);
router.patch('/settings', protect, updateShopSettings);

// Public route (for customers scanning QR)
router.get('/:shopId', getShopByShopId);

module.exports = router;