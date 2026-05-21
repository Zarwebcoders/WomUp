const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Package = require('./models/Package');
const Income = require('./models/Income');

// Copy of the distributeIncomes function directly from packageController.js (with the skip logic active)
const distributeIncomes = async (sponsorIdOrCode, fromUserId, pkg, level) => {
    if (level > 10) return;

    const query = { $or: [{ referralCode: sponsorIdOrCode }] };
    if (mongoose.isValidObjectId(sponsorIdOrCode)) {
        query.$or.push({ _id: sponsorIdOrCode });
    }

    const sponsor = await User.findOne(query);
    if (!sponsor) return;

    let nextLevel = level;

    if (sponsor.isActive) {
        const refAmount = pkg.referralAmounts[level - 1] || 0;
        if (refAmount > 0) {
            await Income.create({
                userId: sponsor._id,
                incomeType: 'referral',
                amount: refAmount,
                fromUser: fromUserId,
                level: level
            });
            console.log(`[Referral Payout] Paid ₹${refAmount} to active sponsor ${sponsor.name} (${sponsor.referralCode}) at Level ${level}`);
        }
        nextLevel = level + 1;
    } else {
        console.log(`[Referral Payout] Skipping inactive sponsor ${sponsor.name} (${sponsor.referralCode}) at level ${level}`);
    }

    if (sponsor.referredBy) {
        await distributeIncomes(sponsor.referredBy, fromUserId, pkg, nextLevel);
    }
};

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const arjun = await User.findOne({ email: 'arjun@gmail.com' });
    if (!arjun) {
        console.error('Arjun not found');
        process.exit(1);
    }

    // Get Standard package
    const pkg = await Package.findOne({ price: 55000 });
    if (!pkg) {
        console.error('Standard Package not found');
        process.exit(1);
    }

    console.log('\n--- Simulating Referral Distribution for Arjun with Skip Logic ---');
    console.log(`Arjun (Referred by: ${arjun.referredBy})`);
    
    // Clear previous simulation incomes from Arjun to prevent duplicate prints
    await Income.deleteMany({ fromUser: arjun._id, incomeType: 'referral' });

    // Distribute incomes
    await distributeIncomes(arjun.referredBy, arjun._id, pkg, 1);

    console.log('\n--- Final Incomes Created for Arjun\'s Purchase ---');
    const incomes = await Income.find({ fromUser: arjun._id, incomeType: 'referral' }).populate('userId');
    for (const inc of incomes) {
        console.log(`- Recipient: ${inc.userId ? inc.userId.name : 'Unknown'} (${inc.userId ? inc.userId.referralCode : 'N/A'}) | Amount: ₹${inc.amount} | Level: ${inc.level} | Status: Active`);
    }

    // Restore original DB state (optional, let's keep them clean)
    // await Income.deleteMany({ fromUser: arjun._id, incomeType: 'referral' });

    process.exit(0);
};

run();
