const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(`Connecting to: ${process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'UNDEFINED'}`);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
