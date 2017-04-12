var utils = require('./utils.js');

module.exports = function(router, passport) {

    router.route('/login')
        .get(function(req, res) {
            res.sendFile(__dirname+'/index.html');
        })
        .post(passport.authenticate('local-login',
                                    {
                                        successRedirect: '/login-otp',
                                        failureRedirect: '/login'
                                    }));

    router.route('/login-otp')
        .all(function(req, res, next) {
            utils.isLoggedIn(req, res, next)
        })
        .get(function(req, res) {
            res.sendFile(__dirname+'/otp.html');
        })
        .post(passport.authenticate('totp', {/*successRedirect: '/cloud',*/ failureRedirect: '/login-otp'}),
              function(req, res) {
                  req.session.secondFactor = 'totp'
                  res.redirect('/cloud/')
              });
    
    router.route('/logout')
        .get(function(req, res) {
            req.session.secondFactor = '';
            req.logout();
            res.redirect('/login');
        });
};
