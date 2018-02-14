const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let CitySchema = new Schema ({
  name: String,
  photos: [String],
});

const City = mongoose.model('Cities', CitySchema);

module.exports = City;
