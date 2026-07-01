const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const PackageRequest = require('./models/PackageRequest');
const { getDashboardSummary } = require('./controllers/dashboardController');

dotenv.config();

async function test() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        // Find a test user (we know DSB313813 exists as a user and WOM760073 as an admin)
        const adminUser = await User.findOne({ userId: 'WOM760073' });
        const standardUser = await User.findOne({ userId: 'DSB313813' });

        if (!adminUser || !standardUser) {
            console.log('Test users not found.');
            process.exit(1);
        }

        // Mock req and res for Admin
        const mockReqAdmin = {
            user: adminUser,
            query: { period: '6months' }
        };
        const mockResAdmin = {
            json: (data) => {
                console.log('\nAdmin Dashboard Response success.');
            },
            status: (code) => ({
                json: (data) => console.log('Admin Error Status:', code, data)
            })
        };

        // Mock req and res for Standard User
        const mockReqUser = {
            user: standardUser,
            query: { period: '6months' }
        };
        const mockResUser = {
            json: (data) => {
                console.log('\nStandard User Dashboard Response success.');
            },
            status: (code) => ({
                json: (data) => console.log('User Error Status:', code, data)
            })
        };

        console.log('\n=== RUNNING ADMIN DASHBOARD TEST ===');
        await getDashboardSummary(mockReqAdmin, mockResAdmin);

        console.log('\n=== RUNNING Q4 DETAILED BREAKDOWN ===');
        console.time('Q4-1: PackageRequest.find without populate');
        const reqs = await PackageRequest.find({}).sort({ createdAt: -1 }).limit(5);
        console.timeEnd('Q4-1: PackageRequest.find without populate');

        console.time('Q4-2: Populate User');
        await PackageRequest.populate(reqs, { path: 'userId', select: 'name' });
        console.timeEnd('Q4-2: Populate User');

        console.time('Q4-3: Populate Package');
        await PackageRequest.populate(reqs, { path: 'packageId', select: 'packageName' });
        console.timeEnd('Q4-3: Populate Package');

        console.log('\n=== RUNNING STANDARD USER DASHBOARD TEST ===');
        await getDashboardSummary(mockReqUser, mockResUser);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
