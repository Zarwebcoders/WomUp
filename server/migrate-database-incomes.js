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

        // Fetch all incomes
        const incomes = await Income.find({});
        console.log(`Found ${incomes.length} total income documents.`);

        // Temp maps for user incomes
        const userIncomes = {};

        // Helper to get user's up-to-date active package
        const users = await User.find({}).populate('packageId');
        const userMap = {};
        users.forEach(u => {
            userMap[u._id.toString()] = u;
            userMap[u.referralCode] = u;
            userIncomes[u._id.toString()] = {
                referralIncome: 0,
                levelIncome: 0,
                roiIncome: 0,
                totalIncome: 0
            };
        });

        // 1. Process and Recalculate Income documents
        for (const income of incomes) {
            const recipientIdStr = income.userId.toString();
            const recipient = userMap[recipientIdStr];
            if (!recipient) {
                console.log(`Warning: Recipient user ${income.userId} not found for income ${income._id}. Skipping.`);
                continue;
            }

            if (income.incomeType === 'roi') {
                userIncomes[recipientIdStr].roiIncome += income.amount;
                userIncomes[recipientIdStr].totalIncome += income.amount;
                continue;
            }

            // For referral and level incomes, trace the upline path from fromUser to determine correct level and amount
            const buyer = userMap[income.fromUser?.toString()];
            if (!buyer) {
                console.log(`Warning: Buyer user ${income.fromUser} not found for income ${income._id}. Skipping.`);
                continue;
            }

            const pkg = buyer.packageId;
            if (!pkg) {
                console.log(`Warning: Buyer ${buyer.name} has no package. Skipping.`);
                continue;
            }

            // Trace path
            let level = 1;
            let temp = buyer;
            let found = false;
            while (temp && temp.referredBy) {
                let query = { referralCode: temp.referredBy };
                if (mongoose.isValidObjectId(temp.referredBy)) {
                    query = { $or: [{ referralCode: temp.referredBy }, { _id: temp.referredBy }] };
                }
                const sponsor = await User.findOne(query);
                if (!sponsor) break;
                if (sponsor.isActive) {
                    if (sponsor._id.toString() === recipient._id.toString()) {
                        found = true;
                        break;
                    }
                    level++;
                }
                temp = sponsor;
            }

            if (found) {
                let oldLevel = income.level;
                let oldAmount = income.amount;
                let newLevel = level;
                let newAmount = oldAmount;

                if (income.incomeType === 'referral') {
                    newAmount = pkg.referralAmounts[level - 1] || 0;
                } else if (income.incomeType === 'level') {
                    const originalLevel = income.level;
                    const originalPct = pkg.levelPercentages[originalLevel - 1] || 0;
                    if (originalPct > 0) {
                        const roiAmount = (oldAmount * 100) / originalPct;
                        const newPct = pkg.levelPercentages[level - 1] || 0;
                        newAmount = Math.round((roiAmount * newPct) / 100 * 100) / 100;
                    }
                }

                // Update database Income log
                income.level = newLevel;
                income.amount = newAmount;
                await income.save();

                console.log(`Updated Income ${income._id} (${income.incomeType}) from ${buyer.name} to ${recipient.name}:`);
                console.log(`  Level: ${oldLevel} -> ${newLevel}`);
                console.log(`  Amount: ₹${oldAmount} -> ₹${newAmount}`);

                if (income.incomeType === 'referral') {
                    userIncomes[recipientIdStr].referralIncome += newAmount;
                } else {
                    userIncomes[recipientIdStr].levelIncome += newAmount;
                }
                userIncomes[recipientIdStr].totalIncome += newAmount;
            } else {
                console.log(`Recipient ${recipient.name} not found in active upline path of buyer ${buyer.name} for income ${income._id}. Keeping current values.`);
                if (income.incomeType === 'referral') {
                    userIncomes[recipientIdStr].referralIncome += income.amount;
                } else {
                    userIncomes[recipientIdStr].levelIncome += income.amount;
                }
                userIncomes[recipientIdStr].totalIncome += income.amount;
            }
        }

        // 2. Update User totals in database
        console.log("\nUpdating user income totals in DB:");
        for (const [userIdStr, totals] of Object.entries(userIncomes)) {
            const user = userMap[userIdStr];
            if (!user) continue;

            user.referralIncome = Math.round(totals.referralIncome * 100) / 100;
            user.levelIncome = Math.round(totals.levelIncome * 100) / 100;
            user.roiIncome = Math.round(totals.roiIncome * 100) / 100;
            user.totalIncome = Math.round(totals.totalIncome * 100) / 100;

            await user.save();
            console.log(`- ${user.name}: Referral: ₹${user.referralIncome} | Level: ₹${user.levelIncome} | ROI: ₹${user.roiIncome} | Total: ₹${user.totalIncome}`);
        }

        console.log("\nDatabase migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
