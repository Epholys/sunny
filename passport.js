var conf          = require('./conf.js');
var LocalStrategy = require('passport-local').Strategy;
var TotpStrategy  = require('passport-totp').Strategy;
var bcrypt        = require('bcrypt');
var base32        = require('thirty-two');

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        done(null, {username: username});
    });

    passport.use('local-login', new LocalStrategy(
        function(username, password, done) {
            if(username===conf.user.username &&
               bcrypt.compareSync(password, conf.user.hashed_passwd)) {
                return done(null, {username: username});
            }
            return done(null, false);
        }
    ));

    passport.use('totp', new TotpStrategy(
        function(user, done) {
            return done(null, base32.decode(conf.user.key), 30)
        }
    ));
}

