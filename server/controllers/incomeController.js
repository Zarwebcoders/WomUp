const User = require('../models/User');
const Income = require('../models/Income');
const Package = require('../models/Package');

// @desc    Get income logs by type
// @route   GET /api/income/:type
// @access  Private
const getIncomeLogs = async (req, res) => {
    try {
        const { type } = req.params; // referral, level, roi
        const { search } = req.query;

        let query = { 
            userId: req.user._id,
            incomeType: type,
            showToUser: { $ne: false }
        };

        if (search) {
            // Find users matching search term to filter by fromUser
            const matchingUsers = await User.find({ 
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = matchingUsers.map(u => u._id);

            query.$or = [
                { fromUser: { $in: userIds } }
            ];

            // If search is a number, also search by amount
            if (!isNaN(search)) {
                query.$or.push({ amount: Number(search) });
            }
        }
        
        const logs = await Income.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'fromUser',
                select: 'name referralCode packageId',
                populate: {
                    path: 'packageId',
                    select: 'packageName price referralAmounts levelPercentages'
                }
            });
        
        // Helper to recursively construct level map skipping inactive users
        const buildLevelMap = async (currentUser, currentLevel, levelMap, maxLevel = 10) => {
            if (currentLevel > maxLevel) return;

            const query = {
                $or: [
                    { referredBy: currentUser.referralCode },
                    { referredBy: currentUser._id }
                ]
            };
            const referrals = await User.find(query).select('referralCode _id isActive');

            for (const ref of referrals) {
                if (ref.isActive) {
                    levelMap[ref.referralCode] = currentLevel;
                    await buildLevelMap(ref, currentLevel + 1, levelMap, maxLevel);
                } else {
                    // Do not count/increment level for inactive user (No Package), but still display/map them at currentLevel
                    levelMap[ref.referralCode] = currentLevel;
                    await buildLevelMap(ref, currentLevel, levelMap, maxLevel);
                }
            }
        };

        const levelMap = {};
        await buildLevelMap(req.user, 1, levelMap, 10);

        const processedLogs = logs.map(log => {
            const logObj = log.toObject();
            if (logObj.fromUser && logObj.fromUser.referralCode) {
                const dynamicLevel = levelMap[logObj.fromUser.referralCode];
                if (dynamicLevel !== undefined) {
                    logObj.level = dynamicLevel;

                    // Dynamically calculate the real amount based on package rates and the new level
                    if (type === 'referral' && logObj.fromUser.packageId) {
                        const pkg = logObj.fromUser.packageId;
                        const realAmount = pkg.referralAmounts[dynamicLevel - 1];
                        if (realAmount !== undefined) {
                            logObj.amount = realAmount;
                        }
                    } else if (type === 'level' && logObj.fromUser.packageId) {
                        const pkg = logObj.fromUser.packageId;
                        const originalLevel = log.level; // level originally stored in DB
                        const originalPct = pkg.levelPercentages[originalLevel - 1];
                        if (originalPct > 0) {
                            const roiAmount = (log.amount * 100) / originalPct;
                            const newPct = pkg.levelPercentages[dynamicLevel - 1];
                            if (newPct !== undefined) {
                                logObj.amount = Math.round((roiAmount * newPct) / 100 * 100) / 100; // round to 2 decimal places
                            }
                        }
                    }
                }
            }
            return logObj;
        });

        res.json(processedLogs);
    } catch (error) {
        console.error('Income API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get ALL income logs (admin only) with filters
// @route   GET /api/income/admin/all
// @access  Private/Admin
const getAllIncomeLogs = async (req, res) => {
    try {
        const { type, search, startDate, endDate } = req.query;

        let query = {};

        // Filter by income type
        if (type && type !== 'all') {
            query.incomeType = type;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        // If search provided, find matching users first
        if (search) {
            const matchingUsers = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { userId: { $regex: search, $options: 'i' } },
                    { referralCode: { $regex: search, $options: 'i' } },
                ]
            }).select('_id');
            const userIds = matchingUsers.map(u => u._id);
            query.$or = [
                { userId: { $in: userIds } },
                { fromUser: { $in: userIds } }
            ];
        }

        const logs = await Income.find(query)
            .sort({ createdAt: -1 })
            .limit(2000)
            .populate({ path: 'userId', select: 'name userId referralCode email' })
            .populate({ path: 'fromUser', select: 'name userId referralCode' });

        // Only return records where the recipient user still exists
        const filteredLogs = logs.filter(log => log.userId !== null);

        res.json(filteredLogs);
    } catch (error) {
        console.error('Admin Income API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle income visibility and adjust user balances
// @route   PATCH /api/income/admin/toggle-visibility/:id
// @access  Private/Admin
const toggleIncomeVisibility = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ message: 'Income not found' });

        const user = await User.findById(income.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!income.showToUser) {
            income.showToUser = true;
            user.totalIncome += income.amount;
            if (income.incomeType === 'referral') user.referralIncome += income.amount;
            if (income.incomeType === 'level') user.levelIncome += income.amount;
            if (income.incomeType === 'roi') user.roiIncome += income.amount;
        } else {
            income.showToUser = false;
            user.totalIncome -= income.amount;
            if (income.incomeType === 'referral') user.referralIncome -= income.amount;
            if (income.incomeType === 'level') user.levelIncome -= income.amount;
            if (income.incomeType === 'roi') user.roiIncome -= income.amount;
        }

        await income.save();
        await user.save();

        res.json({ message: 'Visibility toggled successfully', income });
    } catch (error) {
        console.error('Toggle Visibility Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reveal hidden incomes (Called via Vercel Cron)
// @route   GET /api/income/cron/reveal
// @access  Public (Vercel Cron)
const revealHiddenIncomes = async (req, res) => {
    try {
        // Security check: Only allow Vercel Cron or Admin
        const isVercelCron = req.headers['x-vercel-cron'] === '1';
        const isAdmin = req.user && req.user.role === 'admin';

        if (!isVercelCron && !isAdmin && process.env.NODE_ENV === 'production') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const hiddenIncomes = await Income.find({ showToUser: false });
        if (hiddenIncomes.length === 0) {
            return res.json({ message: 'No hidden incomes to reveal', count: 0 });
        }

        for (const income of hiddenIncomes) {
            const user = await User.findById(income.userId);
            if (user) {
                income.showToUser = true;
                user.totalIncome += income.amount;
                if (income.incomeType === 'referral') user.referralIncome += income.amount;
                if (income.incomeType === 'level') user.levelIncome += income.amount;
                if (income.incomeType === 'roi') user.roiIncome += income.amount;
                
                await income.save();
                await user.save();
            }
        }
        res.json({ message: 'Incomes revealed successfully', count: hiddenIncomes.length });
    } catch (error) {
        console.error('Reveal Incomes Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getIncomeLogs, getAllIncomeLogs, toggleIncomeVisibility, revealHiddenIncomes };
