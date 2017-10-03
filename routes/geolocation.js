var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyBWCigYYW0aW45A_sa6Jq1tSjoJdWnE_A8',
    formatter: null
};

var geocoder = NodeGeocoder(options);

router.get('/', function(req, res, next) {

 // var postcodeH = req.params.postcode;
//  var postcodeH = null;
//  var countryH = 'Canada';
//  var addH = '20525, United States';
 // var addH = postcodeH + ', ' + countryH;
 var postcodeH = null;
   var countryH = null;
   var addH;
   
   if (postcodeH) {
      if (countryH) {
        addH = postcodeH + ', ' + countryH;
      } else {
        addH = postcodeH;
      }
   } else {
      if (countryH) {
        addH = countryH;
      } else {
        addH = '20525, United States';
      }
   }
  console.log('We are 77777!' + addH);
   geocoder.geocode(addH, function(err, result) {
     if (result) {
       var coors = [Number];
       if (result.length > 0 ) {
         coors[0] = result[0].longitude;
         coors[1] = result[0].latitude;
         req.uloc = coors;
         res.send(coors);
       }
     }
  //    res.send(result);
   }); 
 //  console.log('We are 303030!' + addH);
});

module.exports = router;
