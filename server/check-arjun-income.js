const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Income = require('./models/Income');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const arjun = await User.findOne({ email: 'arjun@gmail.com' });
    if (!arjun) {
        console.log('Arjun not found');
        process.exit(1);
    }
    
    console.log(`Incomes from Arjun (${arjun.name}):`);
    const incomes = await Income.find({ fromUser: arjun._id }).populate('userId');
    for (const inc of incomes) {
        console.log(`- Recipient: ${inc.userId ? inc.userId.name : 'Unknown'}, Amount: ₹${inc.amount}, Level: ${inc.level}, Date: ${inc.createdAt}`);
    }
    
    process.exit(0);
};

run();
