const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email']
    },
    async (_, __, profile, done) => {
      try {
        const existing = await User.findOne({
          providers: { $elemMatch: { name: 'github', providerId: profile.id } }
        });
        if (existing) return done(null, existing);

        // GitHub may return email(s) in profile.emails
        const email = profile.emails?.[0]?.value;
        const user = await User.create({
          fullName: profile.displayName || profile.username,
          email,
          avatarUrl: profile.photos?.[0]?.value,
          providers: [{ name: 'github', providerId: profile.id, email }]
        });
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);
