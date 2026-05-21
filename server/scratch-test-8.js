const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Package = require('./models/Package');
const User = require('./models/User');

const run = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        console.log('\n--- Step 1: Admin Sets Custom ROI for Buyer C (WOM783809) ---');
        const buyerC = await User.findOne({ referralCode: 'WOM783809' }).populate('packageId');
        if (!buyerC) {
            console.error('Error: Buyer C not found');
            process.exit(1);
        }

        // Set custom ROI amount for Month 8 onwards (e.g., ₹15,000)
        const customAmount = 15000;
        buyerC.monthlyRoiAmount = customAmount;
        await buyerC.save();
        console.log(`Custom monthly ROI for Buyer C (${buyerC.name}) set to ₹${customAmount}`);

        // Record starting balances before Month 8 distribution
        const startC = { roiIncome: buyerC.roiIncome, totalIncome: buyerC.totalIncome };
        const sponsorB = await User.findOne({ referralCode: 'WOM265213' });
        const sponsorA = await User.findOne({ referralCode: 'WOM308244' });

        if (!sponsorA || !sponsorB) {
            console.error('Error: Sponsor A or B not found');
            process.exit(1);
        }

        // Activate them for the test to ensure they are evaluated as active
        sponsorA.isActive = true;
        await sponsorA.save();
        sponsorB.isActive = true;
        await sponsorB.save();
        
        const startB = { levelIncome: sponsorB.levelIncome, totalIncome: sponsorB.totalIncome };
        const startA = { levelIncome: sponsorA.levelIncome, totalIncome: sponsorA.totalIncome };

        console.log(`Buyer C starting: ROI = ₹${startC.roiIncome}`);
        console.log(`Sponsor B starting: Level = ₹${startB.levelIncome}`);
        console.log(`Sponsor A starting: Level = ₹${startA.levelIncome}`);

        // Step 2: Trigger Simulated Month 8 ROI Distribution
        console.log('\n--- Step 2: Triggering ROI Distribution for Month 8 ---');
        console.log('Calling API http://localhost:5005/api/roi/distribute?testMonth=8 ...');
        const response = await fetch('http://localhost:5005/api/roi/distribute?testMonth=8', { method: 'POST' });
        const result = await response.json();
        console.log('API Response:', result);

        // Re-fetch users to verify Month 8 Payouts
        const endC = await User.findOne({ referralCode: 'WOM783809' });
        const endB = await User.findOne({ referralCode: 'WOM265213' });
        const endA = await User.findOne({ referralCode: 'WOM308244' });

        // Calculate deltas
        const diffC_ROI = endC.roiIncome - startC.roiIncome;
        const diffC_Total = endC.totalIncome - startC.totalIncome;

        const diffB_Level = endB.levelIncome - startB.levelIncome;
        const diffB_Total = endB.totalIncome - startB.totalIncome;

        const diffA_Level = endA.levelIncome - startA.levelIncome;
        const diffA_Total = endA.totalIncome - startA.totalIncome;

        console.log('\n--- Verification for Buyer C (ROI) ---');
        console.log(`Buyer C ROI Income changed by: +₹${diffC_ROI} (Expected: +₹15,000)`);
        console.log(`Buyer C Total Income changed by: +₹${diffC_Total} (Expected: +₹15,000)`);

        console.log('\n--- Verification for Sponsor B (Level 1: 18%) ---');
        console.log(`Sponsor B Level Income changed by: +₹${diffB_Level} (Expected: +₹2,700)`);
        console.log(`Sponsor B Total Income changed by: +₹${diffB_Total} (Expected: +₹2,700)`);

        console.log('\n--- Verification for Sponsor A (Level 2: 9%) ---');
        console.log(`Sponsor A Level Income changed by: +₹${diffA_Level} (Expected: +₹1,350)`);
        console.log(`Sponsor A Total Income changed by: +₹${diffA_Total} (Expected: +₹1,350)`);

        const isSuccess = (diffC_ROI === 15000 && diffB_Level === 2700 && diffA_Level === 1350);
        if (isSuccess) {
            console.log('\n🎉 SUCCESS: Month 8 Custom ROI and Level Income Distribution flow verified perfectly!');
        } else {
            console.error('\n❌ FAILURE: Month 8 Custom ROI mismatch.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Execution Error:', err);
        process.exit(1);
    }
};

run();
