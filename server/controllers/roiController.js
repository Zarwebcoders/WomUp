const User = require('../models/User');
const Package = require('../models/Package');
const Income = require('../models/Income');

// @desc    Distribute Monthly ROI
// @access  Internal/Admin
const distributeMonthlyROI = async (req, res) => {
    try {
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

            // ROI starts from 3rd month (Month 0: purchase, Month 1: skip, Month 2: skip, Month 3: start)
            if (monthsPassed < 3) continue;

            const pkg = user.packageId;
            const roiSchedule = pkg.roiSchedule;

            // Determine ROI amount
            let roiAmount = 0;
            if (monthsPassed >= 8) {
                roiAmount = roiSchedule.get("8");
            } else {
                roiAmount = roiSchedule.get(monthsPassed.toString()) || 0;
            }

            if (roiAmount > 0) {
                // Check if already paid for this specific month (simplified check for demo)
                // In production, we'd check if an ROI Income record exists for this user in this calendar month
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
                        level: 0 // Personal ROI
                    });

                    processedCount++;
                    totalDistributed += roiAmount;
                }
            }
        }

        res.json({
            message: 'ROI distributed successfully',
            processedCount,
            totalDistributed
        });
    } catch (error) {
        console.error('ROI Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { distributeMonthlyROI };
