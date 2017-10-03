var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');

var mongoose = require('mongoose');

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

router.use(function(req, res, next) {
   Customer.findOne({email: req.uemail}, function (err, user) {
    if(user) {
       var locH = user.loc;
       if(locH) {
     //  req.uloc = [];
         if(locH.length > 1) {
            req.uloc = user.loc;
            req.ucountry = user.country;
            next();
         } else {
            res.json({success: false, message: 'Please update your postal code in Settings to match services nearby!'});
         }
       } else {
          res.json({success: false, message: 'Please update your postal code in Settings to match services nearby!'});
       }
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not be authenticated!'});
    }
  });
});

router.post('/', function(req, res, next) {
  //   console.log('second 303030!' + emailH);
  var svcatH = req.body.servicecat;
  var loadedno = parseInt(req.body.loadednumber);
  var loadingno = parseInt(req.body.numberofLoad);
  var tempNo = loadedno + loadingno;
  var disMul;
  var maxDis;
  if(req.ucountry == 'Canada') {
     disMul = 6371;
     maxDis = 500/6371;
  } else {
     disMul = 3959;
     maxDis = 310/3959;
  }
  mongoose.connection.db.command({
     geoNear: "merchants",
     near: req.uloc,
     spherical: true,
     query: {country: req.ucountry, expertise: svcatH},
     distanceMultiplier: disMul,
     maxDistance: maxDis
  }, function (err, result) {
       if(err) {
         res.json({success: false, message: 'Error in matching services!'});
       } else {
         if(result) {
           var returnH = result.results;
           if(returnH) {
             var noH = returnH.length;
             if(noH > 0) {
               var moremer;
               var servicelist = [];
               if(tempNo < noH) {
                 moremer = true;
                 for (var i = loadedno; i < tempNo; i++) {
                   var hasReviewH;
                   var ratingAve;
                   if(returnH[i].obj.reviewnos > 0) {
                     hasReviewH = true;
                     ratingAve = returnH[i].obj.totalrating / returnH[i].obj.reviewnos;
                   } else {
                     hasReviewH = false;
                     ratingAve = 0;
                   }
                   var tempdis;
                   if(req.ucountry == 'Canada') {
                      tempdis = returnH[i].dis.toFixed(2) + ' Km';
                   } else {
                      tempdis = returnH[i].dis.toFixed(2) + ' mile';
                   }
                   var tempreviewno = returnH[i].obj.reviewnos.toString();
                   var temprating = ratingAve.toFixed(2);
                   servicelist.push({
                     name: returnH[i].obj.name, email: returnH[i].obj.email,
                     distance: tempdis, hasReview: hasReviewH,
                     reviewNo: tempreviewno, rating: temprating,
                     detail: returnH[i].obj.biodetail});
                 }
               } else {
                 moremer = false;
                 for (var i = loadedno; i < noH; i++) {
                   var hasReviewH;
                   var ratingAve;
                   if(returnH[i].obj.reviewnos > 0) {
                     hasReviewH = true;
                     ratingAve = returnH[i].obj.totalrating / returnH[i].obj.reviewnos;
                   } else {
                     hasReviewH = false;
                     ratingAve = 0;
                   }
                   var tempdis;
                   if(req.ucountry == 'Canada') {
                      tempdis = returnH[i].dis.toFixed(2) + ' Km';
                   } else {
                      tempdis = returnH[i].dis.toFixed(2) + ' mile';
                   }
                   var tempreviewno = returnH[i].obj.reviewnos.toString();
                   var temprating = ratingAve.toFixed(2);
                   servicelist.push({
                     name: returnH[i].obj.name, email: returnH[i].obj.email,
                     distance: tempdis, hasReview: hasReviewH,
                     reviewNo: tempreviewno, rating: temprating,
                     detail: returnH[i].obj.biodetail});
                 }
               }
            //      console.log('9xx9!' + servicelist[0].name);
               res.json({success: true, message: 'Services loaded!', 
                    moreloads: moremer, loadedsvc: tempNo, svclist: servicelist});
             } else {
               res.json({success: false, message: 'No matching service!'});
             }
           } else {
             res.json({success: false, message: 'No matching service!'});
           }
         } else {
           res.json({success: false, message: 'No matching service!'});
         }
       }
    });
  
//  res.send('respond with a resource');
});

module.exports = router;
