const User = require('../models/User');

// @desc    Submit KYC details
// @route   POST /api/kyc/submit
// @access  Private
const submitKyc = async (req, res) => {
    try {
        const userId = req.user._id;
        const { 
            aadharNumber, 
            panNumber, 
            bankHolderName, 
            bankName, 
            bankAccountNumber, 
            bankIfscCode 
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Helper to convert file to base64
        const fileToBase64 = (fileField) => {
            if (req.files && req.files[fileField] && req.files[fileField][0]) {
                const file = req.files[fileField][0];
                return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            }
            return null;
        };

        const profilePhoto = fileToBase64('profilePhoto') || user.kyc?.profilePhoto;
        const aadharFront = fileToBase64('aadharFront') || user.kyc?.aadharFront;
        const aadharBack = fileToBase64('aadharBack') || user.kyc?.aadharBack;
        const panCardPhoto = fileToBase64('panCardPhoto') || user.kyc?.panCardPhoto;
        const bankPassbookPhoto = fileToBase64('bankPassbookPhoto') || user.kyc?.bankPassbookPhoto;

        user.kyc = {
            status: 'pending',
            submittedAt: new Date(),
            rejectReason: '',
            profilePhoto,
            aadharNumber,
            aadharFront,
            aadharBack,
            panNumber,
            panCardPhoto,
            bankHolderName,
            bankName,
            bankAccountNumber,
            bankIfscCode,
            bankPassbookPhoto
        };

        await user.save();
        res.json({ message: 'KYC submitted successfully and is pending review.', user });
    } catch (error) {
        console.error('KYC Submit Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private
const getKycStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('kyc');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.kyc || { status: 'unsubmitted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users with pending KYC (Admin only)
// @route   GET /api/kyc/admin/list
// @access  Private/Admin
const adminGetKycList = async (req, res) => {
    try {
        const users = await User.find({ 'kyc.status': 'pending' }).select('name email userId mobile kyc role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Review KYC (Admin only)
// @route   PUT /api/kyc/admin/review/:id
// @access  Private/Admin
const adminReviewKyc = async (req, res) => {
    try {
        const { status, rejectReason } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.kyc.status = status;
        if (status === 'rejected') {
            user.kyc.rejectReason = rejectReason || 'Documents verification failed';
        } else {
            user.kyc.rejectReason = '';
        }

        await user.save();
        res.json({ message: `KYC request ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitKyc,
    getKycStatus,
    adminGetKycList,
    adminReviewKyc
};
