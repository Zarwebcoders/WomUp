const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Package = require('./models/Package');
const Income = require('./models/Income');

async function apply() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const targetUserId = 'DSB313813';
    const targetUser = await User.findOne({ userId: targetUserId });
    
    if (!targetUser) {
        console.log('Target user not found');
        process.exit(1);
    }

    let totalMissedIncome = 0;
    const missedIncomes = [];

    // recursive function to find downline up to level 10
    async function traverseDownline(sponsorId, currentLevel) {
        if (currentLevel > 10) return;
        
        const directs = await User.find({ referredBy: sponsorId }).populate('packageId');
        
        for (const user of directs) {
            if (user.packageId && user.isActive) {
                const pkg = user.packageId;
                const refAmount = pkg.referralAmounts[currentLevel - 1] || 0;
                
                if (refAmount > 0) {
                    totalMissedIncome += refAmount;
                    missedIncomes.push({
                        fromUser: user._id, // User ObjectId
                        level: currentLevel,
                        amount: refAmount,
                    });
                }
            }
            await traverseDownline(user.userId, currentLevel + 1);
        }
    }

    await traverseDownline(targetUserId, 1);
    
    if (missedIncomes.length === 0) {
        console.log('No missed income found.');
        process.exit(0);
    }
    
    console.log(`Applying ₹${totalMissedIncome} to ${targetUserId}...`);

    for (const inc of missedIncomes) {
        // Create Income record
        await Income.create({
            userId: targetUser._id,
            incomeType: 'referral',
            amount: inc.amount,
            fromUser: inc.fromUser,
            level: inc.level
        });
    }

    // Update user balance
    targetUser.referralIncome += totalMissedIncome;
    targetUser.totalIncome += totalMissedIncome;
    await targetUser.save();

    console.log(`Successfully applied missed income. Total updated income for ${targetUserId}: ₹${targetUser.totalIncome}`);
    
    process.exit(0);
}
apply();
