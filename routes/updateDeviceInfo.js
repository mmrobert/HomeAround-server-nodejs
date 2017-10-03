var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.post('/', function(req, res, next) {
 // console.log('99999BB' + req.body.email);
    var platformH = req.body.platform;
    var dTokenH = req.body.devicetoken;
    var dActiveH;
    if(dTokenH == '0') {
      dActiveH = false;
    } else {
      dActiveH = true;
    }
    var dActiveChangeDateH = new Date();
    User.findOneAndUpdate({token: req.body.token}, 
        {$set:{platform: platformH, deviceToken: dTokenH, 
               deviceActive: dActiveH, dActiveChangeDate: dActiveChangeDateH}}, 
        function(err, user) {
           if (err) {
             res.json({success: false, message: 'Could not be authenticated!'});
           } else {
             res.json({success: true, message: 'Device updated!'});
           }
    });
//  res.send('respond with a resource');
});

module.exports = router;
