const mongoose = require('mongoose');
const User = require('../models/User');
const Income = require('../models/Income');
const PackageRequest = require('../models/PackageRequest');
const Package = require('../models/Package');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
const getDashboardSummary = async (req, res) => {
    try {
        const { period } = req.query;
        const monthsCount = period === 'year' ? 12 : 6;

        if (req.user.role === 'admin') {
            const totalUsers = await User.countDocuments({ role: 'user' });
            const pendingRequests = await PackageRequest.countDocuments({ status: 'pending' });
            
            // Calculate total revenue from approved requests
            const approvedRequests = await PackageRequest.find({ status: 'approved' }).populate('packageId');
            const totalRevenue = approvedRequests.reduce((acc, curr) => acc + (curr.packageId?.price || 0), 0);

            // Recent global activities
            const recentActivities = await PackageRequest.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name')
                .populate('packageId', 'packageName');

            // Calculate Platform Growth (Approved Purchases)
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - (monthsCount - 1));
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);

            const platformGrowth = await PackageRequest.aggregate([
                {
                    $match: {
                        status: 'approved',
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $lookup: {
                        from: 'packages',
                        localField: 'packageId',
                        foreignField: '_id',
                        as: 'pkg'
                    }
                },
                { $unwind: '$pkg' },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        total: { $sum: "$pkg.price" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const chartLabels = [];
            const chartData = [];

            for (let i = 0; i < monthsCount; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - (monthsCount - 1 - i));
                const monthName = months[date.getMonth()];
                const monthNum = date.getMonth() + 1;
                const yearNum = date.getFullYear();

                chartLabels.push(monthName);
                const dataPoint = platformGrowth.find(m => m._id.month === monthNum && m._id.year === yearNum);
                chartData.push(dataPoint ? dataPoint.total : 0);
            }

            return res.json({
                isAdmin: true,
                totalUsers,
                pendingRequests,
                totalRevenue,
                chartLabels,
                chartData,
                recentActivities: recentActivities.map(act => ({
                    fromUser: act.userId,
                    incomeType: 'purchase',
                    amount: act.packageId?.packageName || 'Unknown',
                    createdAt: act.createdAt,
                    status: act.status
                }))
            });
        }

        const user = await User.findById(req.user._id).populate('packageId');
        const directReferrals = await User.countDocuments({ referredBy: req.user._id });
        
        const recentActivities = await Income.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('fromUser', 'name');

        // Calculate Monthly Income for Chart
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (monthsCount - 1));
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        // Aggregate Monthly Income
        const monthlyIncome = await Income.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user._id),
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Aggregate Monthly Investment (Approved Package Purchases)
        const monthlyInvestment = await PackageRequest.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user._id),
                    status: 'approved',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'pkg'
                }
            },
            { $unwind: '$pkg' },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    total: { $sum: "$pkg.price" }
                }
            }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartLabels = [];
        const incomeData = [];
        const investmentData = [];

        for (let i = 0; i < monthsCount; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - (monthsCount - 1 - i));
            const monthName = months[date.getMonth()];
            const monthNum = date.getMonth() + 1;
            const yearNum = date.getFullYear();

            chartLabels.push(monthName);
            
            const inc = monthlyIncome.find(m => m._id.month === monthNum && m._id.year === yearNum);
            incomeData.push(inc ? inc.total : 0);

            const inv = monthlyInvestment.find(m => m._id.month === monthNum && m._id.year === yearNum);
            investmentData.push(inv ? inv.total : 0);
        }

        res.json({
            user,
            directReferrals,
            recentActivities,
            chartLabels,
            chartData: incomeData, // Keep this for backward compatibility if frontend expects it
            incomeData,
            investmentData
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardSummary };
