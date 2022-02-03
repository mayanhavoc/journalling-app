const User = require('../models/User');

// module.exports.renderRegister = (req, res) => {
//     res.render('register', {
//         layout: 'register',
//     });
// }
module.exports.renderRegister = (req, res) => {
    res.render('users/register', {
      layout: 'login',
    });
}

module.exports.register = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const { email, username, password } = req.body;
        const user = new User({ _id, email, username });
        console.log(_id);
        const registeredUser = await User.register(_id, user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect("./users/dashboard");
        })
    } catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login', {
        layout: 'login',
    });
}

module.exports.login = (req, res) => {
    console.log(req);
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// module.exports.logout = (req, res) => {
//     req.logout();
//     // req.session.destroy();
//     req.flash('success', "Goodbye!");
//     res.redirect('/');
// }

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', "Goodbye!");
    res.redirect('/index');
  };