const express = require('express');
const bodyParser= require('body-parser');
const app = express(); 
const routes = require('./routes.js');
const path = require('path');


const MongoClient = require('mongodb').MongoClient; 
const mongoose = require('mongoose'); 
const City = require ('./Model.js'); 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://starburststar:star@ds233228.mlab.com:33228/cities'); //CONNECT TO DB
let db = mongoose.connection; //CALL THE DATABASE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({extended: true})) //need to make sure a POST request is added from frontend
//register our routes; routes will all be used with '/'
app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/', (req,res) => {

    db.collection('cities').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index.ejs', {cities: result})  
    })
});
    

app.post('/destinations', routes) //REQUIRE resultCONTROLLER

app.post('/delete', (req, res) => {
    console.log(req.body.name);
    db.collection('cities').findOneAndDelete({name: req.body.name},
    (err, result) => {
        if (err) return res.send(err);
        res.status(200).send(result);
    })
})



app.listen(3000, function() {
    console.log('listening on 3000')
})

