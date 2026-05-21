const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Package = require('./models/Package');
const Income = require('./models/Income');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Aarav
    const aarav = await User.findOne({ referralCode: 'WOM752677' });
    
    const users = ['vivan@gmail.com', 'arjun@gmail.com', 'ishan@gmail.com', 'ayan@gmail.com', 'rohan@gmail.com'];
    
    console.log("--- Downline Package & ROI Details ---");
    for (const email of users) {
        const u = await User.findOne({ email }).populate('packageId');
        if (u) {
            console.log(`Name: ${u.name} (${u.referralCode})`);
            console.log(`  Package: ${u.packageId ? u.packageId.packageName : 'None'} (Price: ${u.packageId ? u.packageId.price : 'N/A'})`);
            console.log(`  isActive: ${u.isActive}`);
            // Find ROI income received by this user
            const roiIncomes = await Income.find({ userId: u._id, incomeType: 'roi' });
            console.log(`  ROI received:`, roiIncomes.map(r => `₹${r.amount} (${r.createdAt.toLocaleDateString()})`));
        }
    }
    
    process.exit(0);
};

run();
