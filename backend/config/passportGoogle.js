// config/passportGoogle.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1️⃣ Find by provider-name + provider-id
        const user = await User.findOne({
          providers: { $elemMatch: { name: 'google', providerId: profile.id } }
        });

        if (user) return done(null, user);

        // 2️⃣ Create new user
        const newUser = await User.create({
          fullName: profile.displayName,
          email: profile.emails?.[0]?.value,
          providers: [
            {
              name: 'google',
              providerId: profile.id,
              email: profile.emails?.[0]?.value
            }
          ]
        });

        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

// session helpers (remove if you’ll issue JWTs instead)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
