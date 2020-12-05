const express = require('express');
const passport = require('passport');

const router = express.Router();

const passportConfig = passport.authenticate('twitter', {
  session: false,
});

router.get('/', passport.authenticate('twitter'));

router.get('/callback', passportConfig, async (req, res) => {
  await res.redirect(process.env['OAUTH_CLIENT_REDIRECT_URL']);
});

module.exports = router;
