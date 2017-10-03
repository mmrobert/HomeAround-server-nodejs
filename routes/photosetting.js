var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');
var Promotion = require('../models/promotion');

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

router.post('/', function(req, res, next) {
  var photoH = req.body.photo;
//  var tokenH = req.body.token;
  //   console.log('second 303030!' + emailH);
  if (req.urole == 'customer') {
    Customer.findOneAndUpdate({email: req.uemail}, {$set:{photo: photoH}}, function(err, user) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in saving photo!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your photo has been saved!'});
           }
    });
  } else {
    Merchant.findOneAndUpdate({email: req.uemail}, {$set:{photo: photoH}}, function(err, user) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in saving photo!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your photo has been saved!'});
           }
    });
  }
//  res.send('respond with a resource');
});

module.exports = router;
