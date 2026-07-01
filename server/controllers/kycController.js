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

        // Guard: check combined base64 size won't exceed MongoDB document limit (~16MB BSON)
        const totalSize = [profilePhoto, aadharFront, aadharBack, panCardPhoto, bankPassbookPhoto]
            .filter(Boolean)
            .reduce((sum, s) => sum + Buffer.byteLength(s, 'utf8'), 0);
        const MAX_DOC_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB safe limit
        if (totalSize > MAX_DOC_IMAGE_SIZE) {
            return res.status(400).json({ message: 'Total image size too large. Please upload smaller images (max ~2MB each).' });
        }

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

// @desc    Get KYC status (metadata only — NO images)
// @route   GET /api/kyc/status
// @access  Private
// PERF: Deliberately excludes all Base64 image fields (profilePhoto, aadharFront,
// aadharBack, panCardPhoto, bankPassbookPhoto). These fields can be up to 10MB
// combined and are not needed to show the KYC status banner or form state.
// Images are fetched separately via GET /api/kyc/images only when required.
const getKycStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select(
                'kyc.status kyc.rejectReason kyc.submittedAt ' +
                'kyc.aadharNumber kyc.panNumber ' +
                'kyc.bankHolderName kyc.bankName kyc.bankAccountNumber kyc.bankIfscCode'
            )
            .lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.kyc || { status: 'unsubmitted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get KYC document image previews (Base64) — lazy loaded
// @route   GET /api/kyc/images
// @access  Private
// Called ONLY when the user navigates to the KYC page and needs to see
// their already-uploaded document previews. Not fetched on every page load.
const getKycImages = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('kyc.profilePhoto kyc.aadharFront kyc.aadharBack kyc.panCardPhoto kyc.bankPassbookPhoto')
            .lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.kyc || {});
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users with pending KYC (Admin only)
// @route   GET /api/kyc/admin/list
// @access  Private/Admin
const adminGetKycList = async (req, res) => {
    try {
        // Exclude the heavy document scan base64 strings from the list view query
        const users = await User.find({ 'kyc.status': 'pending' })
            .select('name email userId mobile role kyc.status kyc.submittedAt kyc.profilePhoto kyc.aadharNumber kyc.panNumber');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single user KYC details with document scans (Admin only)
// @route   GET /api/kyc/admin/user/:id
// @access  Private/Admin
const adminGetKycDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email userId mobile kyc role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
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
    getKycImages,
    adminGetKycList,
    adminGetKycDetails,
    adminReviewKyc
};
