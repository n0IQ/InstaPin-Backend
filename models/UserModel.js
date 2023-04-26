const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
  },
  lastName: {
    type: String,
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
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
    minLength: [6, 'Minimum password length is 6 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your Password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password do not match',
    },
  },
  jwtToken: {
    type: String,
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
  },
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
