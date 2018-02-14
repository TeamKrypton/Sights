//SERVER
const express = require('express');
const bodyParser= require('body-parser');
const app = express(); 
const path = require('path');
//DATABASE
const MongoClient = require('mongodb').MongoClient; 
const mongoose = require('mongoose'); 
// const City = require ('./Model.js'); 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://starburststar:star@ds233228.mlab.com:33228/cities'); //CONNECT TO DB
let db = mongoose.connection; //CALL THE DATABASE
//FLICKR API
var Flickr = require("node-flickr");
var keys = {"api_key": "f1caa3b8803601033b1eb3168ad49753"}
flickr = new Flickr(keys);
// ROUTERS
const imageController = require('./imageController');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true})) //need to make sure a POST request is added from frontend
//register our routes; routes will all be used with '/'
app.get('/', (req,res) => {
    db.collection('cities').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index.ejs', {cities: result})   
    })
});

app.post('/', imageController.getImages,  imageController.saveImages , (req,res) => {
    res.end();
})

app.listen(3000, function() {
    console.log('listening on 3000')
})