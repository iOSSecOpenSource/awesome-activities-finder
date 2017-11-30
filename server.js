var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
require('dotenv').config();

var models = require('./db/models');

// create .env file in root direct if not present, assign a value to SESSION_SECRET=SOMESTRING
app.use(cookieParser());                // read cookies (needed for auth)
app.use(bodyParser());                  // get information from html forms
app.use(methodOverride('_method'));
app.use(session({secret: process.env.SESSION_SECRET})); // session secret
app.use(passport.initialize());
app.use(passport.session());            // persistent login sessions
app.use(flash());
app.use(express.static('./public'));    // set directory for static files

app.set('views', './views');            // set express view template directory for express
app.set('view engine', 'jade');        // set express view engine to use jade


// SET FLASH MESSAGES
app.get('*', function (req, res, next) {
  res.locals.successes = req.flash('success');
  res.locals.dangers = req.flash('danger');
  res.locals.warnings = req.flash('warning');
  next();
});


app.get('/', function (req, res) {
  models.Tip.findAll({include: models.User, order: [['createdAt', 'DESC']] }).then((tips) => {
    res.render('index', {currentUser: req.user, tips: tips, GoogleAPI: process.env.Google_API});
  })
});

app.get('/profile', function (req, res) {
  models.Tip.findAll({owner: req.user.username}).then((tips) => {
    res.render('profile', {currentUser: req.user, tips: tips});
  })
});

app.get('/login', (req, res, next) => {
  res.render('login');
});

app.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

// ROUTES
require('./controllers/passport')(passport);            // required for passport
require('./controllers/auth')(app, passport);           //  Routes for authentication
require('./controllers/tips')(app);                     // Routes for Tips
require('./controllers/search')(app);                     // Route for search


// ERROR HANDLING
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (err.status == 404) {
    //do logging and user-friendly error message display
    res.redirect('/404.html');
  } else if (err.status == 500) {
    res.redirect('/500.html');
  }
});

var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 8080;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
 
// EXPORT MODULE, USE BIN/WWW - SAME AS EXPRESS-GENERATOR
// NOT SURE IT MAKES ANY DIFFERENCE
module.exports = app;
