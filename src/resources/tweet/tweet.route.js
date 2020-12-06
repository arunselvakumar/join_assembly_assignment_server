const express = require('express');
const tweetController = require('./tweet.controller');

const router = express.Router();

router.get('/:userId/stats', tweetController.getTweetStats);

module.exports = router;
