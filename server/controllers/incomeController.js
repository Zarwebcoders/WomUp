const User = require('../models/User');
const Income = require('../models/Income');

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
        
        const logs = await Income.find(query).sort({ createdAt: -1 }).populate('fromUser', 'name');
        res.json(logs);
    } catch (error) {
        console.error('Income API Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getIncomeLogs };
