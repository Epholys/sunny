var express       = require('express'),
    serveStatic   = require('serve-static'),
    serveIndex    = require('serve-index'),
    session       = require('express-session'),
    bodyParser    = require('body-parser'),
    logger        = require('morgan');

var passport      = require('passport');
require('./passport.js')(passport);

var router        = express.Router();
require('./router.js')(router, passport);

var conf          = require('./conf.js');

var utils         = require('./utils.js');


var app = express();

/* Allow easy debugging without having any SSL configured, switched off by default. */
if(app.get('env') === 'dev') {
    conf.sess.cookie.secure = false;
}

app.use(logger('common'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(conf.sess)),
app.use(passport.initialize());
app.use(passport.session());
app.use('/cloud', utils.isLoggedIn, utils.ensureSecondFactor,
        serveStatic(__dirname+conf.sunny.base_dir, {dotfiles: 'allow', index: false}));
app.use('/cloud', utils.isLoggedIn, utils.ensureSecondFactor,
        serveIndex(__dirname+conf.sunny.base_dir, {icons: true, hidden: true}));
app.use(router);
app.use(function(req, res) {
    res.redirect('/login');
});

app.listen(conf.sunny.port);
