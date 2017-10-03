var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Country = require('../models/country');

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
  Country.find().lean().exec(function(err, country) {
           if (err) {
             res.json({
                   success: false,
                   message: 'Error in loading country list!'});
           } else {
              var returnlist = [];
              var listlength = country.length;
              for (var i = 0; i < listlength; i++) {
                returnlist.push(country[i].countryname);
              }
              res.json({
                  success: true,
                  message: 'Country list loaded!',
                  list: returnlist});
           }
  });
//  res.send('respond with a resource');
});

module.exports = router;
