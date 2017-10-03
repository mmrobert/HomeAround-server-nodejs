var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Postedjob = require('../models/postedjob');

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
  var createdtimeH = req.body.createdtime;
  //   console.log('second 303030!' + emailH);
  Postedjob.findOneAndRemove({email: req.uemail, createdtime: createdtimeH}, 
         function(err, job) {
           if (err) {
              res.json({
                   success: false,
                   message: 'Error in deleting job!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your job has been deleted!'});
           }
  });
//  res.send('respond with a resource');
});

module.exports = router;
