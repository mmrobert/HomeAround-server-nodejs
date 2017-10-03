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

router.use(function(req, res, next) {
 //  var postcodeH = req.body.postcode; 
   Customer.findOne({email: req.uemail}, function (err, user) {
    if(user) {
       req.uloc = user.loc;
       req.uname = user.name;
       next();
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not find customer profile!'});
    }
  });
});

router.post('/', function(req, res, next) {
  var createdtimeH = req.body.createdtime;
  var jobstatusH = req.body.jobstatus;
  var jobtitleH = req.body.jobtitle;
  var timetofinishH = req.body.timetofinish;
  var jobdetailH = req.body.jobdetail;
  //   console.log('second 303030!' + emailH);
  Postedjob.findOneAndUpdate({email: req.uemail, createdtime: createdtimeH}, 
        {$set:{jobstatus: jobstatusH, jobtitle: jobtitleH, 
               timetofinish: timetofinishH, jobdetail: jobdetailH, 
               name: req.uname}}, 
        function(err, job) {
           if (err) {
              res.json({
                   success: false,
                   message: 'Error in updating job!'});
           } else {
              res.json({
                  success: true,
                  message: 'Your job has been updated!'});
           }
  });
//  res.send('respond with a resource');
});

module.exports = router;
