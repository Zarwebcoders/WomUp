const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, verifyReferral } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/verify-referral/:code', verifyReferral);

module.exports = router;
