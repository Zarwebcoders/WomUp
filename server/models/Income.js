const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    incomeType: { type: String, enum: ['referral', 'level', 'roi'], required: true, index: true },
    amount: { type: Number, required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    level: { type: Number },
    showToUser: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, index: true }
});

// Compound index for user activity log queries
incomeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Income', incomeSchema);
