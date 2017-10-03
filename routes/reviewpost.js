var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');

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
   Customer.findOne({email: req.uemail}, function (err, user) {
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

router.post('/', function(req, res, next) {
  var nameH;
  if(req.uname) {
    if(req.ucountry) {
      nameH = req.uname + ' from ' + req.ucountry;
    } else {
      nameH = req.uname + ' from';
    }
  } else {
    if(req.ucountry) {
      nameH = 'from ' + req.ucountry;
    } else {
      nameH = 'from';
    }
  }
  var ratingH = parseFloat(req.body.rating);
  var timeH = req.body.timePosted;
  var contentH = req.body.comment;
  var reviewH = {
     name: nameH,
     rating: ratingH,
     time: timeH,
     content: contentH
  };
   Merchant.findOneAndUpdate({email: req.body.emailforpost}, 
     {$push: {review: reviewH}, $inc: {reviewnos: 1, totalrating: ratingH}},
     function (err, user) {
       if(err) {
         res.json({success: false, message: 'Could not find the service to comment!'});
       } else {
  //     console.log('No User 909090!' + req.body.email);
         res.json({success: true, message: 'Your review posted!'});
       }
  });
});

module.exports = router;
