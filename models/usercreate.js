var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/:emailH', function(req, res, next) {
var emailHH = req.params.emailH;
       var nick = new User({
                      email: emailHH,
                      password: '123456',
                      role: 'customer',
                      platform: 'ios',
                      dActiveChangeDate: new Date()});
        nick.save(function(err) {
                 if (err) {
                     //   throw err;
                   res.json({success: false, message: 'Error in creating new user!'});
                 } else {
                      //   console.log('User saved ok!');         
                   res.json({success: true, message: 'New user created and OK!'});
                 }
               });

//  User.find({}, function(err, users) {
 //  console.log('here you are, 888');
 //   res.json(users);
 // });
});

module.exports = router;
