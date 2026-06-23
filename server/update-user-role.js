const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function updateUserRoleAndId() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find the user by their current DSB userId
        let user = await User.findOne({ userId: 'DSB531622' });

        if (!user) {
            // Fallback: search by any ID containing DSB531622
            user = await User.findOne({ userId: { $regex: /DSB531622/i } });
        }

        if (!user) {
            console.log('❌ User not found with userId DSB531622');
            return;
        }

        console.log(`\n📋 Found user:`);
        console.log(`   Name   : ${user.name}`);
        console.log(`   userId : ${user.userId}`);
        console.log(`   Email  : ${user.email}`);
        console.log(`   Role   : ${user.role}`);

        const oldUserId = user.userId;

        // Extract the numeric part from DSB420409 → 420409
        const numericPart = oldUserId.replace(/^[A-Za-z]+/, '');
        const newUserId = 'WOM' + numericPart;

        // Check if the new userId already exists to avoid conflicts
        const existing = await User.findOne({ userId: newUserId });
        if (existing) {
            console.log(`\n⚠️  userId ${newUserId} already exists! Cannot rename.`);
            return;
        }

        // Update referralCode too if it matches the old userId
        const oldReferralCode = user.referralCode;
        let newReferralCode = oldReferralCode;
        if (oldReferralCode === oldUserId) {
            newReferralCode = newUserId;
        }

        // Update all users who were referred by the old userId
        const referralUpdateResult = await User.updateMany(
            { referredBy: oldUserId },
            { $set: { referredBy: newUserId } }
        );

        // Apply changes to the user document
        user.userId = newUserId;
        user.referralCode = newReferralCode;
        user.role = 'user'; // ensure role stays as user
        await user.save();

        console.log(`\n✅ Changes applied successfully!`);
        console.log(`   userId        : ${oldUserId} → ${newUserId}`);
        console.log(`   referralCode  : ${oldReferralCode} → ${newReferralCode}`);
        console.log(`   role          : distributer → user`);
        console.log(`   referredBy updated for ${referralUpdateResult.modifiedCount} downline user(s)`);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

updateUserRoleAndId();
