/* Protects sensitive middlewares with passportjs */
exports.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

exports.ensureSecondFactor = function(req, res, next) {
    if(req.session.secondFactor == 'totp') {
        return next();
    }

    res.redirect('/login-otp');
}

