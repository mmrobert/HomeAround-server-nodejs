var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resetpwtokenSchema = new Schema({
      email: {type: String, required: true},
      token: String,
      tokenExpires: Date
});
module.exports = mongoose.model('Resetpwtoken', resetpwtokenSchema);
