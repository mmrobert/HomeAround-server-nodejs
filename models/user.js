var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
      email: {type: String, required: true, unique: true},
      salt: String,
      password: String,
      token: String,
      role: {type: String, required: true},
      platform: String,
      deviceToken: String,
      deviceActive: Boolean,
      dActiveChangeDate: Date
});

module.exports = mongoose.model('User', userSchema);
