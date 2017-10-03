var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Promotion = require('../models/promotion');

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
  var loadedno = parseInt(req.body.loadednumber);
  var loadingno = parseInt(req.body.numberofLoad);
  var tempNo = loadedno + loadingno;
   Promotion.find().lean().exec(function(err, promo) {
           if (promo) {
   //             console.log('segg 3g3g3g!' + promo.length);
             var listlength = promo.length;
             var morepromo;
             var promolist = [];
             if(listlength > 0) {
               if(tempNo < listlength) {
                 morepromo = true;
                 for (var i = loadedno; i < tempNo; i++) {
                   promolist.push(promo[i].photo);
                 }
               } else {
                 morepromo = false;
                 for (var i = loadedno; i < listlength; i++) {
                   promolist.push(promo[i].photo);
                 }
               }
             } else {
               morepromo = false;
             }
             res.json({
                  success: true, message: 'Promotion list loaded!',
                  morepromotion: morepromo, 
                  loadedpromo: tempNo, list: promolist});
           } else {
             res.json({
                   success: false,
                   message: 'Error in loading promotion list!'});
           }
  });
//  res.send('respond with a resource');
});

module.exports = router;
