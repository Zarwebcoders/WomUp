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
    const { packageId, transactionId } = req.body;
    const transactionSlip = req.file ? req.file.path : null;

    if (!transactionId || !transactionSlip) {
        return res.status(400).json({ message: 'Transaction ID and Slip are required' });
    }

    const user = await User.findById(req.user._id);
    if (user.packageId) {
        return res.status(400).json({ message: 'User already has an active package' });
    }

    // Check if there is already a pending request
    const pendingRequest = await PackageRequest.findOne({ userId: req.user._id, status: 'pending' });
    if (pendingRequest) {
        return res.status(400).json({ message: 'You already have a pending request' });
    }

    const request = await PackageRequest.create({
        userId: req.user._id,
        packageId,
        transactionId,
        transactionSlip
    });

    res.status(201).json({ message: 'Purchase request submitted successfully', request });
};

// @desc    Get all package requests (Admin)
// @route   GET /api/packages/requests
// @access  Admin
const getPackageRequests = async (req, res) => {
    const requests = await PackageRequest.find({}).populate('userId', 'name email').populate('packageId', 'packageName price');
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
        await user.save();

        // 1. Distribute Referral Income (up the Sponsor Chain)
        if (user.sponsorId) {
            await distributeReferralIncomes(user.sponsorId, user._id, pkg, 1);
        }

        // 2. Distribute Level Income (up the Placement Chain)
        if (user.referredBy) {
            await distributeLevelIncomes(user.referredBy, user._id, pkg, 1);
        }
    }

    res.json({ message: `Request ${status} successfully` });
};

// Helper to distribute fixed referral income up the sponsor chain
const distributeReferralIncomes = async (sponsorId, fromUserId, pkg, level) => {
    if (level > 10) return;

    const sponsor = await User.findById(sponsorId);
    if (!sponsor) return;

    const refAmount = pkg.referralAmounts[level - 1] || 0;
    if (refAmount > 0) {
        sponsor.referralIncome += refAmount;
        sponsor.totalIncome += refAmount;
        await sponsor.save();
        
        await Income.create({
            userId: sponsor._id,
            incomeType: 'referral',
            amount: refAmount,
            fromUser: fromUserId,
            level: level
        });
    }

    if (sponsor.sponsorId) {
        await distributeReferralIncomes(sponsor.sponsorId, fromUserId, pkg, level + 1);
    }
};

// Helper to distribute percentage level income up the placement chain
const distributeLevelIncomes = async (parentId, fromUserId, pkg, level) => {
    if (level > 10) return;

    const parent = await User.findById(parentId);
    if (!parent) return;

    const levelPercentage = pkg.levelPercentages[level - 1] || 0;
    if (levelPercentage > 0) {
        const levelAmount = (pkg.price * levelPercentage) / 100;
        parent.levelIncome += levelAmount;
        parent.totalIncome += levelAmount;
        await parent.save();

        await Income.create({
            userId: parent._id,
            incomeType: 'level',
            amount: levelAmount,
            fromUser: fromUserId,
            level: level
        });
    }

    if (parent.referredBy) {
        await distributeLevelIncomes(parent.referredBy, fromUserId, pkg, level + 1);
    }
};

module.exports = { getPackages, buyPackage, getPackageRequests, getMyPackageRequests, updateRequestStatus };
