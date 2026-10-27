const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true
    },
    city: {
        type: String,
        default: '',
        trim: true
    },
    area: {
        type: String,
        default: '',
        trim: true
    },
    role: {
        type: String,
        default: 'Join as Customer',
        trim: true
    },
    pincode: {
        type: String,
        default: '',
        trim: true
    },
    location: {
        type: String,
        default: '',
        trim: true
    },
    message: {
        type: String,
        default: '',
        trim: true
    },
    source: {
        type: String,
        default: 'womup_landing_page',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index to quickly search leads by mobile or creation date
leadSchema.index({ mobile: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
