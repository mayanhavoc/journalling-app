const express = require('express')
const router = express.Router();
const passport = require('passport');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const User = require('../models/User');
const users = require('../controllers/users');
const Story = require('../models/Story');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();

router.get('/register', ensureGuest, (req, res) => {
  res.render('register', {
    layout: 'login'
  });
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const id = uuidv4();
    const user = new User({ id, email, username});
    const registeredUser = await User.register(user,password);
    console.log(registeredUser)
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome!');
      res.redirect('dashboard')
    })
  } catch(e){
    console.error(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
})

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

router.post('/login', async (req, res) => {
  try {
    req.flash('success', 'welcome back!');
      const redirectUrl = req.session.returnTo || '/dashboard';
      delete req.session.returnTo;
      res.redirect(redirectUrl);
      console.log(redirectUrl)
  } catch(e){
    console.error(e);
  }
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.username,
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;