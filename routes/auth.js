const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const users = require('../controllers/users');

// // @desc    Auth with Google
// // @router  GET /auth/google
// router.get('/google', passport.authenticate('google', {scope:['profile'] }))

//@router   GET /register
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

// @router  GET /login
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router