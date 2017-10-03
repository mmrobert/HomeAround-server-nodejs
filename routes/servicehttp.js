var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');

var mongoose = require('mongoose');

router.use(function(req, res, next) {
 //  User.findOne({token: req.body.token}, function (err, user) {
   User.findOne({email: 'tty@yahoo.ca'}, function (err, user) {
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
    if(user) {
       var locH = user.loc;
       if(locH) {
     //  req.uloc = [];
         if(locH.length > 1) {
            req.uloc = user.loc;
            req.ucountry = user.country;
            next();
         } else {
            res.json({success: false, message: 'Please update your postal code in setting to match services nearby!'});
         }
       } else {
          res.json({success: false, message: 'Please update your postal code in setting to match services nearby!'});
       }
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not be authenticated!'});
    }
  });
});

router.get('/', function(req, res, next) {
  //   console.log('second 303030!' + emailH);
//  var svcatH = req.body.servicecat;
//  var loadedno = parseInt(req.body.loadednumber);
//  var loadingno = parseInt(req.body.numberofLoad);
//  var tempNo = loadedno + loadingno;
  mongoose.connection.db.command({
     geoNear: "merchants",
     near: req.uloc,
     spherical: true,
   //  query: {country: req.ucountry, expertise: svcatH},
     distanceMultiplier: 6371,
     maxDistance: 500/6371
  }, function (err, result) {
       if(err) {
         res.json({success: false, message: 'Error in matching services!'});
       } else {
         res.send(result.results);
       }
    });
  
//  res.send('respond with a resource');
});

module.exports = router;
