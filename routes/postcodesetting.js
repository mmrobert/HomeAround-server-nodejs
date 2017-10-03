var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyBWCigYYW0aW45A_sa6Jq1tSjoJdWnE_A8',
    formatter: null
};

var geocoder = NodeGeocoder(options);

router.use(function(req, res, next) {
   User.findOne({token: req.body.token}, function (err, user) {
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
   var postcodeH = req.body.postcode;
   var countryH = req.body.country;
   var addH;
   
   if (postcodeH) {
      if (countryH) {
        addH = postcodeH + ', ' + countryH;
      } else {
        addH = postcodeH;
      }
   } else {
      if (countryH) {
        addH = countryH;
      } else {
        addH = '20525, United States';
      }
   }
  
   geocoder.geocode(addH, function(err, result) {
     var uHasGeo;
     if (result) {
       var coors = [Number];
       if (result.length > 0 ) {
         coors[0] = result[0].longitude;
         coors[1] = result[0].latitude;
         req.uloc = coors;
         uHasGeo = true;
       } else {
         uHasGeo = false;
       }
     } else {
        uHasGeo = false;
     }
     if(uHasGeo) {
       next();
     } else {
       res.json({success: false,
                message: 'Your postal code is not right, check again!'});
     }
  //    res.send(result);
   }); 
});

router.post('/', function(req, res, next) {
  var postcodeHH = req.body.postcode;
  var countryHH = req.body.country;
//  var tokenH = req.body.token;
  //   console.log('second 303030!' + emailH);
  if (req.urole == 'customer') {
    Customer.findOneAndUpdate({email: req.uemail}, 
       {$set:{postcode: postcodeHH, country:countryHH, loc: req.uloc}}, function(err, user) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in saving postal code!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your postal code has been saved!'});
           }
    });
  } else {
    Merchant.findOneAndUpdate({email: req.uemail}, 
        {$set:{postcode: postcodeHH, country:countryHH, loc: req.uloc}}, function(err, user) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in saving postal code!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your postal code has been saved!'});
           }
    });
  }
//  res.send('respond with a resource');
});

module.exports = router;
