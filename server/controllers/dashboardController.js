const mongoose = require('mongoose');
const User = require('../models/User');
const Income = require('../models/Income');
const PackageRequest = require('../models/PackageRequest');
const Package = require('../models/Package');
const cache = require('../utils/dashboardCache');

// Cache TTL for dashboard responses (seconds)
const DASHBOARD_CACHE_TTL = 60;

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
const getDashboardSummary = async (req, res) => {
    try {
        const { period } = req.query;
        const monthsCount = period === 'year' ? 12 : 6;

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // ─── CACHE CHECK ───────────────────────────────────────────────────────────
        // Cache key is scoped per user and period. TTL = 60 seconds.
        const cacheKey = cache.buildKey(req.user._id.toString(), period || '6months');
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            console.log(`[dashboard] Cache HIT for ${cacheKey}`);
            return res.json(cachedResponse);
        }
        console.log(`[dashboard] Cache MISS for ${cacheKey} — querying DB`);
        // ──────────────────────────────────────────────────────────────────────────

        if (req.user.role === 'admin') {
            // Calculate Platform Growth (Approved Purchases) start date
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - (monthsCount - 1));
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);

            console.log('--- ADMIN DASHBOARD QUERIES STARTED ---');
            console.time('admin_dashboard_queries_total');

            // Run all independent queries concurrently to minimize Atlas latency
            const [
                totalUsers,
                pendingRequests,
                revenueResult,
                recentActivities,
                platformGrowth
            ] = await Promise.all([
                (async () => {
                    console.time('Q1: admin_total_users');
                    const res = await User.countDocuments({ role: 'user' });
                    console.timeEnd('Q1: admin_total_users');
                    return res;
                })(),
                (async () => {
                    console.time('Q2: admin_pending_requests');
                    const res = await PackageRequest.countDocuments({ status: 'pending' });
                    console.timeEnd('Q2: admin_pending_requests');
                    return res;
                })(),
                (async () => {
                    console.time('Q3: admin_total_revenue');
                    const res = await PackageRequest.aggregate([
                        { $match: { status: 'approved' } },
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
                                _id: null,
                                totalRevenue: { $sum: '$pkg.price' }
                            }
                        }
                    ]);
                    console.timeEnd('Q3: admin_total_revenue');
                    return res;
                })(),
                (async () => {
                    console.time('Q4: admin_recent_activities');
                    // Use aggregation instead of find+populate to avoid separate round-trips.
                    // $sort+$limit first (uses { createdAt: -1 } index), then $lookup only 5 docs.
                    const res = await PackageRequest.aggregate([
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'userInfo',
                                pipeline: [{ $project: { name: 1 } }]
                            }
                        },
                        {
                            $lookup: {
                                from: 'packages',
                                localField: 'packageId',
                                foreignField: '_id',
                                as: 'packageInfo',
                                pipeline: [{ $project: { packageName: 1 } }]
                            }
                        },
                        {
                            $project: {
                                userId: { $arrayElemAt: ['$userInfo', 0] },
                                packageId: { $arrayElemAt: ['$packageInfo', 0] },
                                createdAt: 1,
                                status: 1
                            }
                        }
                    ]);
                    console.timeEnd('Q4: admin_recent_activities');
                    return res;
                })(),
                (async () => {
                    console.time('Q5: admin_platform_growth');
                    const res = await PackageRequest.aggregate([
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
                    console.timeEnd('Q5: admin_platform_growth');
                    return res;
                })()
            ]);

            console.timeEnd('admin_dashboard_queries_total');

            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const chartLabels = [];
            const chartData = [];

            // Build chart data — precompute current date once outside loop
            const now = new Date();
            for (let i = 0; i < monthsCount; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1 - i), 1);
                const monthName = months[date.getMonth()];
                const monthNum = date.getMonth() + 1;
                const yearNum = date.getFullYear();

                chartLabels.push(monthName);
                const dataPoint = platformGrowth.find(m => m._id.month === monthNum && m._id.year === yearNum);
                chartData.push(dataPoint ? dataPoint.total : 0);
            }

            const responseData = {
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
            };

            // Cache the response before sending
            cache.set(cacheKey, responseData, DASHBOARD_CACHE_TTL);

            return res.json(responseData);
        }

        // ─── USER DASHBOARD ────────────────────────────────────────────────────────

        // Calculate Monthly Income for Chart start date
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (monthsCount - 1));
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        console.log('--- USER DASHBOARD QUERIES STARTED ---');
        console.time('user_dashboard_queries_total');

        // NOTE: req.user is already populated by authMiddleware.protect (with the exact
        // same select fields). Reusing it here eliminates a redundant DB round-trip (was Q1).
        // The user object from lean() middleware is a plain JS object — identical shape.
        const userObjectId = new mongoose.Types.ObjectId(req.user._id);

        // Run all independent queries concurrently to minimize Atlas latency
        const [
            directReferrals,
            recentActivities,
            monthlyIncome,
            monthlyInvestment,
            userDoc
        ] = await Promise.all([
            (async () => {
                return await User.findById(req.user._id)
                    .select('packageId isActive expiresAt')
                    .populate('packageId', 'packageName')
                    .lean();
            })(),
            (async () => {
                console.time('Q1: user_direct_referrals_count');
                const res = await User.countDocuments({
                    $or: [
                        { referredBy: req.user._id },
                        { referredBy: req.user.referralCode }
                    ]
                });
                console.timeEnd('Q1: user_direct_referrals_count');
                return res;
            })(),
            (async () => {
                console.time('Q2: user_recent_activities');
                // .lean() avoids Mongoose document hydration overhead
                const res = await Income.find({ userId: req.user._id })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('fromUser', 'name')
                    .lean();
                console.timeEnd('Q2: user_recent_activities');
                return res;
            })(),
            (async () => {
                console.time('Q3: user_monthly_income_agg');
                const res = await Income.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
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
                console.timeEnd('Q3: user_monthly_income_agg');
                return res;
            })(),
            (async () => {
                console.time('Q4: user_monthly_investment_agg');
                const res = await PackageRequest.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
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
                console.timeEnd('Q4: user_monthly_investment_agg');
                return res;
            })()
        ]);

        console.timeEnd('user_dashboard_queries_total');

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartLabels = [];
        const incomeData = [];
        const investmentData = [];

        // Build chart data — precompute current date once outside loop
        const now = new Date();
        for (let i = 0; i < monthsCount; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1 - i), 1);
            const monthName = months[date.getMonth()];
            const monthNum = date.getMonth() + 1;
            const yearNum = date.getFullYear();

            chartLabels.push(monthName);

            const inc = monthlyIncome.find(m => m._id.month === monthNum && m._id.year === yearNum);
            incomeData.push(inc ? inc.total : 0);

            const inv = monthlyInvestment.find(m => m._id.month === monthNum && m._id.year === yearNum);
            investmentData.push(inv ? inv.total : 0);
        }

        const responseData = {
            // Reuse req.user but merge populated packageId details from userDoc
            user: {
                ...req.user,
                packageId: userDoc?.packageId,
                isActive: userDoc?.isActive,
                expiresAt: userDoc?.expiresAt
            },
            directReferrals,
            recentActivities,
            chartLabels,
            chartData: incomeData, // Keep this for backward compatibility if frontend expects it
            incomeData,
            investmentData
        };

        // Cache the response before sending
        cache.set(cacheKey, responseData, DASHBOARD_CACHE_TTL);

        res.json(responseData);

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardSummary };
