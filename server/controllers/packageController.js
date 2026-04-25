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

        // Distribute Incomes up to 10 levels
        if (user.referredBy) {
            await distributeIncomes(user.referredBy, user._id, pkg, 1);
        }
    }

    res.json({ message: `Request ${status} successfully` });
};

// Helper function to distribute fixed referral and percentage level income
const distributeIncomes = async (sponsorId, fromUserId, pkg, level) => {
    if (level > 10) return;

    const sponsor = await User.findById(sponsorId);
    if (!sponsor) return;

    // 1. Referral Income (Fixed Amount)
    const refAmount = pkg.referralAmounts[level - 1] || 0;
    if (refAmount > 0) {
        sponsor.referralIncome += refAmount;
        sponsor.totalIncome += refAmount;
        
        await Income.create({
            userId: sponsorId,
            incomeType: 'referral',
            amount: refAmount,
            fromUser: fromUserId,
            level: level
        });
    }

    // 2. Level Income (Percentage of Package Price)
    const levelPercentage = pkg.levelPercentages[level - 1] || 0;
    if (levelPercentage > 0) {
        const levelAmount = (pkg.price * levelPercentage) / 100;
        sponsor.levelIncome += levelAmount;
        sponsor.totalIncome += levelAmount;

        await Income.create({
            userId: sponsorId,
            incomeType: 'level',
            amount: levelAmount,
            fromUser: fromUserId,
            level: level
        });
    }

    await sponsor.save();

    // Move to next level sponsor
    if (sponsor.referredBy) {
        await distributeIncomes(sponsor.referredBy, fromUserId, pkg, level + 1);
    }
};

module.exports = { getPackages, buyPackage, getPackageRequests, getMyPackageRequests, updateRequestStatus };
