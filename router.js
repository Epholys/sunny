module.exports = function(router, passport) {

    router.route('/login')
        .get(function(req, res) {
            res.sendFile(__dirname+'/index.html');
        })
        .post(passport.authenticate('local-login',
                                    {
                                        successRedirect: '/cloud',
                                        failureRedirect: '/login'
                                    }));

    router.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/login');
        });
};
