var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');

var genRandomStr = function(length) {
   return crypto.randomBytes(Math.ceil(length/2))
       .toString('hex')
       .slice(0, length);
};

var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
       salt: salt,
       passwordHash: value
    };
};

/* GET users listing. */
router.post('/', function(req, res, next) {
 // console.log('99999BB' + req.body.email);
  User.findOne({email: req.body.email}, function (err, user) {
    if(!user) {
       res.json({success: false, message: 'Wrong Email!'});
    } else {
       var saltH = user.salt;
       var pwH = req.body.password;
       var pwData = sha512(pwH, saltH);
   //    console.log('999999' + req.body.email);
       if (user.password != pwData.passwordHash) {
         res.json({success: false, message: 'Wrong Password!'});
       } else {
   //      var objForToken = {email: req.body.email, password: req.body.password};
   //      var tokenH = jwt.sign(objForToken, config.secret, {expiresIn: 999999999999999});
         var tokenH = genRandomStr(38);
//
         var platformH = req.body.platform;
         var dTokenH = req.body.devicetoken;
         var dActiveH;
         if(dTokenH == '0') {
           dActiveH = false;
         } else {
           dActiveH = true;
         }
         var dActiveChangeDateH = new Date();
         User.findOneAndUpdate({email: req.body.email}, 
              {$set:{token: tokenH, platform: platformH, deviceToken: dTokenH, 
                     deviceActive: dActiveH, dActiveChangeDate: dActiveChangeDateH}}, 
              function(errI, userI) {
           if (errI) {
             res.json({success: false, message: 'Error in saving login token!'});
           } else {
              if(user.role == 'customer') {
                Customer.findOne({email: req.body.email}, function (err, cus) {
                  if(!cus) {
                    res.json({success: false, message: 'Wrong Email!'});
                  } else {
                    var userInfos = {name: cus.name,
                                     postcode: cus.postcode,
                                     country: cus.country};
                    res.json({success: true, message: 'Welcome!',
                              token: tokenH, role: user.role,
                              userprofile: userInfos});
                  }
                });
              } else {
                Merchant.findOne({email: req.body.email}, function (err, mer) {
                  if(!mer) {
                    res.json({success: false, message: 'Wrong Email!'});
                  } else {
                    var userInfos = {name: mer.name, postcode: mer.postcode,
                                     phone: mer.phone, expertise: mer.expertise,
                                     biodetail: mer.biodetail, country: mer.country};
                    res.json({success: true, message: 'Welcome!',
                              token: tokenH, role: user.role,
                              userprofile: userInfos});
                  }
                });
              }
           }
         });
       }
     }
   });
//  res.send('respond with a resource');
});

module.exports = router;
