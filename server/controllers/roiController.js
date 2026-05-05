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

        const users = await User.find({ packageId: { $exists: true } }).populate('packageId');
        let processedCount = 0;
        let totalDistributed = 0;

        const now = new Date();

        for (const user of users) {
            if (!user.packagePurchaseDate) continue;

            const purchaseDate = new Date(user.packagePurchaseDate);
            
            // Calculate months difference
            let monthsPassed = (now.getFullYear() - purchaseDate.getFullYear()) * 12;
            monthsPassed += now.getMonth() - purchaseDate.getMonth();

            // ROI starts from 3rd month
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
                roiAmount = roiSchedule.get(monthsPassed.toString()) || 0;
            }

            if (roiAmount > 0) {
                // Check if already paid for this calendar month
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const alreadyPaid = await Income.findOne({
                    userId: user._id,
                    incomeType: 'roi',
                    createdAt: { $gte: startOfMonth }
                });

                if (!alreadyPaid) {
                    user.roiIncome += roiAmount;
                    user.totalIncome += roiAmount;
                    await user.save();

                    await Income.create({
                        userId: user._id,
                        incomeType: 'roi',
                        amount: roiAmount,
                        level: 0 
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
        const minAmount = user.packageId.price === 111000 ? 10000 : 4000;
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

// Helper function to distribute level income based on ROI received by downline
const distributeLevelIncomeFromROI = async (sponsorId, fromUserId, roiAmount, level, pkg) => {
    if (level > 10) return;

    const sponsor = await User.findById(sponsorId);
    if (!sponsor) return;

    // Get percentage for this level from the package
    const levelPercentage = pkg.levelPercentages[level - 1] || 0;
    
    if (levelPercentage > 0) {
        const levelIncomeAmount = (roiAmount * levelPercentage) / 100;
        
        sponsor.levelIncome += levelIncomeAmount;
        sponsor.totalIncome += levelIncomeAmount;
        await sponsor.save();

        await Income.create({
            userId: sponsor._id,
            incomeType: 'level',
            amount: levelIncomeAmount,
            fromUser: fromUserId,
            level: level
        });
    }

    // Move to next level sponsor
    if (sponsor.referredBy) {
        await distributeLevelIncomeFromROI(sponsor.referredBy, fromUserId, roiAmount, level + 1, pkg);
    }
};

module.exports = { distributeMonthlyROI, setCustomROI };
