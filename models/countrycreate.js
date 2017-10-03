var express = require('express');
var router = express.Router();
var Country = require('../models/country');

router.get('/:countryname', function(req, res, next) {
  var countrynameH = req.params.countryname;
//     console.log('second 303030!' + saltH);
  var nickcountry = new Country({
                      countryname: countrynameH
                    });
    nickcountry.save(function(err) {
            if (err) {
                     //   throw err;
              res.json({success: false, message: 'Error in creating new country!'});
            } else {
                      //   console.log('User saved ok!');         
              res.json({success: true, message: 'New country created and OK!'});
            }
        });
//  res.send('respond with a resource');
});

module.exports = router;
