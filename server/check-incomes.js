const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Income = require('./models/Income');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const aarav = await User.findOne({ referralCode: 'WOM752677' });
    if (!aarav) {
        console.log('Aarav not found');
        process.exit(1);
    }
    
    console.log(`Incomes for Aarav (${aarav._id}):`);
    const incomes = await Income.find({ userId: aarav._id }).populate('fromUser');
    for (const inc of incomes) {
        console.log(`- Type: ${inc.incomeType}, Amount: ₹${inc.amount}, From: ${inc.fromUser ? inc.fromUser.name : 'Unknown'}, Level stored in Income: ${inc.level}, Date: ${inc.createdAt}`);
    }
    
    process.exit(0);
};

run();
