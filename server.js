/* jshint esversion:6 */
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.port || 8000;

mongoose.Promise = global.Promise; // this silences the error about mongo's mpromise library
mongoose.connect("mongodb://localhost");

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


app.get('/', (req, res) => {
	if (!req.session.email) {
		res.sendFile(__dirname + '/public/login.html');
		return;
	}
	res.sendFile(__dirname + '/public/index.html');
});


app.post('/api/login', (req, res) => {
	if (!req.body.email || !req.body.password) {
		res.status(401);
		console.info('Invalid Login', req.body.email);
		res.send({status: 'error', message: 'user/pass not entered'});
		return;
	}

	User.find({email: req.body.email}, (err, user) => {
		if (user.length === 0) {
			res.status(401);
			res.send({status: 'invalid', message: 'invalid username/passord'});
		} else if (user[0].password !== req.body.password) {
			res.status(401);
			res.send({status: 'invalid', message: 'invalid username/password'});
		} else {
			req.session.email = user[0].email;
			res.send({status:"success"});
		}
	});
});

app.get('/data', (req, res) => {
	if (!req.session.email) {
		res.sendFile(__dirname + '/public/login.html');
		return;
	}
	res.sendFile(__dirname + '/public/data.html');
});

app.post('/api/logout', (req, res) => {
	delete req.session.email;
	res.send({status: 'logout', message: 'succesfully logged out'});
});

app.post('/api/register', (req, res) => {
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

app.get('/api/chunk/history', (req, res) => {
    var historySpan = req.session.chunkCount || 7;

   dataFunctions.getChunkHistory(req.session.email, historySpan, (data) => {
      res.send({chunks: data, message: 'return past ' + historySpan + ' days'});
   });
});

app.post('/api/chunk/new', (req, res) => {
	var chunk = new Chunk();

	chunk.save((err) => {
		if (err) {
			console.log(err);
			res.status(500);
			res.send({message: "error saving chunk"});
			return;
		}

		var chunkId = chunk._id;

		User.findOneAndUpdate(
			{email: req.session.email},
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

app.get('/api/interval/history', (req, res) => {
    var historySpan = req.session.intervalCount || 7;

    dataFunctions.getIntervalHistory(req.session.email, historySpan, (data) => {
        res.send({intervals: data, message: 'intervals for past ' + historySpan + ' days'});
    });
});

app.post('/api/chunk/interval', (req, res) => {
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
				res.status(500);
				res.send({message: "error saving interval"});
				return;
			}

			Chunk.findOneAndUpdate(
				{ _id: req.body.chunkId },
				{
					$push: { intervals: interval._id },
					$inc: {skillTotal: req.body.skill,
							challengeTotal: req.body.challenge
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
							skillAverage: skillTotal/intervalLength,
							challengeAverage: challengeTotal/intervalLength
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

app.post('/api/chunk/done', (req, res) => {
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



