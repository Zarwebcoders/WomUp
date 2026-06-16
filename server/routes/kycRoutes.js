const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    submitKyc, 
    getKycStatus, 
    adminGetKycList, 
    adminReviewKyc 
} = require('../controllers/kycController');

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

const kycUploadFields = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'panCardPhoto', maxCount: 1 },
    { name: 'bankPassbookPhoto', maxCount: 1 }
]);

router.post('/submit', protect, kycUploadFields, submitKyc);
router.get('/status', protect, getKycStatus);

// Admin Routes
router.get('/admin/list', protect, admin, adminGetKycList);
router.put('/admin/review/:id', protect, admin, adminReviewKyc);

module.exports = router;
