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
  var emailreviewH = req.body.emailreview;
 //   console.log('second 3x3x3x!' + emailreviewH);
  Merchant.findOne({email: emailreviewH}, function (err, mer) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
    if(mer) {
       var reviewlistH = mer.review;
       if(reviewlistH) {
         var listlength = reviewlistH.length;
         if(listlength > 0) {
           for (var i = 0; i < listlength; i++) {
             var ratingStr = reviewlistH[i].rating.toFixed(2);
             reviewlistH[i].rating = parseFloat(ratingStr);
           }
           var toReturnList = [];
           for (var i = 0; i < listlength; i++) {
             var ii = listlength - i - 1;
             toReturnList.push(reviewlistH[ii]);
           }
           var hasReviewsH;
           var ratingsH;
           var ratingAveH;
           if(mer.reviewnos > 0) {
              hasReviewsH = true;
              ratingAveH = mer.totalrating / mer.reviewnos;
              ratingsH = ratingAveH.toFixed(2);
           } else {
              hasReviewsH = false;
              ratingAveH = 0;
              ratingsH = ratingAveH.toFixed(2);
           }
           var reviewNoH = mer.reviewnos.toString();
           res.json({success: true, message: 'Review loaded!', hasReview: hasReviewsH, 
                     reviewNo: reviewNoH, ratings: ratingsH, reviewlist: toReturnList});
         } else {
           res.json({success: false, message: 'No review yet!'});
         }
        } else {
          res.json({success: false, message: 'No review yet!'});
        }
    } else {
      res.json({success: false, message: 'Could not load review!'});
    }
  });
//  res.send('respond with a resource');
});

module.exports = router;
