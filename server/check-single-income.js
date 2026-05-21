const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Income = require('./models/Income');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const income = await Income.findById('6a0ebed659bf55be2f6236b2').populate('userId').populate('fromUser');
    if (income) {
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
    } else {
        console.log("Income not found");
    }
    process.exit(0);
};

run();
