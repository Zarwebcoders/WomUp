const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, verifyReferral, getAllUsers, getUserDetails, updateUserStatus, impersonateUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/verify-referral/:code', verifyReferral);

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserDetails);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.post('/users/:id/impersonate', protect, admin, impersonateUser);

module.exports = router;
