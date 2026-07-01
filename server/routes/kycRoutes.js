const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    submitKyc, 
    getKycStatus, 
    getKycImages,
    adminGetKycList, 
    adminGetKycDetails,
    adminReviewKyc 
} = require('../controllers/kycController');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit per file
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Each image must be under 2MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ message: err.message || 'File upload failed.' });
    }
    next();
};

const kycUploadFields = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'panCardPhoto', maxCount: 1 },
    { name: 'bankPassbookPhoto', maxCount: 1 }
]);

router.post('/submit', protect, (req, res, next) => {
    kycUploadFields(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        next();
    });
}, submitKyc);
router.get('/status', protect, getKycStatus);
// Images fetched lazily — only when user navigates to KYC page and has already submitted
router.get('/images', protect, getKycImages);

// Admin Routes
router.get('/admin/list', protect, admin, adminGetKycList);
router.get('/admin/user/:id', protect, admin, adminGetKycDetails);
router.put('/admin/review/:id', protect, admin, adminReviewKyc);

module.exports = router;
