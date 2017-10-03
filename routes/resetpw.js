var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var Resetpwtoken = require('../models/resetpwtoken');
var User = require('../models/user');
var nodemailer = require('nodemailer');

var genRandomStr = function(length) {
   return crypto.randomBytes(Math.ceil(length/2))
       .toString('hex')
       .slice(0, length);
};

router.post('/', function(req, res, next) {
  var tokenH = genRandomStr(20);
  var emailH = req.body.email;
  //   console.log('second 303030!' + emailH);
  User.findOne({email: emailH}, function (err, user) {
    if(!user) {
       res.json({success: false, message: 'The email is not the one used for registry!'});
    } else {
   //   console.log('second 909090!' + user.email);
       var smtpTransport = nodemailer.createTransport('SMTP', {
              service: 'Gmail',
              auth: {
                user: 'homehomebrc@gmail.com',
                pass: 'homehome2000'
              }
           });
        var mailOptions = {
              to: user.email,
              from: 'homehomebrc@gmail.com',
              subject: 'Password Reset',
              text: 'Please click the following link to reset your password. \n\n' +
                    'http://' + req.headers.host + '/forgetpw/' + tokenH
           };
        smtpTransport.sendMail(mailOptions, function(err1) {
             if (err1) {
      //         console.log(err1);
               res.json({success: false, message: 'Error in sending email!'});
             } else {
               var pwtoken = new Resetpwtoken({
                                 email: emailH,
                                 token: tokenH,
                                 tokenExpires: Date.now() + 360000000 
                                 });
               pwtoken.save(function(err2) {
                 if (err2) {
                     //   throw err;
                   res.json({success: false, message: 'Error in saving token for password reset!'});
                 } else {
                      //   console.log('User saved ok!');         
                   res.json({success: true, message: 'Email sent out and OK!'});
                 }
               });
             }
           });
    }
  });
//  res.send('respond with a resource');
});

module.exports = router;
