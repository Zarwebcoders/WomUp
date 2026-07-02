const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const standardUpdate = await Package.findOneAndUpdate(
            { packageName: 'Standard', price: 55000 },
            { $set: { referralAmounts: [3000, 1200, 1100, 900, 900, 700, 700, 500, 500, 500] } },
            { new: true }
        );
        console.log("Updated Standard Package:", standardUpdate ? "Success" : "Not Found");

        const premiumUpdate = await Package.findOneAndUpdate(
            { packageName: 'Premium', price: 111000 },
            { $set: { referralAmounts: [6000, 2500, 2500, 2000, 2000, 1500, 1500, 1000, 1000, 1000] } },
            { new: true }
        );
        console.log("Updated Premium Package:", premiumUpdate ? "Success" : "Not Found");

        process.exit(0);
    } catch (error) {
        console.error("Migration Error:", error);
        process.exit(1);
    }
};

run();
