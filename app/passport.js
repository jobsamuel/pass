var Twitter = require('passport-twitter').Strategy
,   User = require('./users')
,   tokens = require('./tokens')
,   config = {
                consumerKey: tokens.twitter_consumer_key,
                consumerSecret: tokens.twitter_consumer_secret,
                callbackURL: "/login"
    }

function callback(token, tokenSecret, profile, done) {
  User.findOne({profile_id: profile.id}, function (err, user) {
    if (err) {
      throw err;
    } else if (user != null) {
      // User exists in database.
      return done(null, user)
    } else {
      // User doesn't exist in database,
      // so it will create a new one.
      var pic = profile.photos[0].value.replace(/_normal/, '')
      ,   usr = {
                profile_id: profile.id,
                name: profile.displayName,
                photo: pic
              }
      ,   register = new User(usr);
      register.save(function (err, user) {
        if (err) throw err;
        done(null, user)
      })
    }
  });
}

function passport(passport) {

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Twitter profile is serialized
  //   and deserialized.

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new Twitter(config, callback));
}

module.exports = passport;