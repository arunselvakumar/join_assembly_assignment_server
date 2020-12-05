const express = require('express');
const passport = require('passport');

const authController = require('./auth.controller');

const router = express.Router();

const passportConfig = passport.authenticate('twitter', {
  session: false,
});

router.get('/', authController.authUserWithTwitterStrategy);

router.get('/callback', passportConfig, authController.handleTwitterCallback);

module.exports = router;
