var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var servicecatSchema = new Schema({
      catname: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('Servicecat', servicecatSchema);
