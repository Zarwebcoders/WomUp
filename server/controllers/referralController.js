const User = require('../models/User');

// @desc    Get team details by level
// @route   GET /api/referral/team/:level
// @access  Private
const getTeamByLevel = async (req, res) => {
    try {
        const levelParam = req.params.level;
        const { search } = req.query;

        let currentLevelIds = [req.user._id];
        let allLevelIds = [];
        
        if (levelParam === 'all') {
            // Traverse up to 10 levels and collect all IDs
            let tempIds = [req.user._id];
            for (let i = 0; i < 10; i++) {
                const users = await User.find({ referredBy: { $in: tempIds } }).select('_id');
                tempIds = users.map(u => u._id);
                if (tempIds.length === 0) break;
                allLevelIds = [...allLevelIds, ...tempIds];
            }
        } else {
            const level = parseInt(levelParam) || 1;
            // Find users at the specific level
            for (let i = 0; i < level; i++) {
                const users = await User.find({ referredBy: { $in: currentLevelIds } }).select('_id');
                currentLevelIds = users.map(u => u._id);
                if (currentLevelIds.length === 0) break;
            }
            allLevelIds = currentLevelIds;
        }

        let query = { _id: { $in: allLevelIds } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        const team = await User.find(query).populate('packageId');
        res.json(team);
    } catch (error) {
        console.error('Team API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTeamByLevel };
