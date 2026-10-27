const mongoose = require('mongoose');

// Cache database connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const DEFAULT_MONGO_URI = 'mongodb+srv://zarwebcoders:zarwebcoders@cluster0.lqgakzj.mongodb.net/womup';

const connectDB = async () => {
    // 1. If already connected and ready, return existing connection
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // 2. If connection is currently in progress, wait for it
    if (!cached.promise) {
        const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

        // On Node/serverless, ensure public DNS resolves MongoDB Atlas SRV records reliably
        try {
            const dns = require('dns');
            dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
        } catch (dnsErr) {
            // ignore if restricted
        }

        const opts = {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            bufferCommands: false, // Prevents hanging operations for 10s if disconnected
        };

        console.log(`Connecting to MongoDB... (${mongoUri.substring(0, 25)}...)`);

        cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
            console.log(`MongoDB Connected: ${mongooseInstance.connection.host} / Database: ${mongooseInstance.connection.name}`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;
