var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Merchant = require('../models/merchant');
var Message = require('../models/message');

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
 //   console.log('second 3x3x3x!' + emailreviewH);
  Message.findOne({email: req.uemail}, function (err, msgs) {
 //  User.findOne({email: 'keep@keep.ca'}, function (err, user) {
    if(msgs) {
       var msglistH = msgs.msgs;
       if(msglistH) {
         var listlength = msglistH.length;
         var toReturnList = [];
         var hasReturned;
         if(listlength > 0) {
           var tempV;
           for (var i = 0; i < listlength; i++) {
             tempV = msglistH[i].downloaded;
             if(!tempV) {
               toReturnList.push(msglistH[i]);
               msglistH[i].downloaded = true;
             }
           }
           if(toReturnList.length > 0) {
             hasReturned = true;
           } else {
             hasReturned = false;
           }
         } else {
           hasReturned = false;
         }
         if(hasReturned) {
           msgs.save(function(errI) {
             if(errI) {
               res.json({success: false, message: 'Error in message updating!'});
             } else {
               res.json({success: true, message: 'Message loaded!', 
                        hasTheReturn: hasReturned, msglist: toReturnList});
             }
           });
         } else {
           res.json({success: true, message: 'Message loaded!', 
                        hasTheReturn: hasReturned, msglist: toReturnList});
         }
        } else {
          res.json({success: false, message: 'No message yet!'});
        }
    } else {
      res.json({success: false, message: 'Could not load message!'});
    }
  });
//  res.send('respond with a resource');
});

module.exports = router;
