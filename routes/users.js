const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const users = require('../controllers/users');

router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'login'
    });
});

router.post('/register', users.register);

// // @desc    Login/Landing page
// // @route   GET /
router.get('/login', (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// router.[get('/login', 
//   passport.authenticate('local', {
//     failureRedirect: '/login'
//   }), (req, res) => {
//     console.log(res)
//     res.redirect('/dashboard');
//   });]

router.post('/login', passport.authenticate('local', {
  failureFlash: true, failureRedirect: '/login'
}), users.login)

  // @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })


module.exports = router;

