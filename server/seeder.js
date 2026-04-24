const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');

dotenv.config();

const packages = [
    {
        packageName: 'Standard',
        price: 55000,
        referralAmounts: [3000, 1000, 1000, 700, 700, 700, 700, 500, 500, 500],
        levelPercentages: [18, 9, 6, 4.8, 3, 3, 1.8, 1.8, 1.8, 0.8],
        roiSchedule: {
            "3": 400,
            "4": 800,
            "5": 800,
            "6": 1200,
            "7": 4000,
            "8": 4000
        }
    },
    {
        packageName: 'Premium',
        price: 111000,
        referralAmounts: [7000, 2000, 2000, 1500, 1500, 1500, 1500, 1000, 1000, 1000],
        levelPercentages: [18, 9, 6, 4.8, 3, 3, 1.8, 1.8, 1.8, 0.8],
        roiSchedule: {
            "3": 1000,
            "4": 2000,
            "5": 2000,
            "6": 3000,
            "7": 10000,
            "8": 10000
        }
    }
];

const seedPackages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Package.deleteMany();
        await Package.insertMany(packages);
        console.log('Packages Seeded with new income structures!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedPackages();
