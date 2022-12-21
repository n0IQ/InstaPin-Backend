const mongoose = require('mongoose');
const User = require('../models/UserModel');
const Pin = require('../models/PinModel');

// check if the user exists
exports.userExists = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return false;
    return user;
}

// check if the pin exists
exports.pinExists = async (pinId) => {
    const pin = await Pin.findById(pinId);
    if (!pin) return false;
    return pin;
}

// check if id is valid
exports.validId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}