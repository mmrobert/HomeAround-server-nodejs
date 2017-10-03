var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postedjobSchema = new Schema({
      email: {type: String, required: true},
      name: String,
      country: String,
      loc: {type: [Number], index: '2d'},
      jobcat: String,
      createdtime: String,
      jobstatus: String,
      jobtitle: String,
      timetofinish: String,
      jobdetail: String
});

module.exports = mongoose.model('Postedjob', postedjobSchema);
