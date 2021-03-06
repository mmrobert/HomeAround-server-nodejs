var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Merchant = require('../models/merchant');

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
  var biodetailH = req.body.biodetail;
//  var tokenH = req.body.token;
  //   console.log('second 303030!' + emailH);
  Merchant.findOneAndUpdate({email: req.uemail}, {$set:{biodetail: biodetailH}}, function(err, user) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in saving biodetail!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your biodetail has been saved!'});
           }
  });
//  res.send('respond with a resource');
});

module.exports = router;
