const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await User.findOne({ userId: 'WOM760073' });
    const user = await User.findOne({ userId: 'DSB313813' });
    
    console.log('Admin:', admin ? admin.name : 'Not Found', admin ? admin.userId : '');
    console.log('User:', user ? user.name : 'Not Found', user ? user.userId : '');

    const adminTeam = await User.countDocuments({ referredBy: 'WOM760073' });
    const userTeam = await User.countDocuments({ referredBy: 'DSB313813' });
    console.log('Admin Team:', adminTeam);
    console.log('User Team:', userTeam);
    
    process.exit(0);
}
check();
