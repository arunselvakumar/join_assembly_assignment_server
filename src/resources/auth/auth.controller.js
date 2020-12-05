const passport = require('passport');

const authController = {
  authUserWithTwitterStrategy: passport.authenticate('twitter'),

  handleTwitterCallback: async (req, res) => {
    await res.redirect('http://localhost:8080/login');
  },
};

module.exports = authController;
