const express = require('express')
const router = express.Router();
const passport = require('passport');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const User = require('../models/User');
const users = require('../controllers/users');
const Story = require('../models/Story');
const catchAsync = require('../utils/catchAsync');

// router.get('/register', ensureGuest, (req, res) => {
//   res.render('register', {
//     layout: 'login'
//   });
// });

// router.post('/register', async (req, res, next) => {
//   try {
//     const { email, username, password } = req.body;
//     const user = new User({ id, email, username});
//     const registeredUser = await User.register(user,password);
//     console.log(registeredUser)
//     req.login(registeredUser, err => {
//       if (err) return next(err);
//       req.flash('success', 'Welcome!');
//       res.redirect('dashboard')
//     })
//   } catch(e){
//     console.error(e);
//     req.flash('error', e.message);
//     res.redirect('/');
//   }
// })

// // @desc    Login/Landing page
// // @route   GET /
// router.get('/', ensureGuest, (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   })
// })

// router.post('/login', 
//   passport.authenticate('local', {
//     failureRedirect: '/dashboard'
//   }), (req, res) => {
//     res.redirect('/dashboard')
//   });

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user._id }).lean()
    res.render('dashboard', {
      name: req.username,
      stories,
    })
    console.log(stories)
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