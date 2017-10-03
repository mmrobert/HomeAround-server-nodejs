var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Merchant = require('../models/merchant');

router.use(function(req, res, next) {
   User.findOne({token: req.body.token}, function (err, user) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
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
  //   console.log('second 303030!' + emailH);
  var emailarrH = req.body.emailarr;
  Merchant.find({email: {$in: emailarrH}}, 'email reviewnos totalrating', function (err, mers) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
    if(mers) {
       var tempI = mers.length;
       var ratinglist = [];
       if(tempI > 0) {
         for (var i = 0; i < tempI; i++) {
           var hasReviewH;
           var ratingH;
           var ratingAve;
           if(mers[i].reviewnos > 0) {
              hasReviewH = true;
              ratingAve = mers[i].totalrating / mers[i].reviewnos;
              ratingH = ratingAve.toFixed(2);
           } else {
              hasReviewH = false;
              ratingAve = 0;
              ratingH = ratingAve.toFixed(2);
           }
           ratinglist.push({
                     email: mers[i].email,
                     hasReview: hasReviewH,
                     reviewNo: mers[i].reviewnos.toString(),
                     rating: ratingH});
         }
         res.json({success: true, message: 'Rating list loaded!', ratelist: ratinglist});
       } else {
         res.json({success: false, message: 'No rating list!'});
       }
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not load rating!'});
    }
  });
//  res.send('respond with a resource');
});

module.exports = router;
