// config/passportLocal.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;        // :contentReference[oaicite:1]{index=1}
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return done(null, false, { message: 'Incorrect email or password' });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
