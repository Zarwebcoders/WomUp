const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function transfer() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminUserId = 'WOM760073';
    const targetUserId = 'DSB313813'; // Womup User
    
    // Find users directly referred by Admin, except the target user
    const directs = await User.find({ referredBy: adminUserId, userId: { $ne: targetUserId } });
    
    console.log(`Found ${directs.length} users to transfer to ${targetUserId}`);
    
    for (const user of directs) {
        console.log(`Transferring ${user.name} (${user.userId}) ...`);
        user.referredBy = targetUserId;
        await user.save();
    }
    
    console.log('Transfer complete.');
    process.exit(0);
}
transfer();
