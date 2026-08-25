const User = require('../models/User');
const Package = require('../models/Package');
const Income = require('../models/Income');

// @desc    Distribute Monthly ROI
// @access  Internal/Admin
const distributeMonthlyROI = async (req, res) => {
    try {
        // Security check: Only allow Vercel Cron or Admin
        const isVercelCron = req.headers['x-vercel-cron'] === '1';
        const isAdmin = req.user && req.user.role === 'admin';

        if (!isVercelCron && !isAdmin && process.env.NODE_ENV === 'production') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Auto-delete users who registered but never activated within 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const deletedUnactivated = await User.deleteMany({
            isActive: false,
            role: 'user',
            createdAt: { $lt: thirtyDaysAgo }
        });
        if (deletedUnactivated.deletedCount > 0) {
            console.log(`🗑️  Auto-deleted ${deletedUnactivated.deletedCount} unactivated user(s) older than 30 days`);
        }

        const users = await User.find({ packageId: { $exists: true }, isActive: true }).populate('packageId');
        const now = new Date();
        let processedCount = 0;
        let totalDistributed = 0;

        for (const user of users) {
            if (!user.packagePurchaseDate) continue;

            const purchaseDate = new Date(user.packagePurchaseDate);

            let monthsPassed = (now.getFullYear() - purchaseDate.getFullYear()) * 12;
            monthsPassed += now.getMonth() - purchaseDate.getMonth();

            if (req.query.testMonth) {
                monthsPassed = Number(req.query.testMonth);
            } else {
                // Anniversary matching logic to ensure they are paid on their anniversary day
                // Or on the last day of the current month if they purchased on the last day of a month
                const purchaseDay = purchaseDate.getDate();
                const todayDay = now.getDate();
                const isLastDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() === todayDay;
                const isLastDayOfPurchaseMonth = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + 1, 0).getDate() === purchaseDay;

                let isAnniversaryDay = false;
                if (isLastDayOfPurchaseMonth) {
                    isAnniversaryDay = isLastDayOfCurrentMonth;
                } else {
                    const maxDaysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                    const targetDay = Math.min(purchaseDay, maxDaysInCurrentMonth);
                    isAnniversaryDay = (todayDay === targetDay);
                }

                if (!isAnniversaryDay) continue;
            }

            if (monthsPassed < 3) continue;

            const pkg = user.packageId;
            const roiSchedule = pkg.roiSchedule;

            // Determine ROI amount
            let roiAmount = 0;
            if (monthsPassed >= 8) {
                // Use Admin decided amount
                roiAmount = user.monthlyRoiAmount || 0;
            } else {
                // Use fixed schedule
                roiAmount = (roiSchedule.get(monthsPassed.toString()) || 0) * (user.packageQuantity || 1);
            }

            if (roiAmount > 0) {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                let alreadyPaid = false;

                if (req.query.testMonth) {
                    alreadyPaid = false;
                } else {
                    const paidThisMonth = await Income.findOne({
                        userId: user._id,
                        incomeType: 'roi',
                        createdAt: { $gte: startOfMonth }
                    });
                    alreadyPaid = !!paidThisMonth;
                }

                if (!alreadyPaid) {
                    const isVisible = require('../utils/visibilityUtils').isIncomeVisibleNow();
                    if (isVisible) {
                        user.roiIncome += roiAmount;
                        user.totalIncome += roiAmount;
                        await user.save();
                    }

                    await Income.create({
                        userId: user._id,
                        incomeType: 'roi',
                        amount: roiAmount,
                        level: 0,
                        showToUser: isVisible
                    });

                    // Distribute Level Income to upline
                    if (user.referredBy) {
                        await distributeLevelIncomeFromROI(user.referredBy, user._id, roiAmount, 1, pkg);
                    }

                    processedCount++;
                    totalDistributed += roiAmount;
                }
            }
        }

        // Response is optional if called by cron, but good for manual API pings
        if (res) {
            res.json({
                message: 'ROI distributed successfully',
                processedCount,
                totalDistributed
            });
        }
    } catch (error) {
        console.error('ROI Error:', error);
        if (res) res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Admin sets custom ROI for user (8th month onwards)
// @route   POST /api/roi/set-custom-roi
// @access  Admin
const setCustomROI = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const user = await User.findById(userId).populate('packageId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate minimums
        const minAmount = (user.packageId.price === 111000 ? 10000 : 4000) * (user.packageQuantity || 1);
        if (amount < minAmount) {
            return res.status(400).json({ message: `Minimum ROI for this package is ₹${minAmount}` });
        }

        user.monthlyRoiAmount = amount;
        await user.save();

        res.json({ message: `Monthly ROI for ${user.name} set to ₹${amount}`, user });
    } catch (error) {
        console.error('Set ROI Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper function to distribute level income based on ROI received by downline (Skips Inactive Users)
const distributeLevelIncomeFromROI = async (sponsorIdOrCode, fromUserId, roiAmount, level, pkg) => {
    if (level > 10) return;

    // If level is 1, check if the receiver (fromUserId) is an inactive distributer
    if (level === 1) {
        const buyer = await User.findById(fromUserId);
        if (buyer && buyer.role === 'distributer' && !buyer.isActive) {
            console.log(`Skipping ROI level income distribution: buyer ${buyer.userId} is an inactive distributer.`);
            return;
        }
    }

    // Search by referralCode or by _id (to support old data)
    const query = { $or: [{ referralCode: sponsorIdOrCode }] };
    if (require('mongoose').isValidObjectId(sponsorIdOrCode)) {
        query.$or.push({ _id: sponsorIdOrCode });
    }

    const sponsor = await User.findOne(query);
    if (!sponsor) return;

    let nextLevel = level;

    if (sponsor.isActive || sponsor.role === 'distributer') {
        // Get percentage for this level from the package
        const levelPercentage = pkg.levelPercentages[level - 1] || 0;

        if (levelPercentage > 0) {
            const levelIncomeAmount = (roiAmount * levelPercentage) / 100;

            const isVisible = require('../utils/visibilityUtils').isIncomeVisibleNow();
            if (isVisible) {
                sponsor.levelIncome += levelIncomeAmount;
                sponsor.totalIncome += levelIncomeAmount;
                await sponsor.save();
            }

            await Income.create({
                userId: sponsor._id,
                incomeType: 'level',
                amount: levelIncomeAmount,
                fromUser: fromUserId,
                level: level,
                showToUser: isVisible
            });
        }
        // Increment MLM level count only for active sponsors or distributors
        nextLevel = level + 1;
    } else {
        console.log(`Skipping inactive sponsor for ROI level: ${sponsor.userId || sponsor.name} at level ${level}`);
    }

    // Move to next level sponsor (always continue to upline if referredBy exists)
    const shouldContinue = sponsor.referredBy;
    if (shouldContinue) {
        await distributeLevelIncomeFromROI(sponsor.referredBy, fromUserId, roiAmount, nextLevel, pkg);
    }
};

module.exports = { distributeMonthlyROI, setCustomROI };
