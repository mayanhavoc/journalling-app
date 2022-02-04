const express = require('express')
const router = express.Router();
const passport = require('passport');
// const { ensureAuth, ensureGuest } = require('../middleware/auth');
const User = require('../models/User');
const users = require('../controllers/users');
const Story = require('../models/Story');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', isLoggedIn, async (req, res) => {
    try {
      const stories = await Story.find({ user: req.user._id }).lean()
      res.render('dashboard', {
        name: req.username,
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })



module.exports = router;