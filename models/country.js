var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var countrySchema = new Schema({
      countryname: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('Country', countrySchema);
