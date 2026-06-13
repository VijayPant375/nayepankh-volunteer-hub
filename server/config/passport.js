const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const adminEmail = process.env.ADMIN_EMAIL;

      if (email === adminEmail) {
        return done(null, { email, name: profile.displayName });
      }

      // Not the admin — reject without error
      return done(null, false);
    }
  )
);

module.exports = passport;
