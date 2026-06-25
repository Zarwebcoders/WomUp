const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function getTeamCount(userId) {
    let count = 0;
    const directs = await User.find({ referredBy: userId });
    count += directs.length;
    for (const d of directs) {
        count += await getTeamCount(d.userId);
    }
    return count;
}

async function recompute() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminUserId = 'WOM760073';
    const targetUserId = 'DSB313813';
    
    const adminCount = await getTeamCount(adminUserId);
    const targetCount = await getTeamCount(targetUserId);
    
    await User.updateOne({ userId: adminUserId }, { $set: { teamCount: adminCount } });
    await User.updateOne({ userId: targetUserId }, { $set: { teamCount: targetCount } });
    
    console.log(`Admin team count: ${adminCount}`);
    console.log(`Womup user team count: ${targetCount}`);
    
    process.exit(0);
}
recompute();
