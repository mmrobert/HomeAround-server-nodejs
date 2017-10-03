var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');
var Message = require('../models/message');

var apn = require('apn');
var apnConnection = require('../apnConnection');

var fcm = require('../fcm');

router.use(function(req, res, next) {
   User.findOne({token: req.body.token}, function (err, user) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
    if(user) {
       req.uemail = user.email;
       req.urole = user.role;
       next();
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not be authenticated!'});
    }
  });
});

router.use(function(req, res, next) {
   Merchant.findOne({email: req.uemail}, function (err, user) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
    if(user) {
       req.uname = user.name;
       req.ucountry = user.country;
       next();
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not find customer profile!'});
    }
  });
});

router.use(function(req, res, next) {
   User.findOne({email: req.body.emailToSend}, function (err, user) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
    if(user) {
       req.cusDevice = user.deviceToken;
       req.cusActive = user.deviceActive;
       req.cusPlatform = user.platform;
       next();
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not send message!'});
    }
  });
});

router.post('/', function(req, res, next) {
  var timeH = req.body.timeMsg;
  var msgH = req.body.msg;
  var msgObjectH = {
        email: req.uemail,
        name: req.uname,
        time: timeH,
        msg: msgH,
        downloaded: false
  };
   Message.findOneAndUpdate({email: req.body.emailToSend}, 
     {$push: {msgs: msgObjectH}},
     function (err, user) {
       if(err) {
         res.json({success: false, message: 'Could not send message!'});
       } else {
  //     console.log('No User 909090!' + req.body.email);
         if(req.cusPlatform == 'ios' && req.cusActive) {
           var apnDevice = new apn.Device(req.cusDevice);
           var note = new apn.Notification();
           note.expiry = Math.floor(Date.now()/1000) + 3600;
           note.sound = 'ping.aiff';
           note.alert = 'You have a new message.';
           
           apnConnection.pushNotification(note, apnDevice);
         } else if(req.cusPlatform == 'android' && req.cusActive) {
           var msgsSendingH = {
              to: req.cusDevice,
              collapse_key: 'collapse_key',
              notification: {title: 'HomeAround',
                             body: 'You have a new message.'
                            }
            }; 
            fcm.send(msgsSendingH, function(errAn, resAn) {
              if(errAn) {
                 
              } else {
                 
              }
            });
         } 
         
         res.json({success: true, message: 'Your message has been sent!'});
       }
  });
});

module.exports = router;
