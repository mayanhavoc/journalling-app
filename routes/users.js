const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'login'
    });
});

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user,password);
        res.redirect('/dashboard');
    } catch (e) {
        console.log(e);
    }
})

// // @desc    Login/Landing page
// // @route   GET /
router.get('/login', (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

router.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect('/dashboard');
  });

  // @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })


module.exports = router;

