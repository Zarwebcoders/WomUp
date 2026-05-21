const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const printUplineChain = async (startCode, targetCode) => {
    let current = await User.findOne({ referralCode: startCode });
    if (!current) {
        console.log(`User not found: ${startCode}`);
        return;
    }
    console.log(`\n--- Upline Chain from ${current.name} (${startCode}) to ${targetCode} ---`);
    let path = [];
    let temp = current;
    while (temp && temp.referredBy) {
        const sponsor = await User.findOne({ referralCode: temp.referredBy });
        if (!sponsor) break;
        path.push({ name: sponsor.name, code: sponsor.referralCode, isActive: sponsor.isActive });
        if (sponsor.referralCode === targetCode) {
            break;
        }
        temp = sponsor;
    }
    path.forEach((node, idx) => {
        console.log(`  [Step ${idx + 1}] -> ${node.name} (${node.code}) | isActive: ${node.isActive}`);
    });
};

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Aarav code is WOM752677
    const target = 'WOM752677';
    
    const users = ['vivan@gmail.com', 'arjun@gmail.com', 'ishan@gmail.com', 'ayan@gmail.com', 'rohan@gmail.com'];
    for (const email of users) {
        const u = await User.findOne({ email });
        if (u) {
            await printUplineChain(u.referralCode, target);
        }
    }
    
    process.exit(0);
};

run();
