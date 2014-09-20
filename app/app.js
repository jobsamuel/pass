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

// Swig configuration.

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

app.use(session({ secret: 'pass', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes.

app.get('/', function (req, res) {
	var user = req.session.passport.user;
	if (user == null) {
		res.render('index', { name: "Stranger" });	
	} else {
		res.render('index', { name: user.name });
	}
});

app.get('/login', function (req, res) {
	res.send({message: "Login!"});
});


// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at: /auth/twitter/callback

app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }));

app.listen(3000);
console.log("App listening on port 3000");