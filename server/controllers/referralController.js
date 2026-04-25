const User = require('../models/User');
const Income = require('../models/Income');

// @desc    Get team details by level
// @route   GET /api/referral/team/:level
// @access  Private
const getTeamByLevel = async (req, res) => {
    try {
        const levelParam = req.params.level;
        const { search } = req.query;

        let levelMap = {}; // To store userId -> level
        
        if (levelParam === 'all') {
            let tempIds = [req.user._id];
            for (let i = 1; i <= 10; i++) {
                const users = await User.find({ referredBy: { $in: tempIds } }).select('_id');
                tempIds = users.map(u => u._id);
                if (tempIds.length === 0) break;
                
                tempIds.forEach(id => {
                    levelMap[id.toString()] = i;
                });
            }
        } else {
            const level = parseInt(levelParam) || 1;
            let tempIds = [req.user._id];
            for (let i = 1; i <= level; i++) {
                const users = await User.find({ referredBy: { $in: tempIds } }).select('_id');
                tempIds = users.map(u => u._id);
                if (tempIds.length === 0) break;
                
                if (i === level) {
                    tempIds.forEach(id => {
                        levelMap[id.toString()] = i;
                    });
                }
            }
        }

        const allLevelIds = Object.keys(levelMap);
        let query = { _id: { $in: allLevelIds } };

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
                level: levelMap[u._id.toString()],
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
