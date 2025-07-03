// config/passport.js
const passport = require('passport');
require('./passportLocal');
require('./passportGoogle');
// require('./passportFacebook'); 
require('./passportGithub');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  require('../models/User').findById(id).then(u => done(null, u)).catch(done)
);

module.exports = passport;
