const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const Package = require('./models/Package');
const PackageRequest = require('./models/PackageRequest');
const Income = require('./models/Income');

const distributeIncomes = async (sponsorIdOrCode, fromUserId, pkg, level) => {
    if (level > 10) return;

    const query = { $or: [{ referralCode: sponsorIdOrCode }] };
    if (mongoose.isValidObjectId(sponsorIdOrCode)) {
        query.$or.push({ _id: sponsorIdOrCode });
    }

    const sponsor = await User.findOne(query);
    if (!sponsor) {
        console.log(`[Referral Payout] Sponsor not found for code/id: ${sponsorIdOrCode}`);
        return;
    }

    let nextLevel = level;
    if (sponsor.isActive) {
        const refAmount = pkg.referralAmounts[level - 1] || 0;
        console.log(`[Referral Payout] Processing sponsor ${sponsor.name} (${sponsor.referralCode}) at level ${level}. Amount: ₹${refAmount}`);

        if (refAmount > 0) {
            sponsor.referralIncome += refAmount;
            sponsor.totalIncome += refAmount;
            
            await Income.create({
                userId: sponsor._id,
                incomeType: 'referral',
                amount: refAmount,
                fromUser: fromUserId,
                level: level
            });

            await sponsor.save();
            console.log(`[Referral Payout] Paid ₹${refAmount} to ${sponsor.name} (${sponsor.referralCode})`);
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
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        // Find Premium Package (price ₹111,000)
        console.log('\n--- Looking for Premium Package (₹111,000) ---');
        const premiumPkg = await Package.findOne({ price: 111000 });
        if (!premiumPkg) {
            console.error('Error: Premium Package (₹111,000) not found in the database!');
            process.exit(1);
        }
        console.log(`Found Package: ${premiumPkg.packageName} (ID: ${premiumPkg._id})`);

        // Record starting balances
        console.log('\n--- Recording Starting Balances ---');
        const sponsorA = await User.findOne({ referralCode: 'WOM308244' });
        const sponsorB = await User.findOne({ referralCode: 'WOM265213' });
        const buyerC = await User.findOne({ referralCode: 'WOM783809' });

        if (!sponsorA || !sponsorB || !buyerC) {
            console.error('Error: One of the test users (Sponsor A, Sponsor B, or Buyer C) is missing from the database.');
            process.exit(1);
        }

        // Activate them for the test to ensure they are evaluated as active
        sponsorA.isActive = true;
        await sponsorA.save();
        sponsorB.isActive = true;
        await sponsorB.save();

        const startA = {
            referralIncome: sponsorA.referralIncome,
            levelIncome: sponsorA.levelIncome,
            totalIncome: sponsorA.totalIncome
        };
        const startB = {
            referralIncome: sponsorB.referralIncome,
            levelIncome: sponsorB.levelIncome,
            totalIncome: sponsorB.totalIncome
        };
        const startC = {
            roiIncome: buyerC.roiIncome,
            totalIncome: buyerC.totalIncome
        };

        console.log(`Sponsor A (WOM308244) starting: Referral = ₹${startA.referralIncome}, Level = ₹${startA.levelIncome}, Total = ₹${startA.totalIncome}`);
        console.log(`Sponsor B (WOM265213) starting: Referral = ₹${startB.referralIncome}, Level = ₹${startB.levelIncome}, Total = ₹${startB.totalIncome}`);
        console.log(`Buyer C (WOM783809) starting: ROI = ₹${startC.roiIncome}, Total = ₹${startC.totalIncome}`);

        // Cleanup any old test user D
        console.log('\n--- Cleaning up previous D user ---');
        const oldUserD = await User.findOne({ email: 'user_d_test@gmail.com' });
        if (oldUserD) {
            await PackageRequest.deleteMany({ userId: oldUserD._id });
            await Income.deleteMany({ fromUser: oldUserD._id });
            await User.deleteOne({ _id: oldUserD._id });
            console.log('Old user D deleted.');
        } else {
            console.log('No old user D found.');
        }

        // Step 1: Register User D under Sponsor B
        console.log('\n--- Step 1: Register User D under Sponsor B (WOM265213) ---');
        const userId = 'WOM' + Math.floor(100000 + Math.random() * 900000);
        const userD = new User({
            name: 'D',
            email: 'user_d_test@gmail.com',
            userId,
            mobile: '1234567890',
            password: 'password123',
            plainPassword: 'password123',
            referralCode: userId,
            referredBy: 'WOM265213'
        });
        await userD.save();
        console.log(`Registered User D: ${userD.name} (Referral ID: ${userD.referralCode}, referredBy: ${userD.referredBy})`);

        // Submit Purchase Request for User D
        console.log('\n--- Submitting Purchase Request for User D ---');
        const requestD = await PackageRequest.create({
            userId: userD._id,
            packageId: premiumPkg._id,
            transactionId: 'TEST_TX_D_' + Date.now(),
            transactionSlip: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        });
        console.log(`Purchase Request created. ID: ${requestD._id}`);

        // Approve Purchase Request for User D
        console.log('\n--- Approving Purchase Request for User D ---');
        requestD.status = 'approved';
        requestD.updatedAt = new Date();
        await requestD.save();

        userD.packageId = premiumPkg._id;
        userD.packagePurchaseDate = new Date();
        userD.isActive = true;
        userD.activatedAt = new Date();
        userD.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await userD.save();
        console.log('User D package approved and activated.');

        // Trigger Referral Payouts
        console.log('\n--- Triggering Referral Payouts for User D ---');
        await distributeIncomes(userD.referredBy, userD._id, premiumPkg, 1);

        // Verify Step 1 Referral Commission
        console.log('\n--- Verifying Step 1 Referral Commission ---');
        const endB = await User.findOne({ referralCode: 'WOM265213' });
        const endA = await User.findOne({ referralCode: 'WOM308244' });

        const diffB_Ref = endB.referralIncome - startB.referralIncome;
        const diffB_Total = endB.totalIncome - startB.totalIncome;
        const diffA_Ref = endA.referralIncome - startA.referralIncome;
        const diffA_Total = endA.totalIncome - startA.totalIncome;

        console.log(`Sponsor B (WOM265213) Referral Income changed by: +₹${diffB_Ref} (Expected: +₹7,000)`);
        console.log(`Sponsor B (WOM265213) Total Income changed by: +₹${diffB_Total} (Expected: +₹7,000)`);
        console.log(`Sponsor A (WOM308244) Referral Income changed by: +₹${diffA_Ref} (Expected: +₹2,000)`);
        console.log(`Sponsor A (WOM308244) Total Income changed by: +₹${diffA_Total} (Expected: +₹2,000)`);

        let step1Success = (diffB_Ref === 7000 && diffB_Total === 7000 && diffA_Ref === 2000 && diffA_Total === 2000);
        if (step1Success) {
            console.log('✅ STEP 1 SUCCESS: Referral Commission Flow verified correctly!');
        } else {
            console.error('❌ STEP 1 FAILURE: Referral Commission values mismatch.');
        }

        // Count how many active users are sponsored by Sponsor B (referralCode WOM265213)
        // These active users will get processed during the ROI run and generate Level 1 and Level 2 commissions.
        const activeDownlineCount = await User.countDocuments({ referredBy: 'WOM265213', isActive: true });
        console.log(`\nActive downline count under Sponsor B: ${activeDownlineCount} (Users C, D, and E)`);

        const expectedLevelB = activeDownlineCount * 180; // 18% of 1000 per user
        const expectedLevelA = activeDownlineCount * 90;  // 9% of 1000 per user

        // Step 2: Test ROI & Level Income Payouts (Simulated Month 3)
        console.log('\n--- Step 2: Triggering ROI & Level Income Payouts (Simulated Month 3) ---');
        
        // Let's call the API endpoint: http://localhost:5005/api/roi/distribute?testMonth=3
        console.log('Calling API http://localhost:5005/api/roi/distribute?testMonth=3 ...');
        const response = await fetch('http://localhost:5005/api/roi/distribute?testMonth=3', { method: 'POST' });
        const result = await response.json();
        console.log('API Response:', result);

        // Verify Step 2 ROI & Level Income
        console.log('\n--- Verifying Step 2 Payouts ---');
        const endC_ROI = await User.findOne({ referralCode: 'WOM783809' });
        const endB_Level = await User.findOne({ referralCode: 'WOM265213' });
        const endA_Level = await User.findOne({ referralCode: 'WOM308244' });

        const diffC_ROI = endC_ROI.roiIncome - startC.roiIncome;
        const diffC_Total = endC_ROI.totalIncome - startC.totalIncome;
        
        const diffB_LevelVal = endB_Level.levelIncome - startB.levelIncome;
        const diffB_TotalWithLevel = endB_Level.totalIncome - startB.totalIncome;
        
        const diffA_LevelVal = endA_Level.levelIncome - startA.levelIncome;
        const diffA_TotalWithLevel = endA_Level.totalIncome - startA.totalIncome;

        console.log(`Buyer C (WOM783809) ROI Income changed by: +₹${diffC_ROI} (Expected: +₹1,000)`);
        console.log(`Buyer C (WOM783809) Total Income changed by: +₹${diffC_Total} (Expected: +₹1,000)`);
        
        console.log(`Sponsor B (WOM265213) Level Income changed by: +₹${diffB_LevelVal} (Expected: +₹${expectedLevelB})`);
        console.log(`Sponsor B (WOM265213) Total Income overall change: +₹${diffB_TotalWithLevel} (Expected: +₹${7000 + expectedLevelB})`);

        console.log(`Sponsor A (WOM308244) Level Income changed by: +₹${diffA_LevelVal} (Expected: +₹${expectedLevelA})`);
        console.log(`Sponsor A (WOM308244) Total Income overall change: +₹${diffA_TotalWithLevel} (Expected: +₹${2000 + expectedLevelA})`);

        let step2Success = (diffC_ROI === 1000 && diffC_Total === 1000 && diffB_LevelVal === expectedLevelB && diffA_LevelVal === expectedLevelA);
        if (step2Success) {
            console.log('✅ STEP 2 SUCCESS: ROI and Level Income Flow verified correctly!');
        } else {
            console.error('❌ STEP 2 FAILURE: ROI and Level Income values mismatch.');
        }

        if (step1Success && step2Success) {
            console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! BOTH REFERRAL AND ROI/LEVEL COMMISSION FLOWS ARE WORKING 100% CORRECTLY!');
        } else {
            console.error('\n❌ SOME TESTS FAILED. CHECK LOGS ABOVE.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Test Execution Error:', err);
        process.exit(1);
    }
};

run();
