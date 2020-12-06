const userService = require('../../user/user.service');
const tweetService = require('../../tweet/tweet.service');

const twitterAuthStrategy = {
  getConfig: {
    consumerKey: process.env['TWITTER_API_KEY'],
    callbackURL: process.env['TWITTER_CALLBACK_URL'],
    consumerSecret: process.env['TWITTER_API_SECRET_KEY'],
  },

  authorize: async (token, tokenSecret, profile, done) => {
    const { id, displayName } = profile;
    const profilePic = profile.photos[0]?.value;

    const user = await userService.getUserById(id);
    if (user) {
      await done(null, user);
    } else {
      await userService.addUser({ id, displayName, profilePic, token, tokenSecret });
      tweetService.saveTweets({ token, tokenSecret, ...profile });
      await done(null, { id, displayName, profilePic, token, tokenSecret });
    }
  },
};

module.exports = twitterAuthStrategy;
