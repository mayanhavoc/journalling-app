const Story = require('../models/Story');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateUser = (req, res, next) => {
    const { error } = storySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/')
    }
}