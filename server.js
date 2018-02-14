const express = require('express');
const bodyParser= require('body-parser');
const app = express(); 
const routes = require('./routes.js');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userModel.js');
const City = require('./models/cityModel.js');
// stores data on server - an object that stores session in memory
const session = require('cookie-session');

const MongoClient = require('mongodb').MongoClient; 
const mongoose = require('mongoose');

// set mongoos to es6 promises
mongoose.Promise = global.Promise;
// CONNECT TO DB
mongoose.connect('mongodb://starburststar:star@ds233228.mlab.com:33228/cities', (err) => {
  if(err) throw err;
  console.log('Successfully connected to MongoDB');
});
// CALL THE DATABASE
let db = mongoose.connection;
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));


// TEST DATA
const testData = require('./test/testLoginData.js');

// PASSPORT CONFIGURATION
// When we run statement we will pass in a secret
app.use(require('express-session')({
  secret: 'Flicker',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// register our routes; routes will all be used with '/'
app.get('/', (req, res) => {
  db.collection('cities').find().toArray((err, result) => {
    if (err) return console.log(err);
    console.log(result);
    res.render('index.ejs', { cities: result });
  });
});

// REQUIRE resultCONTROLLER
app.post('/destinations', routes);


//-------------
// AUTHENTICATION ROUTES
// ------------

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

// handle sign up logic
app.post('/register', (req, res) => {
  // use passsport-local-mongoos package, pass in new user that has a username from form assigned
  let newUser = new User({username: req.body.username });
  // pass in password from form and will store and passing in newUser who only has a username assigned
  // register wont store password, but will store a hash
  // User will be newly created user
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.send('error');
    }
    
    // if that works then using authenticate and login
    // redirect them to homepage
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
});

// HANDLE LOGIN LOGIC/
// Login has two requests: Get to show the form, post to login

// show login form
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

// handle login logic
// when a request comes in from login middleware passport run first -> passport.authenticate middleware on local strategy, given a metho,d which will take req.body.username & req.body.password
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
  }), (req, res) => {  
});


// REMOVE ME!!!
// I set fake data for testing
// testData();


// PORT
app.listen(3000, () => {
  console.log('Listening on 3000');
});
