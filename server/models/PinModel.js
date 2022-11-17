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
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Pin = mongoose.model('Pin', pinSchema);
module.exports = Pin;
