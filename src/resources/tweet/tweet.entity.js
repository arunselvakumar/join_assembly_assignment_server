const mongoose = require('mongoose');

const userSchema = {
  id: { type: String, required: true },
  name: { type: String, required: false },
};

const tweetSchema = {
  profileId: { type: String, required: true },
  id: { type: String, required: true },
  text: { type: String, required: true },
  urls: [{ type: String, required: false }],
  hashtags: [{ type: String, required: false }],
  lastModified: { type: Date, default: Date.now },
  user: userSchema,
};

module.exports = mongoose.model('tweets', tweetSchema);
