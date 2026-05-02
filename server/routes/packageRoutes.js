const express = require('express');
const router = express.Router();
const { getPackages, buyPackage, getPackageRequests, getMyPackageRequests, updateRequestStatus } = require('../controllers/packageController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dir = 'uploads/slips/';
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        } catch (err) {
            console.log('Multer dir creation failed:', err.message);
        }
        cb(null, dir);
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.get('/', getPackages);
router.get('/my-requests', protect, getMyPackageRequests);
router.post('/buy', protect, upload.single('transactionSlip'), buyPackage);

// Admin Routes
router.get('/requests', protect, admin, getPackageRequests);
router.put('/requests/:id', protect, admin, updateRequestStatus);

module.exports = router;
