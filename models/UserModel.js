const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    unique: false,
  },
  lastName: {
    type: String,
    required: false,
    unique: false,
  },
  userName: {
    type: String,
    required: [true, 'Username is Required'],
    unique: [true, 'Username should be unique'],
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: [true, 'Email should be unique'],
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
    unique: false,
  },
  createdPins: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pin' }],
  },
  savedPins: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pin' }],
  },
  createdAt: { 
    type: Date,
    default: Date.now(),
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
