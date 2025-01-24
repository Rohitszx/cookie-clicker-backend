const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  prizes: { type: Number, default: 0 },
  lastClickTimestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);