const tweetService = require('./tweet.service');
const httpStatusCodes = require('http-status-codes');
const { fromUrl, parseDomain } = require('parse-domain');

const tweetController = {
  getTweetStats: async (req, res) => {
    try {
      const userId = req.params['userId'];

      if (!userId) {
        res.status(httpStatusCodes.BAD_REQUEST);
      }

      const tweets = await tweetService.getTweetsByUserId(userId);
      const response = {};
      const tweetsWithUrls = tweets.filter((tweet) => tweet.urls.length);
      response.totalTweets = tweets.length;
      response.totalTweetsWithUrls = tweetsWithUrls.length;

      const domainsWithCount = {};
      const usersWithCount = {};

      for (let i = 0; i < tweetsWithUrls.length; i++) {
        const tweet = tweetsWithUrls[i];
        tweet.urls.forEach((url) => {
          const domain = parseDomain(fromUrl(url)).icann.domain;
          if (domain !== 'twitter') {
            if (domain in domainsWithCount) {
              domainsWithCount[domain] = domainsWithCount[domain] + 1;
            } else {
              domainsWithCount[domain] = 1;
            }

            const user = tweet.user.name;
            if (user in usersWithCount) {
              usersWithCount[user] = usersWithCount[user] + 1;
            } else {
              usersWithCount[user] = 1;
            }
          }
        });
      }

      response.domainsWithCount = domainsWithCount;
      response.usersWithCount = usersWithCount;
      res.status(httpStatusCodes.OK).json(response);
    } catch {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getTweetsByTag: async (req, res) => {
    const tag = req.query['q'];
    const tweetEntities = await tweetService.getTweetsByTag(tag);
    res.status(httpStatusCodes.OK).json(tweetEntities);
  },
};

module.exports = tweetController;
