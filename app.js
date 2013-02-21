
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  
var app = express();  
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: "hogesecret"}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', routes.login);
app.get("/auth/twitter", passport.authenticate('twitter'));
app.get("/auth/twitter/callback", passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// passport
passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
 	done(null, obj);
});

// Tweeier
var TWITTER_CONSUMER_KEY = '/* Consumer key */';
var TWITTER_CONSUMER_SECRET = '/* Consumer secret */';
passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "/* Callback URL */"
}, function(token, tokenSecret, profile, done) {
	passport.session.accessToken = token;
    passport.session.profile = profile;
    process.nextTick(function () {
    	//console.log(profile);
      return done(null, profile);
    });
}));