const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userId: { type: String, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    plainPassword: { type: String },
    referralCode: { type: String, unique: true },
    referredBy: { type: String }, // Stores sponsor's userId string (e.g., WOM0000)
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    totalIncome: { type: Number, default: 0 },
    referralIncome: { type: Number, default: 0 },
    levelIncome: { type: Number, default: 0 },
    roiIncome: { type: Number, default: 0 },
    teamCount: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'distributer'], default: 'user' },
    packagePurchaseDate: { type: Date },
    monthlyRoiAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    activatedAt: { type: Date },
    expiresAt: { type: Date },
    kyc: {
        status: { type: String, enum: ['unsubmitted', 'pending', 'approved', 'rejected'], default: 'unsubmitted' },
        rejectReason: { type: String, default: '' },
        submittedAt: { type: Date },
        profilePhoto: { type: String },
        aadharNumber: { type: String },
        aadharFront: { type: String },
        aadharBack: { type: String },
        panNumber: { type: String },
        panCardPhoto: { type: String },
        bankHolderName: { type: String },
        bankName: { type: String },
        bankAccountNumber: { type: String },
        bankIfscCode: { type: String },
        bankPassbookPhoto: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
