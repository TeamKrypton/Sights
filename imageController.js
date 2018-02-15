'use strict';
// MIDDLEWARE
const request = require('request');
const router = require('express').Router();
// DATABASE SCHEMA
const City = require ('./Model.js')
//DB CONNECTION
const MongoClient = require('mongodb').MongoClient; 
const mongoose = require('mongoose'); 
let CityModel = require ('./Model.js'); 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://starburststar:star@ds233228.mlab.com:33228/cities'); //CONNECT TO DB
let db = mongoose.connection; //CALL THE DATABASE

// CONTROLLER
const imageController = {};

// CONTROLLER METHODS
imageController.getImages = (req, res, next) => {
    const name = req.body.name;
    let urlArr = [];
    flickr.get("photos.search", {"tags":name, "tags": "scenic", "text": name, "per_page": 3}, function(err, result){
        let imgArr = result.photos.photo;
        imgArr.map(function(img){
            return urlArr.push(`https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}.jpg`)
        })
    res.locals.name = name;
    res.locals.photos = urlArr;
    next();
    })
}

 imageController.saveImages = (req, res) => {
    let cityName = req.body.name;
    req.body.photos = res.locals.photos;
    let cityData = new CityModel (req.body);
    // console.log(cityData)
        cityData.save()
            .then(city => {
                res.status(200).redirect('/');
                window.location.reload();
                window.onload=toBottom;
            })
            .catch(err => {
                res.status(400).send('unable to save to db');
            })    
}

module.exports = imageController;
