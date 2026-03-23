const Shop = require('../models/Shop');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');

// @route POST /api/shops
// @desc Create a new shop
// @access Private

const createShop = async (req, res) => {
    try {
        const { shopName } = req.body;

        // Check if user already has a shop
        const existingShop = await Shop.findOne({ owner: req.user._id });
        if (existingShop) {
            return res.status(400).json({ message: "You already have a shop" });
        }

        // Generate unique shop ID
        const shopId = `shop_${nanoid(8)}`;

        // Generate QR Code (Points to customer upload page)
        const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(
            /\/$/,
            ''
        );
        const uploadUrl = `${clientUrl}/upload/${shopId}`;
        const qrCodeUrl = await QRCode.toDataURL(uploadUrl);

        // Create shop
        const shop = await Shop.create({
            shopName,
            owner: req.user._id,
            shopId,
            qrCodeUrl,
        });

        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/shops/me
// @desc Get current user's shop
// @access Private

const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });

        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/shops/shopId
// @desc Get shop by shopId 
// @access Public 

const getShopByShopId = async (req, res) => {
    try {
        const shop = await Shop.findOne({ shopId: req.params.shopId }).select(
            'shopName shopId'
        );

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/shops/settings
// @desc Update shop settings (autoDeleteHours)
// @access Private
const updateShopSettings = async (req, res) => {
    try {
      const { autoDeleteHours } = req.body;
  
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
  
      shop.settings = shop.settings || {};
      shop.settings.autoDeleteHours = Number(autoDeleteHours) || 24;
      await shop.save();
  
      res.json(shop);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { createShop, getMyShop, getShopByShopId, updateShopSettings };