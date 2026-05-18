const User = require('../models/User');
const Income = require('../models/Income');

// @desc    Get team details by level
// @route   GET /api/referral/team/:level
// @access  Private
const getTeamByLevel = async (req, res) => {
    try {
        const levelParam = req.params.level;
        const { search } = req.query;

        let levelMap = {}; // To store referralCode -> level
        
        if (levelParam === 'all') {
            let tempIdentifiers = [{ referralCode: req.user.referralCode, _id: req.user._id }];
            for (let i = 1; i <= 10; i++) {
                const currentCodes = tempIdentifiers.map(ti => ti.referralCode).filter(Boolean);
                const currentIds = tempIdentifiers.map(ti => ti._id).filter(Boolean);

                const users = await User.find({ 
                    $or: [
                        { referredBy: { $in: currentCodes } },
                        { referredBy: { $in: currentIds } }
                    ]
                }).select('referralCode _id');

                if (users.length === 0) break;
                
                tempIdentifiers = users.map(u => ({ referralCode: u.referralCode, _id: u._id }));
                
                users.forEach(u => {
                    levelMap[u.referralCode] = i;
                });
            }
        } else {
            const level = parseInt(levelParam) || 1;
            let tempIdentifiers = [{ referralCode: req.user.referralCode, _id: req.user._id }];
            for (let i = 1; i <= level; i++) {
                const currentCodes = tempIdentifiers.map(ti => ti.referralCode).filter(Boolean);
                const currentIds = tempIdentifiers.map(ti => ti._id).filter(Boolean);

                const users = await User.find({ 
                    $or: [
                        { referredBy: { $in: currentCodes } },
                        { referredBy: { $in: currentIds } }
                    ]
                }).select('referralCode _id');

                if (users.length === 0) break;
                
                tempIdentifiers = users.map(u => ({ referralCode: u.referralCode, _id: u._id }));
                
                if (i === level) {
                    users.forEach(u => {
                        levelMap[u.referralCode] = i;
                    });
                }
            }
        }

        const allLevelCodes = Object.keys(levelMap);
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
