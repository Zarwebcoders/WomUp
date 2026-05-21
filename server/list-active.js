const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Package = require('./models/Package');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const activeUsers = await User.find({ isActive: true }).populate('packageId');
    console.log(`Found ${activeUsers.length} active users:`);
    for (const u of activeUsers) {
        console.log(`- Name: ${u.name}, ID: ${u.referralCode}, ReferredBy: ${u.referredBy}, Package: ${u.packageId ? u.packageId.packageName : 'None'}, Price: ${u.packageId ? u.packageId.price : 'N/A'}`);
    }
    process.exit(0);
};

run();
