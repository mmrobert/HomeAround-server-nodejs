var apn = require('apn');
var User = require('./models/user');

var options = {"batchFeedback": true, "interval": 600};

var apnFeedback = new apn.Feedback(options);

apnFeedback.on("feedback", function(devices) {
  if(devices.length > 0) {
    var dtokenH;
    var dActiveChangeDateH = new Date();
    devices.forEach(function(item) {
      dtokenH = item.device.toString("hex");
      User.findOne({deviceToken: dtokenH}, function(err, user) {
        if (user) {
          if(user.dActiveChangeDate <= item.time) {
            user.deviceActive = false;
            user.dActiveChangeDate = dActiveChangeDateH;
            user.save(function(errS) {
              if(errS) {
                console.log('Error in updating device Token and status!');
              } else {
                console.log('OK in updating device Token and status!');
              }
            });
          } else {
            console.log('OK in updating device Token and status!');
          }
        } else {
            console.log('Error in updating device Token and status!');
        }
      });
    });
  }
});

apnFeedback.on("feedbackError", console.error);

module.exports = apnFeedback;
