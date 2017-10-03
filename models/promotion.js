var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var promotionSchema = new Schema({
      email: String,
      name: String,
      photo: String
});

module.exports = mongoose.model('Promotion', promotionSchema);
