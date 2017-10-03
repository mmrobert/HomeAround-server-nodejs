var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var Resetpwtoken = require('../models/resetpwtoken');
var User = require('../models/user');

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

router.get('/:token', function(req, res, next) {
//    console.log('second 505050!' + token);
  Resetpwtoken.findOne({token: req.params.token, tokenExpires: {$gt: Date.now()}}, function (errR, userR) {
    if(!userR) {
     //  res.json({success: false, message: 'The link has expired, go back to the app and try again!'});
       res.send('The link has expired, go back to the app and try again!');
    } else {
       res.render('forgetpw', {title: 'HomeHome'});
    }
  });
//  res.send('respond with a resource');
});

router.post('/:token', function(req, res, next) {
  var pwH = req.body.password;
  var saltH = genRandomStr(16);
  var pwData = sha512(pwH, saltH);
//     console.log('second 303030!' + saltH);
  Resetpwtoken.findOne({token: req.params.token, tokenExpires: {$gt: Date.now()}}, function (errR, userR) {
    if(!userR) {
       res.send('The link has expired, go back to the app and try again!');
    } else {
       User.findOneAndUpdate({email: userR.email}, 
               {$set:{password: pwData.passwordHash, salt: pwData.salt}},
          //   {$set:{password: pwH, salt: pwData.salt}},        
        function(err, user) {
           if (err) {
             res.send('Error in saving new password!');
           } else {
             userR.remove(function(errI) {
                if(errI) {
                  res.send('Error in removing password reset token!');
          //        console.log('Error in removing token for reset password!');
                } else {
                  res.redirect('/pwreseted');
                }
             });
           }
         });
    }
  });
//  res.send('respond with a resource');
});

module.exports = router;
