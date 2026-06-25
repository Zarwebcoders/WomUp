const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const directs = await User.find({ referredBy: 'WOM760073' });
    console.log('Directs of WOM760073:');
    for (const d of directs) {
        console.log(`- ${d.name} (${d.userId})`);
    }
    process.exit(0);
}
check();
