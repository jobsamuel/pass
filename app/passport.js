var Twitter = require('passport-twitter').Strategy
,   tokens = require('./tokens')
,   config = {
              consumerKey: tokens.twitter_consumer_key,
              consumerSecret: tokens.twitter_consumer_secret,
              callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
    }

function callback(token, tokenSecret, profile, done) {
  // Do something.
  if (profile) {
    console.log(profile.displayName);
  }
}

function passport(passport) {
  passport.use(new Twitter(config, callback));
}

module.exports = passport;