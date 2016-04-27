var express       = require('express'),
    serveStatic   = require('serve-static'),
    serveIndex    = require('serve-index'),
    session       = require('express-session'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    logger        = require('morgan');
    

var passport      = require('passport');
require('./passport.js')(passport);

var router        = express.Router();
require('./router.js')(router, passport);

var conf          = require('./conf.js');


var app = express();

/* Allow easy debugging without having any SSL configured, switched off by default. */
if(app.get('env') === 'dev') {
    conf.sess.cookie.secure = false;
}

/* Protects sensitive middlewares with pasportjs */
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

app.use(logger('common'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(conf.sess)),
app.use(passport.initialize());
app.use(passport.session());
app.use('/cloud', isLoggedIn, serveStatic(__dirname+conf.sunny.base_dir, {dotfiles: 'allow', index: false}));
app.use('/cloud', isLoggedIn, serveIndex(__dirname+conf.sunny.base_dir, {icons: true, hidden: true}));
app.use(router);
app.use(function(req, res) {
    res.redirect('/login');
});

app.listen(conf.sunny.port);
