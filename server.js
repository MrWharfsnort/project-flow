/* jshint esversion:6 */
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var uristring = 
  process.env.MONGODB_URI || 
  'mongodb://<dbuser>:<dbpassword>@ds127948.mlab.com:27948/heroku_q79xlp0l';

var PORT = process.env.PORT || 8001;

mongoose.Promise = global.Promise; // this silences the error about mongo's mpromise library

mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// pull in the user model
var Interval = require("./intervalSurveySchema.js")(mongoose);
var Chunk = require("./ChunkSchema.js")(mongoose, Interval);
var User = require('./UserSchema.js')(mongoose, Chunk);
var dataFunctionsConstructor = require('./dataFunctions.js');
var dataFunctions = new dataFunctionsConstructor(mongoose, User, Chunk, Interval);

// basic config for body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// basic config for express-session
app.use(session({
	secret: 'hghvjkiouyutfghjhjgtyr6t78yiujknliuytre456rtfghiuhgftr5',
	resave: false,
	saveUninitialized: false
}));


app.get('/', (req, res) => {//get root of the site
	if (!req.session.email) {//if not logged in, redirect to login page
		res.sendFile(__dirname + '/public/index2.html');
		return;
	}
	res.sendFile(__dirname + '/public/Dashboard/Theme/dashboard.html'); //if logged in send index.html
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/public/loginFE.html');
});

app.post('/api/login', (req, res) => {//login page
	if (!req.body.email || !req.body.password) {//if no email or password provided send error
		res.status(401);
		console.info('Invalid Login', req.body.email);
		res.send({status: 'error', message: 'user/pass not entered'});
		return;
	}

	User.find({email: req.body.email}, (err, user) => {//search for provided email and password in user database
		if (user.length === 0) {
			res.status(401);
			res.send({status: 'invalid', message: 'invalid username/password'});
		} else if (user[0].password !== req.body.password) {
			res.status(401);
			res.send({status: 'invalid', message: 'invalid username/password'});
		} else {//if user is found set session email
			req.session.email = user[0].email;
			res.send({status:"success"});
		}
	});
});

app.get('/dashboard', (req, res) => {
	if (!req.session.email) {
		res.sendFile(__dirname + '/public/loginFE.html');
		return;
	}

	res.sendFile(__dirname + '/public/Dashboard/Theme/dashboard.html');
});

app.get('/data', (req, res) => {//data display page
	if (!req.session.email) {//if not logged in redirect to login page
		res.sendFile(__dirname + '/public/loginFE.html');
		return;
	}
	res.sendFile(__dirname + '/public/data.html');//otherwise send data.html
});

app.post('/api/logout', (req, res) => {//logout api
	delete req.session.email;
	res.send({status: 'logout', message: 'succesfully logged out'});
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/siteFrontEnd/register.html');
});


app.post('/api/register', (req, res) => {//api to register a new user
	// find this email in the database and see if it already exists
	User.find({email: req.body.email}, (err, data) => {
		if (data.length === 0) {      // if the user doesn't exist
			var newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			});

			newUser.save((err) => { // save the newUser object to the database
				if (err) {
					res.status(500);
					console.error(err);
					res.send({status: 'Error', message: 'unable to register user:' + err});
				}
				res.send({status: 'success', message: 'user added successfully'});
			});
		} else if (err) { // send back an error if there's a problem
			res.status(500);
			console.error(err);
			res.send({status: 'Error', message: 'server error: ' + err});
		} else {
			res.send({status: 'Error', message: 'user already exists'}); // otherwise the user already exists
		}
	});
});

app.get('/api/chunk/history', (req, res) => {//api for getting a history of chunks
    if (!req.session.email) {
        res.send({status: 'error', message: 'I\'m afraid I can\'t allow that, dave.. You must be logged in'});
        return;
    }
    var historySpan = req.session.chunkCount || 7;//history of chunkCount days or 7 days if chunkCount is not provided by the front end

   dataFunctions.getChunkHistory(req.session.email, historySpan, (data) => {
      res.send({chunks: data, message: 'return past ' + historySpan + ' days'});//sends back an array of chunk data objects
   });
});

app.post('/api/chunk/new', (req, res) => {//api that creates a new chunk when user starts a timer for the day
	var chunk = new Chunk({
        caffeineTotal: 0,
        snackTotal: 0
    });

	chunk.save((err) => {
		if (err) {
			console.log(err);
			res.status(500);
			res.send({message: "error saving chunk"});
			return;
		}

		var chunkId = chunk._id;

		User.findOneAndUpdate(//this is to psuh the chunk id to the user's array of chunk ids
			{
                email: req.session.email
            },
			{$push: {chunks: chunkId}},
			(err, data) => {
			if(err) {
				console.log(err);
				res.status(500);
				res.send({message: "error updating user"});
				return;
			}
			res.send({chunkId: chunkId});
		});
	});
});

app.get('/api/interval/history', (req, res) => {//api for getting a history of intervals
    if (!req.session.email) {
        res.send({status: 'error', message: 'I\'m afraid I can\'t allow that, dave.. You must be logged in'});
        return;
    }
    var historySpan = req.session.intervalCount || 7;//if intervalCount is not provided it will return a 7 day history of intervals

    dataFunctions.getIntervalHistory(req.session.email, historySpan, (data) => {
        res.send({intervals: data, message: 'intervals for past ' + historySpan + ' days'});//intervals are sent back as an array of intervals
    });
});

app.post('/api/chunk/interval', (req, res) => {
    if (!req.session.email) {
        res.send({status: 'error', message: 'I\'m afraid I can\'t allow that, dave.. You must be logged in'});
        return;
    }

	dataFunctions.getChunkHistory(req.session.email, 7, function(chunks) {//get history to compare skill and challenge average to current values
		var flow;
		var sa = 0;
		var ca = 0;
		var count = 0;
		for(var each of chunks) {
			if(each.skillAverage){
				sa += each.skillAverage;
				ca += each.challengeAverage;
				count++;
			}
		}
		sa = sa / count; //skill average for past 7 chunks
		ca = ca / count; //challenge average for past 7 chunks
		if(sa && ca) {//this tree calculates current flow rating for interval
			if(req.body.skill < sa && req.body.challenge > ca) {
				flow = req.body.skill - sa;
			} else if (req.body.skill > sa && req.body.challenge < ca) {
				flow = req.body.challenge - ca;
			} else {
				flow = (req.body.challenge - ca) + (req.body.skill - sa);
			}
		}
		var interval = new Interval({//create new interval
            email: req.session.email,
            date: req.body.date,
			timeFromStart: req.body.timeFromStart,
			perceivedChallenge: req.body.challenge,
			percievedSkill: req.body.skill,
			activity: req.body.activity,
			caffeine: req.body.caffeine,
			snack: req.body.food,
			flow: flow
		});

		interval.save((err) => {//save interval
			if (err) {
				console.log(err);
				res.status(500);
				res.send({message: "error saving interval"});
				return;
			}

			Chunk.findOneAndUpdate(//update the current chunk
				{ _id: req.body.chunkId },
				{
					$push: { intervals: interval._id },//push id of new interval to chunk's array of interval ids
					$inc: {skillTotal: req.body.skill,//add the skill rating of current interval to chunk total
                        challengeTotal: req.body.challenge,//add the challenge rating of curren interval to chunk total
                        caffeineTotal: req.body.caffeine,
                        snackTotal: req.body.food
					}
				},{new:true},
				(err, data) => {
					if (err) {
						console.log(err);
						res.status(500);
						res.send({message: "error updating chunk"});
						return;
					}
					var skillTotal = data.skillTotal;
					var challengeTotal = data.challengeTotal;
					var intervalLength = data.intervals.length;
					Chunk.findOneAndUpdate(
						{_id: req.body.chunkId},
						{
							skillAverage: skillTotal/intervalLength,//recalculate skill average for the chunk
							challengeAverage: challengeTotal/intervalLength//recalculate challenge average for the chunk
						},
						(err, data) => {
							if(err){
								return console.log(err);
							}
							res.send("success");
						}
					);
				}
			);
		});
	});
});

app.post('/api/chunk/done', (req, res) => {//when the chunk is finished the final survey is added to the chunk
	console.log(req.body);
	Chunk.findOneAndUpdate(
		{_id: req.body.chunkId}, {
			timeSpent: req.body.timeSpent,
			timeOfDay: req.body.timeOfDay,
			hoursSlept: req.body.sleep,
			mealsEaten: req.body.meals
		}, (err, data) => {
		if (err) {
			console.log(err);
			res.status(500);
			res.send({message: "error updating chunk"});
		}
		res.send("success");
	});
});

// serve up static content in the public folder
// this allows us to bring in our own js and css files
app.use(express.static('public'));

// 404 error handling
app.use((req, res, next) => {
	res.status(404);
	console.error('404 - ' + req.url);
	res.send({status: 'Error', message: '404 - File not found'});
});

// 500 error handling
app.use((err, req, res, next) => {
	res.status(500);
	console.error('Server error: ' + err);
	res.send({status: 'Error', message: '500 - Server Error'});
});

// start the server
app.listen(PORT, () => {
	console.info('Server started on http://localhost:' + PORT);
});



