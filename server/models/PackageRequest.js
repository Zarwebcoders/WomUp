const mongoose = require('mongoose');

const packageRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
        index: true
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
        default: 'pending',
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date
    }
});

// Compound indexes for admin and user dashboard growth calculations
packageRequestSchema.index({ status: 1, createdAt: -1 });
packageRequestSchema.index({ userId: 1, status: 1, createdAt: -1 });
// Sort-only index for admin recent activities (no status filter, sort DESC by createdAt)
packageRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PackageRequest', packageRequestSchema);
