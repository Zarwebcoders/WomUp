const User = require('../models/User');
const Income = require('../models/Income');
const {
    getRequiredDirectsForLevel,
    getMaxUnlockedLevel,
    isLevelUnlocked,
    countUserDirects,
    getLevelStatusList
} = require('../utils/levelEligibility');

// Helper to recursively construct level map based on network hierarchy
const buildLevelMap = async (currentUser, currentLevel, levelMap, maxLevel = 10) => {
    if (currentLevel > maxLevel) return;

    // Find direct referrals of this user
    const query = {
        $or: [
            { referredBy: currentUser.referralCode },
            { referredBy: currentUser._id }
        ]
    };
    if (currentUser.userId && currentUser.userId !== currentUser.referralCode) {
        query.$or.push({ referredBy: currentUser.userId });
    }
    const referrals = await User.find(query).select('referralCode _id userId');

    for (const ref of referrals) {
        levelMap[ref.referralCode] = currentLevel;
        await buildLevelMap(ref, currentLevel + 1, levelMap, maxLevel);
    }
};

// @desc    Get level eligibility status for current user
// @route   GET /api/referral/eligibility
// @access  Private
const getLevelEligibility = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const directCount = await countUserDirects(req.user);
        const maxUnlockedLevel = isAdmin ? 10 : getMaxUnlockedLevel(directCount);
        const levelStatuses = getLevelStatusList(directCount, isAdmin);

        res.json({
            directCount,
            maxUnlockedLevel,
            levels: levelStatuses
        });
    } catch (error) {
        console.error('Eligibility API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get team details by level with direct qualification check
// @route   GET /api/referral/team/:level
// @access  Private
const getTeamByLevel = async (req, res) => {
    try {
        const levelParam = req.params.level;
        const { search } = req.query;

        const isAdmin = req.user.role === 'admin';
        const directCount = await countUserDirects(req.user);
        const maxUnlockedLevel = isAdmin ? 10 : getMaxUnlockedLevel(directCount);
        const levelStatuses = getLevelStatusList(directCount, isAdmin);

        // Check if a specific level was requested and if it is locked
        if (levelParam !== 'all') {
            const targetLevel = parseInt(levelParam, 10) || 1;
            const requiredDirects = getRequiredDirectsForLevel(targetLevel);
            const isLocked = !isLevelUnlocked(targetLevel, directCount, isAdmin);

            if (isLocked) {
                return res.json({
                    team: [],
                    isLocked: true,
                    level: targetLevel,
                    requiredDirects,
                    directCount,
                    maxUnlockedLevel,
                    levelStatuses
                });
            }
        }

        let levelMap = {}; // To store referralCode -> level
        
        await buildLevelMap(req.user, 1, levelMap, 10);

        let allLevelCodes = Object.keys(levelMap);
        if (levelParam !== 'all') {
            const targetLevel = parseInt(levelParam, 10) || 1;
            allLevelCodes = allLevelCodes.filter(code => levelMap[code] === targetLevel);
        } else if (!isAdmin) {
            // For 'all' levels, only show team members up to user's unlocked level
            allLevelCodes = allLevelCodes.filter(code => (levelMap[code] || 0) <= maxUnlockedLevel);
        }

        if (allLevelCodes.length === 0) {
            return res.json({
                team: [],
                isLocked: false,
                level: levelParam,
                directCount,
                maxUnlockedLevel,
                levelStatuses
            });
        }

        let query = { referralCode: { $in: allLevelCodes } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('name email userId mobile isActive referralCode referredBy teamCount createdAt packageId packageQuantity')
            .populate('packageId', 'packageName price')
            .sort({ createdAt: -1 })
            .lean();
        
        // Add level info and calculate income earned from each member
        const team = await Promise.all(users.map(async (u) => {
            const incomes = await Income.find({ 
                userId: req.user._id, 
                fromUser: u._id 
            });
            const totalFromMember = incomes.reduce((acc, curr) => acc + curr.amount, 0);

            return {
                ...u,
                level: levelMap[u.referralCode],
                incomeFromMember: totalFromMember
            };
        }));

        res.json({
            team,
            isLocked: false,
            level: levelParam,
            directCount,
            maxUnlockedLevel,
            levelStatuses
        });
    } catch (error) {
        console.error('Team API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTeamByLevel, getLevelEligibility };
