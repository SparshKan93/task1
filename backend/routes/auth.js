const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const User = require('../models/User');

const router = express.Router();

/* ---------- LOCAL SIGN-UP ---------- */
router.post('/signup', async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email & password required' });

    if (await User.findOne({ email }))
      return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      providers: []          // keep field consistent, even if empty
    });

    req.login(user, err => {
      if (err) return next(err);
      res.status(201).json({
        message: 'Signed up & logged in',
        user: { id: user.id, fullName: user.fullName, email: user.email }
      });
    });
  } catch (err) {
    next(err);
  }
});

/* ---------- LOCAL LOGIN ---------- */
router.post(
  '/login',
  passport.authenticate('local'),       // LocalStrategy uses email & passwordHash
  (req, res) => {
    res.json({
      message: 'Logged in',
      user: { id: req.user.id, fullName: req.user.fullName, email: req.user.email }
    });
  }
);
/* ---------- GOOGLE AUTH ---------- */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    // success – choose redirect or JSON
    res.redirect('http://localhost:3000/dashboard');
  }
);

/* ---------- FACEBOOK ---------- */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${CLIENT_ORIGIN}/login` }),
  (_, res) => res.redirect(`${CLIENT_ORIGIN}/dashboard`)
);

/* ---------- GITHUB ----------- */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: `${CLIENT_ORIGIN}/login` }),
  (_, res) => res.redirect(`${CLIENT_ORIGIN}/dashboard`)
);


/*  WHO AM I?  (for Dashboard refresh)                                */
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { _id: id, fullName, email } = req.user;
  res.json({ user: { id, fullName, email } });
});

/* ---------- LOGOUT ---------- */
router.post('/logout', (req, res, next) => {
  req.logout(err => {                       // callback form required ≥ Passport 0.6 :contentReference[oaicite:2]{index=2}
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out' });
  });
});

module.exports = router;
