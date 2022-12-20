const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is Required'],
    unique: [true, 'Title should be unique'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is Required'],
    unique: false,
  },
  description: {
    type: String,
    required: false,
    unique: false,
  },
  link: {
    type: String,
    required: false,
    unique: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is Required'],
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Pin = mongoose.model('Pin', pinSchema);
module.exports = Pin;
