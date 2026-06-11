const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Income = require('./models/Income');
const Package = require('./models/Package');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database.");

        // 1. Delete all existing referral income records
        console.log("Deleting existing 'referral' type income documents...");
        const deleteRes = await Income.deleteMany({ incomeType: 'referral' });
        console.log(`Deleted ${deleteRes.deletedCount} referral income documents.`);

        // 2. Reset referralIncome for all users to 0
        console.log("Resetting referralIncome for all users...");
        await User.updateMany({}, { referralIncome: 0 });

        // 3. Find all users who have an active package
        const buyers = await User.find({ isActive: true, packageId: { $ne: null } })
            .populate('packageId')
            .sort({ createdAt: 1 }); // Process chronologically

        console.log(`Found ${buyers.length} active package-holding users.`);

        // Helper function for skip-logic distribution (same as packageController.js distributeIncomes)
        const distributeIncomes = async (sponsorIdOrCode, fromUserId, pkg, level) => {
            if (level > 10) return;

            const query = { $or: [{ referralCode: sponsorIdOrCode }] };
            if (mongoose.isValidObjectId(sponsorIdOrCode)) {
                query.$or.push({ _id: sponsorIdOrCode });
            }

            const sponsor = await User.findOne(query);
            if (!sponsor) return;

            let nextLevel = level;

            if (sponsor.isActive || sponsor.role === 'distributer') {
                const refAmount = pkg.referralAmounts[level - 1] || 0;
                if (refAmount > 0) {
                    sponsor.referralIncome += refAmount;
                    await sponsor.save();

                    await Income.create({
                        userId: sponsor._id,
                        incomeType: 'referral',
                        amount: refAmount,
                        fromUser: fromUserId,
                        level: level
                    });

                    console.log(`  Credited Level ${level} referral income (₹${refAmount}) to ${sponsor.name} from buyer.`);
                }
                nextLevel = level + 1;
            } else {
                console.log(`  Skipping inactive sponsor ${sponsor.name} (WOMID: ${sponsor.userId}) at level ${level}`);
            }

            if (sponsor.referredBy) {
                await distributeIncomes(sponsor.referredBy, fromUserId, pkg, nextLevel);
            }
        };

        // 4. Distribute incomes for each buyer
        for (const buyer of buyers) {
            console.log(`\nDistributing referral incomes for buyer: ${buyer.name} (${buyer.referralCode}) - Package: ${buyer.packageId.packageName}`);
            if (buyer.referredBy) {
                await distributeIncomes(buyer.referredBy, buyer._id, buyer.packageId, 1);
            } else {
                console.log(`  No referrer/sponsor. Skipping distribution.`);
            }
        }

        // 5. Final pass: Recalculate totalIncome = referralIncome + levelIncome + roiIncome for all users
        console.log("\nRecalculating totalIncome for all users...");
        const allUsers = await User.find({});
        for (const user of allUsers) {
            const oldTotal = user.totalIncome;
            const referral = user.referralIncome || 0;
            const levelInc = user.levelIncome || 0;
            const roi = user.roiIncome || 0;
            const newTotal = Math.round((referral + levelInc + roi) * 100) / 100;

            if (oldTotal !== newTotal || user.referralIncome !== referral) {
                user.totalIncome = newTotal;
                await user.save();
                console.log(`Updated ${user.name} (${user.referralCode}): Referral: ₹${referral} | Level: ₹${levelInc} | ROI: ₹${roi} | Total: ₹${oldTotal} -> ₹${newTotal}`);
            }
        }

        console.log("\nReferral income regeneration and total recalculation completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error during regeneration:", err);
        process.exit(1);
    }
};

run();
