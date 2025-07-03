// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/User');

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
//       profileFields: ['id', 'displayName', 'emails', 'picture.type(large)']
//     },
//     async (_, __, profile, done) => {
//       try {
//         const existing = await User.findOne({
//           providers: { $elemMatch: { name: 'facebook', providerId: profile.id } }
//         });
//         if (existing) return done(null, existing);

//         const user = await User.create({
//           fullName: profile.displayName,
//           email: profile.emails?.[0]?.value,
//           avatarUrl: profile.photos?.[0]?.value,
//           providers: [{ name: 'facebook', providerId: profile.id, email: profile.emails?.[0]?.value }]
//         });
//         done(null, user);
//       } catch (e) {
//         done(e);
//       }
//     }
//   )
// );
