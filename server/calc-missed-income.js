const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Package = require('./models/Package');
const Income = require('./models/Income');

async function calc() {
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
            // If user has a package, they must have paid
            if (user.packageId && user.isActive) {
                const pkg = user.packageId;
                const refAmount = pkg.referralAmounts[currentLevel - 1] || 0;
                
                if (refAmount > 0) {
                    totalMissedIncome += refAmount;
                    missedIncomes.push({
                        fromUser: user.name,
                        fromUserId: user.userId,
                        level: currentLevel,
                        amount: refAmount,
                        pkgName: pkg.packageName
                    });
                }
            }
            
            // continue down
            await traverseDownline(user.userId, currentLevel + 1);
        }
    }

    await traverseDownline(targetUserId, 1);
    
    console.log(`\nFound ${missedIncomes.length} approved packages in downline.`);
    console.log(`Total missed income for ${targetUserId}: ₹${totalMissedIncome}`);
    console.log(missedIncomes);
    
    process.exit(0);
}
calc();
