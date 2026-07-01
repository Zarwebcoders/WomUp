const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Income = require('./models/Income');
const PackageRequest = require('./models/PackageRequest');

dotenv.config();

async function run() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        console.log('Syncing indexes for User...');
        await User.syncIndexes();
        console.log('Syncing indexes for Income...');
        await Income.syncIndexes();
        console.log('Syncing indexes for PackageRequest...');
        await PackageRequest.syncIndexes();

        console.log('All indexes synchronized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error syncing indexes:', err);
        process.exit(1);
    }
}

run();
