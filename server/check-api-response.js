const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Income = require('./models/Income');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Aarav
    const user = await User.findOne({ referralCode: 'WOM752677' });
    if (!user) {
        console.log("Aarav not found");
        process.exit(1);
    }
    
    const runForType = async (type) => {
        const req = {
            user: user,
            params: { type },
            query: {}
        };
        
        let resData;
        const res = {
            json: (data) => {
                resData = data;
            },
            status: (code) => ({
                json: (data) => {
                    console.error(`Status ${code}:`, data);
                }
            })
        };
        
        const { getIncomeLogs } = require('./controllers/incomeController');
        await getIncomeLogs(req, res);
        
        console.log(`\nProcessed Logs for ${type}:`);
        resData.forEach(log => {
            console.log(`- From: ${log.fromUser ? log.fromUser.name : 'Unknown'} | Level Stored: ${log.toObject ? log.toObject().level : 'N/A'} -> Dynamic Level: ${log.level} | Stored Amount: ${log.toObject ? log.toObject().amount : 'N/A'} -> Dynamic Amount: ${log.amount}`);
        });
    };

    await runForType('referral');
    await runForType('level');
    
    process.exit(0);
};

run();
