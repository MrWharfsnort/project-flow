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
var Chunk = require("./ChunkSchema.js")(mongoose);
var User = require('./UserSchema.js')(mongoose, Chunk);


// serve up static content in the public folder
// this allows us to bring in our own js and css files
app.use(express.static('public'));

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
   if (req.session) {
      res.sendFile(__dirname + './index.html');
   } else {
      res.sendFile(__dirname + './login.html');
   }
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
         res.send({status: 'success', message: 'Login successful'});
         req.session.email = user[0].email;
         req.session.password = user[0].password;
      }
   });
});

app.post('/api/logout', (req, res) => {
   delete req.session.user;
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
