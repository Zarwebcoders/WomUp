const mongoose = require('mongoose');

const packageRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    transactionSlip: {
        type: String, // Path to the image
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

module.exports = mongoose.model('PackageRequest', packageRequestSchema);
