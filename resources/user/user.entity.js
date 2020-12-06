const mongoose = require('mongoose');

const userSchema = {
  id: { type: String, required: true },
  displayName: { type: String, required: true },
  profilePic: { type: String, required: false },
  token: { type: String, required: true },
  tokenSecret: { type: String, required: true },
  lastModified: { type: Date, default: Date.now },
};

module.exports = mongoose.model('users', userSchema);
