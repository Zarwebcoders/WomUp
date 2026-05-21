const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find Rohan
    const rohan = await User.findOne({ name: 'Rohan' });
    if (!rohan) {
        console.log("Rohan not found");
        process.exit(0);
    }
    
    console.log("Tracing upline path from Rohan:");
    let current = rohan;
    let step = 0;
    while (current) {
        console.log(`Step ${step}: ${current.name} (${current.referralCode}) | isActive: ${current.isActive} | referredBy: ${current.referredBy}`);
        if (!current.referredBy) break;
        
        let query = { referralCode: current.referredBy };
        if (mongoose.isValidObjectId(current.referredBy)) {
            query = { $or: [{ referralCode: current.referredBy }, { _id: current.referredBy }] };
        }
        current = await User.findOne(query);
        step++;
    }
    
    process.exit(0);
};

run();
