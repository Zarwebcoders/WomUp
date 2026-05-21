const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Income = require('./models/Income');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const yash = await User.findOne({ name: 'Yash' });
    if (!yash) {
        console.log("Yash not found");
        process.exit(0);
    }
    
    const incomes = await Income.find({ fromUser: yash._id }).populate('userId').populate('fromUser');
    console.log(`Found ${incomes.length} level incomes from Yash:`);
    incomes.forEach(income => {
        console.log("Income log:", {
            id: income._id,
            incomeType: income.incomeType,
            amount: income.amount,
            level: income.level,
            recipient: income.userId ? {
                id: income.userId._id,
                name: income.userId.name,
                code: income.userId.referralCode
            } : null,
            fromUser: income.fromUser ? {
                id: income.fromUser._id,
                name: income.fromUser.name,
                code: income.fromUser.referralCode
            } : null
        });
    });
    
    process.exit(0);
};

run();
