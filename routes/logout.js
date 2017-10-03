var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.post('/', function(req, res, next) {
 // console.log('99999BB' + req.body.email);
    var dActiveChangeDateH = new Date();
    User.findOneAndUpdate({token: req.body.token}, 
        {$set:{deviceActive: false, dActiveChangeDate: dActiveChangeDateH}}, 
        function(err, user) {
           if (err) {
             res.json({success: false, message: 'Could not be logouted, try again!'});
           } else {
             res.json({success: true, message: 'logouted!'});
           }
    });
//  res.send('respond with a resource');
});

module.exports = router;
