const OAuth = require('oauth');
const tweetEntity = require('./tweet.entity');

const mapTweetsToEntity = (data, user) => {
  return JSON.parse(data).map((tweet) => {
    return {
      profileId: user.id,
      id: tweet.id,
      user: tweet.user,
      hashtags: tweet.entities.hashtags?.map((hashtag) => hashtag.text),
      text: tweet.text,
    };
  });
};

const getOAuthClient = () => {
  const twitterApiKey = process.env['TWITTER_API_KEY'];
  const twitterApiSecret = process.env['TWITTER_API_SECRET_KEY'];
  const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';

  return new OAuth.OAuth(requestTokenUrl, accessTokenUrl, twitterApiKey, twitterApiSecret, '1.0A', null, 'HMAC-SHA1');
};

const tweetService = {
  saveTweets: (user) => {
    const apiUrl = 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=800';
    const oAuthClient = getOAuthClient();

    oAuthClient.get(apiUrl, user.token, user.tokenSecret, async (error, data) => {
      if (data) {
        const tweetsToBeAdded = mapTweetsToEntity(data, user);
        await tweetEntity.insertMany(tweetsToBeAdded);
      }
    });
  },
};

module.exports = tweetService;
