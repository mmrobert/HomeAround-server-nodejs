var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');
var Message = require('../models/message');

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

router.use(function(req, res, next) {
   User.findOne({email: req.body.email}, function (err, user) {
    if(user) {
       res.json({success: false, message: 'The email has been used!'});
    } else {
  //     console.log('No User 909090!' + req.body.email);
       next();
    }
  });
});
/* GET users listing. */
router.post('/', function(req, res, next) {
  var platformH = req.body.platform;
  var dTokenH = req.body.devicetoken;
  var dActiveH;
    if(dTokenH == '0') {
      dActiveH = false;
    } else {
      dActiveH = true;
    }
  var dActiveChangeDateH = new Date();
//
  var emailH = req.body.email;
  var pwH = req.body.password;
  var roleH = req.body.role;
  var saltH = genRandomStr(16);
  var pwData = sha512(pwH, saltH);
//     console.log('second 303030!' + saltH);
//  var objForToken = {email: emailH, password: pwH};
//  var tokenH = jwt.sign(objForToken, config.secret, {expiresIn: 999999999999999});
  var tokenH = genRandomStr(38);
//    console.log('second 505050!' + token);
  var nick = new User({
      email: emailH,
      salt: pwData.salt,
      password: pwData.passwordHash,
   //   password: pwH,
      token: tokenH,
      role: roleH,
      platform: platformH,
      deviceToken: dTokenH,
      deviceActive: dActiveH,
      dActiveChangeDate: dActiveChangeDateH});
  nick.save(function(err) {
    if (err) {
        //   throw err;
      res.json({success: false, message: 'Error in saving user!'});
    } else {
      //   console.log('User saved ok!');
      if (roleH == 'customer') {
        var cust = new Customer({email: emailH});
        cust.save(function(err) {
          if (err) {
            res.json({success: false, message: 'Error in saving customer profile!'});
          } else {
            var msg = new Message({email: emailH});
            msg.save(function(err) {
              if(err) {
                res.json({success: false, message: 'Error in creating msg document!'});
              } else {
                res.json({success: true, message: 'Customer saved!', token: tokenH});
              }
            });
          }
        });
      } else {
        var mert = new Merchant({email: emailH, reviewnos: 0, totalrating: 0});
        mert.save(function(err) {
          if (err) {
            res.json({success: false, message: 'Error in saving merchant profile!'});
          } else {
            var msg = new Message({email: emailH});
            msg.save(function(err) {
              if(err) {
                res.json({success: false, message: 'Error in creating msg document!'});
              } else {
                res.json({success: true, message: 'Merchant saved!', token: tokenH});
              }
            });
          }
        });
      }
    }
  });
//  res.send('respond with a resource');
});

module.exports = router;
