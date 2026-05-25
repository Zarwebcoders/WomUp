const Package = require('../models/Package');
const User = require('../models/User');
const Income = require('../models/Income');
const PackageRequest = require('../models/PackageRequest');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
    const packages = await Package.find({});
    res.json(packages);
};

// @desc    Submit a package purchase request
// @route   POST /api/packages/buy
// @access  Private
const buyPackage = async (req, res) => {
    try {
        const { packageId, transactionId } = req.body;

        if (!transactionId || !req.file) {
            return res.status(400).json({ message: 'Transaction ID and Slip are required' });
        }

        // Convert image buffer to Base64 string (no filesystem needed)
        const mimeType = req.file.mimetype;
        const base64Image = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;

        const request = await PackageRequest.create({
            userId: req.user._id,
            packageId,
            transactionId,
            transactionSlip: base64Image
        });

        res.status(201).json({ message: 'Purchase request submitted successfully', request });
    } catch (error) {
        console.error('Purchase Request Error:', error);
        res.status(500).json({ message: error.message || 'Error submitting purchase request' });
    }
};

// @desc    Get all package requests (Admin)
// @route   GET /api/packages/requests
// @access  Admin
const getPackageRequests = async (req, res) => {
    const requests = await PackageRequest.find({}).populate('userId', 'name email userId').populate('packageId', 'packageName price');
    res.json(requests);
};

// @desc    Get current user's package requests
// @route   GET /api/packages/my-requests
// @access  Private
const getMyPackageRequests = async (req, res) => {
    const requests = await PackageRequest.find({ userId: req.user._id })
        .populate('packageId', 'packageName price')
        .sort({ createdAt: -1 });
    res.json(requests);
};

// @desc    Approve/Reject package request (Admin)
// @route   PUT /api/packages/requests/:id
// @access  Admin
const updateRequestStatus = async (req, res) => {
    const { status } = req.body;
    const requestId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await PackageRequest.findById(requestId);
    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Request is already processed' });
    }

    request.status = status;
    request.updatedAt = new Date();
    await request.save();

    if (status === 'approved') {
        const user = await User.findById(request.userId);
        const pkg = await Package.findById(request.packageId);

        user.packageId = request.packageId;
        user.packagePurchaseDate = new Date();
        user.isActive = true;
        user.activatedAt = new Date();
        user.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await user.save();

        // Distribute Incomes up to 10 levels
        if (user.referredBy) {
            await distributeIncomes(user.referredBy, user._id, pkg, 1);
        }
    }

    res.json({ message: `Request ${status} successfully` });
};

// Helper function to distribute fixed referral income only (Skips Inactive Users)
const distributeIncomes = async (sponsorIdOrCode, fromUserId, pkg, level) => {
    if (level > 10) return;

    // Search by referralCode or by _id (to support old data)
    const query = { $or: [{ referralCode: sponsorIdOrCode }] };
    if (require('mongoose').isValidObjectId(sponsorIdOrCode)) {
        query.$or.push({ _id: sponsorIdOrCode });
    }

    const sponsor = await User.findOne(query);
    if (!sponsor) return;

    let nextLevel = level;

    if (sponsor.isActive) {
        // Referral Income (Fixed Amount) only
        const refAmount = pkg.referralAmounts[level - 1] || 0;
        if (refAmount > 0) {
            sponsor.referralIncome += refAmount;
            sponsor.totalIncome += refAmount;
            
            await Income.create({
                userId: sponsor._id, // Must be the sponsor's ObjectId!
                incomeType: 'referral',
                amount: refAmount,
                fromUser: fromUserId,
                level: level
            });

            await sponsor.save();
        }
        // Increment MLM level count only for active sponsors
        nextLevel = level + 1;
    } else {
        console.log(`Skipping inactive sponsor ${sponsor.userId || sponsor.name} at level ${level}`);
    }

    // Move to next level sponsor
    if (sponsor.referredBy) {
        await distributeIncomes(sponsor.referredBy, fromUserId, pkg, nextLevel);
    }
};

// @desc    Get recent pending package requests as notifications (Admin)
// @route   GET /api/packages/notifications
// @access  Admin
const getNotifications = async (req, res) => {
    try {
        // Return last 20 pending requests sorted newest first
        const notifications = await PackageRequest.find({ status: 'pending' })
            .populate('userId', 'name email referralCode mobile')
            .populate('packageId', 'packageName price')
            .sort({ createdAt: -1 })
            .limit(20);

        const count = await PackageRequest.countDocuments({ status: 'pending' });

        res.json({ notifications, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPackages, buyPackage, getPackageRequests, getMyPackageRequests, updateRequestStatus, getNotifications };
