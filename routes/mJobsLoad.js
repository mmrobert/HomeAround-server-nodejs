var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Merchant = require('../models/merchant');
var Postedjob = require('../models/postedjob');

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
   Merchant.findOne({email: req.uemail}, function (err, user) {
    if(user) {
       var locH = user.loc;
       if(locH) {
     //  req.uloc = [];
         if(locH.length > 1) {
            req.uloc = user.loc;
            req.ucountry = user.country;
            next();
         } else {
            res.json({success: false, message: 'Please update your postal code in Settings to match jobs nearby!'});
         }
       } else {
          res.json({success: false, message: 'Please update your postal code in Settings to match jobs nearby!'});
       }
    } else {
  //     console.log('No User 909090!' + req.body.email);
       res.json({success: false, message: 'Could not be authenticated!'});
    }
  });
});

router.post('/', function(req, res, next) {
  //   console.log('second 303030!' + emailH);
  var jobcatH = req.body.jobcat;
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
  
  var queryH;
  if(jobcatH == 'All') {
        console.log('qxyxq 3p3p3p!' + jobcatH);
     queryH = {country: req.ucountry, jobstatus: 'Posted'};
  } else {
     queryH = {country: req.ucountry, jobcat: jobcatH, jobstatus: 'Posted'};
  }
  
  mongoose.connection.db.command({
     geoNear: "postedjobs",
     near: req.uloc,
     spherical: true,
     query: queryH,
     distanceMultiplier: disMul,
     maxDistance: maxDis
  }, function (err, result) {
       if(err) {
         res.json({success: false, message: 'Error in matching jobs!'});
       } else {
         if(result) {
           var returnH = result.results;
           if(returnH) {
             var noH = returnH.length;
             if(noH > 0) {
               var morejob;
               var joblist = [];
               if(tempNo < noH) {
                 morejob = true;
                 for (var i = loadedno; i < tempNo; i++) {
                   var tempdis;
                   if(req.ucountry == 'Canada') {
                      tempdis = returnH[i].dis.toFixed(2) + ' Km';
                   } else {
                      tempdis = returnH[i].dis.toFixed(2) + ' mile';
                   }
                   joblist.push({
                     name: returnH[i].obj.name, email: returnH[i].obj.email,
                     distance: tempdis, timePosted: returnH[i].obj.createdtime,
                     jobTitle: returnH[i].obj.jobtitle, timeFinish: returnH[i].obj.timetofinish,
                     detail: returnH[i].obj.jobdetail});
                 }
               } else {
                 morejob = false;
                 for (var i = loadedno; i < noH; i++) {
                   var tempdis;
                   if(req.ucountry == 'Canada') {
                      tempdis = returnH[i].dis.toFixed(2) + ' Km';
                   } else {
                      tempdis = returnH[i].dis.toFixed(2) + ' mile';
                   }
                   joblist.push({
                     name: returnH[i].obj.name, email: returnH[i].obj.email,
                     distance: tempdis, timePosted: returnH[i].obj.createdtime,
                     jobTitle: returnH[i].obj.jobtitle, timeFinish: returnH[i].obj.timetofinish,
                     detail: returnH[i].obj.jobdetail});
                 }
               }
            //      console.log('9xx9!' + servicelist[0].name);
               res.json({success: true, message: 'Jobs loaded!', 
                    moreloads: morejob, loadedjobs: tempNo, list: joblist});
             } else {
               res.json({success: false, message: 'No matching job!'});
             }
           } else {
             res.json({success: false, message: 'No matching job!'});
           }
         } else {
           res.json({success: false, message: 'No matching job!'});
         }
       }
    });
  
//  res.send('respond with a resource');
});

module.exports = router;
