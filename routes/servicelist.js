var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Servicecat = require('../models/servicecat');

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
//  var tokenH = req.body.token;
  //   console.log('second 303030!' + emailH);
  Servicecat.find().lean().exec(function(err, service) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in loading service list!'});
           } else {
              var returnlist = [];
              var listlength = service.length;
              for (var i = 0; i < listlength; i++) {
                returnlist.push(service[i].catname);
              }
              res.json({
                  success: true,
                  message: 'Service list loaded!',
                  list: returnlist});
           }
  });
//  res.send('respond with a resource');
});

module.exports = router;
