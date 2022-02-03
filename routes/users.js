const express = require('express');
const router = express.Router();
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
        console.log(registeredUser);
        res.redirect('/dashboard');
    } catch (e) {
        console.log(e);
    }
})


module.exports = router;