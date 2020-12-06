require('dotenv').config();

const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const TwitterStrategy = require('passport-twitter').Strategy;

const userRouter = require('./resources/user/user.route');
const authRouter = require('./resources/auth/auth.route');
const tweetRouter = require('./resources/tweet/tweet.route');
const twitterAuthStrategy = require('./resources/auth/strategies/twitter');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: true, secret: process.env['SESSION_SECRET'] }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy(twitterAuthStrategy.getConfig, twitterAuthStrategy.authorize));

const mongodbUri = `mongodb+srv://root:${process.env['MONGODB_PASSWORD']}@${process.env['MONGODB_HOSTED_URL']}/${process.env['MONGODB_DBNAME']}?retryWrites=true&w=majority`;
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/tweets', tweetRouter);

module.exports = app;
