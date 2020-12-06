const express = require('express');
const tweetController = require('./tweet.controller');

const router = express.Router();

router.get('/:userId/stats', tweetController.getTweetStats);

router.get('/search', tweetController.getTweetsByTag);

module.exports = router;
