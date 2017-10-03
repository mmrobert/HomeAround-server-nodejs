var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function (err, users) {
    if(users) {
       res.json(users);
    } else {
       res.json({success: false, message: 'Error in reading users!'});
    }
  });
//  User.find({}, function(err, users) {
 //  console.log('here you are, 888');
 //   res.json(users);
 // });
});

module.exports = router;
