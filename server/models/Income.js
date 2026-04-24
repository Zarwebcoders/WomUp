const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    incomeType: { type: String, enum: ['referral', 'level', 'roi'], required: true },
    amount: { type: Number, required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    level: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', incomeSchema);
