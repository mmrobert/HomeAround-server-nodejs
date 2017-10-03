var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var merchantSchema = new Schema({
      email: {type: String, required: true, unique: true},
      name: String,
      postcode: String,
      photo: String,
      phone: String,
      expertise: [String],
      biodetail: String,
      country: String,
      loc: {type: [Number], index: '2d'},
      reviewnos: Number,
      totalrating: Number,
      review: [{
           name: String,
           rating: Number,
           time: String,
           content: String
        }]
});

module.exports = mongoose.model('Merchant', merchantSchema);
