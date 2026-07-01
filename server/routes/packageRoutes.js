const express = require('express');
const router = express.Router();
const { getPackages, buyPackage, getPackageRequests, getMyPackageRequests, updateRequestStatus, getNotifications, getPackageRequestSlip } = require('../controllers/packageController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Use memory storage - no filesystem needed (works on Vercel)
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

router.get('/', getPackages);
router.get('/my-requests', protect, getMyPackageRequests);
router.get('/my-requests/:id/slip', protect, getPackageRequestSlip);
router.post('/buy', protect, upload.single('transactionSlip'), buyPackage);

// Admin Routes
router.get('/requests', protect, admin, getPackageRequests);
router.get('/requests/:id/slip', protect, admin, getPackageRequestSlip);
router.put('/requests/:id', protect, admin, updateRequestStatus);
router.get('/notifications', protect, admin, getNotifications);

module.exports = router;
