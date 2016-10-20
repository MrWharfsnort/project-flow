/* jshint esversion:6 */
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var PORT = process.env.port || 8000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
   secret: 'hghvjkiouyutfghjhjgtyr6t78yiujknliuytre456rtfghiuhgftr5',
   resave: false,
   saveUninitialized: false
}));

app.get('/', (req, res) => {
   res.sendFile(__dirname + './index.html');
});

app.post('/api/login', (req, res) => {
   // if user is verified with database
   res.send({status: 'success', message: 'Login successful'});
   // else res.send status 'invalid'
});

app.post('/api/signup', (req, res) => {
   res.send({status: 'added', message: 'user added successfully'});
});


app.use((req, res, next) => {
   res.status(404);
   console.error('404 - ' + req.url);
   res.send({status: 'Error', message: '404 - File not found'});
});

app.use((err, req, res, next) => {
   res.status(500);
   console.error('Server error: ' + err);
   res.send({status: 'Error', message: '500 - Server Error'});
});

app.listen(PORT, () => {
   console.info('Server started on http://localhost:' + PORT);
});
