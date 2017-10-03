var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var customerSchema = new Schema({
      email: {type: String, required: true, unique: true},
      name: String,
      postcode: String,
      photo: String,
      country: String,
      loc: {type: [Number], index: '2d'}
});

module.exports = mongoose.model('Customer', customerSchema);
