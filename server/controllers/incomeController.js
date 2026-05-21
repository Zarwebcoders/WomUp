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
            incomeType: type 
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
                    // Skip level count for inactive user, continue traversing their downline with same level
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

module.exports = { getIncomeLogs };
