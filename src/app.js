require('dotenv').config();

const path = require('path');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const TwitterStrategy = require('passport-twitter').Strategy;

const indexRouter = require('./routes/index');
const authRouter = require('./resources/auth/auth.route');

const userService = require('./resources/user/user.service');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ resave: false, saveUninitialized: true, secret: process.env['SESSION_SECRET'] }));

app.use(passport.initialize());
app.use(passport.session());

const mongodbUri = `mongodb+srv://root:${process.env['MONGODB_PASSWORD']}@${process.env['MONGODB_HOSTED_URL']}/${process.env['MONGODB_DBNAME']}?retryWrites=true&w=majority`;
mongoose
  .connect(mongodbUri, { useNewUrlParser: true })
  .then(() => console.log('Database Connection Established'))
  .catch(() => console.log('Error Establishing Database Connection'));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env['TWITTER_API_KEY'],
      callbackURL: process.env['TWITTER_CALLBACK_URL'],
      consumerSecret: process.env['TWITTER_API_SECRET_KEY'],
    },
    async (token, tokenSecret, profile, done) => {
      const { id, displayName } = profile;
      const profilePic = profile.photos[0]?.value;

      const user = await userService.getUserById(id);
      if (user.length) {
        await done(null, user);
      } else {
        await userService.addUser({ token, tokenSecret, ...profile });
      }

      await done(null, { id, displayName, profilePic, token, tokenSecret });
    },
  ),
);

app.use('/', indexRouter);
app.use('/auth', authRouter);

module.exports = app;
