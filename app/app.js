var express = require('express')
,	session	= require('express-session')
,	bodyParser = require('body-parser')
,	mongoose = require('mongoose')
,	passport = require('passport')
,	pass = require('./passport')
,	swig = require('swig')
,	app = express();

// Connect to MongoDB.

mongoose.connect('mongodb://localhost/passport-demo-app', function (err, db) {
	if (err) throw err;
	console.log("Connected to database...");
});

// Swig configuration

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Call passport configuration.

pass(passport);

// Configures body parsing middleware.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ secret: 'pass', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Root route.

app.get('/', function (req, res) {
	if (req.user == null) {
		res.render('index', { name: "stranger", session: "Login", link: "/login" });	
	} else {
		res.render('index', { name: req.user.name, photo: req.user.photo, session: "Logout", link: "/logout" });
	}
});

// Redirect the user to Twitter for authentication. Finish the
// authentication process by attempting to obtain an access token. If
// access was granted, the user will be logged in. Otherwise,
// authentication has failed.

app.get('/login', passport.authenticate('twitter'), function (req, res) {
	// Twitter will redirect the user to this URL after approval.
	res.redirect('/');
});

// Logout the user.
// It will remove the req.user property and clear the login session (if any).

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.listen(3000);
console.log("App listening on port 3000");