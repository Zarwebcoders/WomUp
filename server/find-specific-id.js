const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Income = require('./models/Income');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find by ID directly
    const inc1 = await Income.findById('6a0ebed659bf55be2f6236b2');
    console.log("Found by string ID:", inc1);
    
    // Find any level income with amount 18
    const inc3 = await Income.find({ amount: 18 }).populate('fromUser').populate('userId');
    console.log(`Found ${inc3.length} level incomes with amount 18:`);
    inc3.forEach(i => {
        console.log(`- ID: ${i._id} | From: ${i.fromUser ? i.fromUser.name : 'Unknown'} | To: ${i.userId ? i.userId.name : 'Unknown'} | Type: ${i.incomeType} | Level: ${i.level}`);
    });

    process.exit(0);
};

run();
