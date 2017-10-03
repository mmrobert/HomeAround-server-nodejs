var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
      email: {type: String, required: true, unique: true},
      msgs: [{
           email: String,
           name: String,
           time: String,
           msg: String,
           downloaded: Boolean
        }]
});

module.exports = mongoose.model('Message', messageSchema);
