const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Active Directs condition for opening levels & receiving level income:
 * L1 & L2: 1 direct active compulsory
 * L3 & L4: 2 direct active compulsory
 * L5 & L6: 3 direct active compulsory
 * L7 & L8: 4 direct active compulsory
 * L9 & L10: 5 direct active compulsory
 */
const getRequiredDirectsForLevel = (level) => {
    const lvl = parseInt(level, 10);
    if (lvl <= 2) return 1;
    if (lvl <= 4) return 2;
    if (lvl <= 6) return 3;
    if (lvl <= 8) return 4;
    if (lvl <= 10) return 5;
    return 5;
};

const getMaxUnlockedLevel = (directCount) => {
    const count = Number(directCount) || 0;
    if (count >= 5) return 10;
    if (count === 4) return 8;
    if (count === 3) return 6;
    if (count === 2) return 4;
    if (count === 1) return 2;
    return 0; // 0 directs = no levels unlocked
};

const isLevelUnlocked = (level, directCount, isAdmin = false) => {
    if (isAdmin) return true;
    const lvl = parseInt(level, 10);
    const required = getRequiredDirectsForLevel(lvl);
    return (Number(directCount) || 0) >= required;
};

const countUserDirects = async (user) => {
    if (!user) return 0;
    const query = {
        isActive: true,
        packageId: { $ne: null },
        $or: []
    };
    if (user.referralCode) query.$or.push({ referredBy: user.referralCode });
    if (user.userId && user.userId !== user.referralCode) query.$or.push({ referredBy: user.userId });
    if (user._id) {
        query.$or.push({ referredBy: user._id.toString() });
        if (mongoose.isValidObjectId(user._id)) {
            query.$or.push({ referredBy: user._id });
        }
    }

    if (query.$or.length === 0) return 0;
    return await User.countDocuments(query);
};

const getLevelStatusList = (directCount, isAdmin = false) => {
    const list = [];
    for (let lvl = 1; lvl <= 10; lvl++) {
        const required = getRequiredDirectsForLevel(lvl);
        const unlocked = isLevelUnlocked(lvl, directCount, isAdmin);
        list.push({
            level: lvl,
            requiredDirects: required,
            isUnlocked: unlocked,
            conditionText: `${required} Active Direct${required > 1 ? 's' : ''} Compulsory`
        });
    }
    return list;
};

module.exports = {
    getRequiredDirectsForLevel,
    getMaxUnlockedLevel,
    isLevelUnlocked,
    countUserDirects,
    getLevelStatusList
};

