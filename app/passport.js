var Twitter = require('passport-twitter').Strategy
,   User = require('./users')
,   tokens = require('./tokens')
,   config = {
                consumerKey: tokens.twitter_consumer_key,
                consumerSecret: tokens.twitter_consumer_secret,
                callbackURL: "/auth/twitter/callback"
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
      // so it's necessary to create a new one.
      console.log("Opcion 3");
      var register = new User({
                                profile_id: profile.id,
                                name: profile.displayName,
                                photo: profile.photos[0].value
                            });
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