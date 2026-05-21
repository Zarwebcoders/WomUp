const User = require('../models/User');
const Income = require('../models/Income');

// Helper to recursively construct level map skipping inactive users
const buildLevelMap = async (currentUser, currentLevel, levelMap, maxLevel = 10) => {
    if (currentLevel > maxLevel) return;

    // Find direct referrals of this user
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
            // Do not count/increment level for inactive user (No Package), but still display them at currentLevel
            levelMap[ref.referralCode] = currentLevel;
            await buildLevelMap(ref, currentLevel, levelMap, maxLevel);
        }
    }
};

// @desc    Get team details by level
// @route   GET /api/referral/team/:level
// @access  Private
const getTeamByLevel = async (req, res) => {
    try {
        const levelParam = req.params.level;
        const { search } = req.query;

        let levelMap = {}; // To store referralCode -> level
        
        await buildLevelMap(req.user, 1, levelMap, 10);

        let allLevelCodes = Object.keys(levelMap);
        if (levelParam !== 'all') {
            const targetLevel = parseInt(levelParam) || 1;
            allLevelCodes = allLevelCodes.filter(code => levelMap[code] === targetLevel);
        }

        if (allLevelCodes.length === 0) {
            return res.json([]);
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
            .populate('packageId')
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

        res.json(team);
    } catch (error) {
        console.error('Team API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTeamByLevel };
