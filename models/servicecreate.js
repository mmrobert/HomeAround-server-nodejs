var express = require('express');
var router = express.Router();
var Servicecat = require('../models/servicecat');

router.get('/:catname', function(req, res, next) {
  var catnameH = req.params.catname;
//     console.log('second 303030!' + saltH);
  var nickcat = new Servicecat({
                      catname: catnameH
                    });
    nickcat.save(function(err) {
            if (err) {
                     //   throw err;
              res.json({success: false, message: 'Error in creating new service cat!'});
            } else {
                      //   console.log('User saved ok!');         
              res.json({success: true, message: 'New service cat created and OK!'});
            }
        });
//  res.send('respond with a resource');
});

module.exports = router;
