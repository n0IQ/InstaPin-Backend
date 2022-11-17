const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required'],
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
  },
  createdPins: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  savedPins: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
