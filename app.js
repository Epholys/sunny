var express       = require('express'),
    serveStatic   = require('serve-static'),
    serveIndex    = require('serve-index'),
    session       = require('express-session'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
var conf          = require('./config.json');

var router        = express.Router();

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, {username: 'username'});
});

passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
        if(username==='azerty' && password==='qsdfgh') {
            return done(null, {username: 'azerty'});
        }
        return done(null, false);
    }
));



router.route('/login')
    .get(function(req, res) {
        res.sendFile(__dirname+'/index.html');
    })
    .post(passport.authenticate('local-signup', {
        successRedirect: '/test',
        failureRedirect: '/login'})
         );

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}


var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: conf.SECRET_KEY,
                 resave: false,
                 saveUninitialized: false
                }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/test', isLoggedIn, serveStatic(__dirname+'/test', {dotfiles: 'allow'}));
app.use('/test', isLoggedIn, serveIndex(__dirname+'/test', {icons: true, hidden: true}));
app.use(router);
app.use(function(req, res) {
    res.redirect('/login');
});

app.listen(3000);
