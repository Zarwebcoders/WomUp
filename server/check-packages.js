const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Package = require('./models/Package');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const pkgs = await Package.find({});
    console.log("Packages in DB:");
    pkgs.forEach(p => {
        console.log(`- Name: ${p.packageName} | Price: ₹${p.price}`);
        console.log(`  Referral Amounts:`, p.referralAmounts);
        console.log(`  Level Percentages:`, p.levelPercentages);
        console.log(`  ROI Schedule:`, p.roiSchedule);
    });
    
    process.exit(0);
};

run();
