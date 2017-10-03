var apn = require('apn');
var User = require('./models/user');

var options = {};

var apnConnection = new apn.Connection(options);

apnConnection.on("transmissionError", function(errCode, notification, device) {
  var dtokenH = device.token.toString("hex");
  if(errCode === 8) {
     User.findOneAndUpdate({deviceToken: dtokenH}, 
      {$set:{deviceActive: false}}, 
      function(err, user) {
           if (err) {
              console.log('Error in updating device Token and status!');
           } else {
              console.log('OK in updating device Token and status!');
           }
    });
  } else {
    console.error("Notification caused error: " + errCode + " for device: ", device, notification);
  }
});

module.exports = apnConnection;
