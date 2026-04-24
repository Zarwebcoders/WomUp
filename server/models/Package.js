const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    price: { type: Number, required: true },
    referralAmounts: {
        type: [Number],
        default: new Array(10).fill(0)
    },
    levelPercentages: {
        type: [Number],
        default: new Array(10).fill(0)
    },
    roiSchedule: {
        type: Map,
        of: Number,
        default: {}
    }
});

module.exports = mongoose.model('Package', packageSchema);
