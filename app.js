var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var userslist = require('./models/userslist');
var usercreate = require('./models/usercreate');
var servicecreate = require('./models/servicecreate');
var countrycreate = require('./models/countrycreate');

var register = require('./routes/register');
var login = require('./routes/login');
var forgetpw = require('./routes/forgetpw');
var resetpw = require('./routes/resetpw');
var updateDevice = require('./routes/updateDeviceInfo');
var logout = require('./routes/logout');

var namesetting = require('./routes/namesetting');
var cprofileupdate = require('./routes/cprofileupdate');
var postcodesetting = require('./routes/postcodesetting');
var countrylist = require('./routes/countrylist');
var photosetting = require('./routes/photosetting');
var phonesetting = require('./routes/phonesetting');
var expertisesetting = require('./routes/expertisesetting');
var servicelist = require('./routes/servicelist');
var biosetting = require('./routes/biosetting');
var mprofileupdate = require('./routes/mprofileupdate');
var topostjob = require('./routes/topostjob');
var updatejobstatus = require('./routes/updatejobstatus');
var deletejob = require('./routes/deletejob');
var updatejob = require('./routes/updatejob');
var serviceload = require('./routes/serviceload');
var servicerating = require('./routes/servicerating');
var reviewload = require('./routes/reviewload');
var reviewpost = require('./routes/reviewpost');
var cSendMsg = require('./routes/cSendMsg');
var cMsgLoading = require('./routes/cMsgLoading');
var promoLoading = require('./routes/promotionLoad');
//
var mJobsLoading = require('./routes/mJobsLoad');
var mSendMsg = require('./routes/mSendMsg');
var mMsgLoading = require('./routes/mMsgLoading');
var mLoadReviews = require('./routes/mLoadReviews');
//
var geoloc = require('./routes/geolocation');

var app = express();
var apnFeedback = require('./apnFeedback');

var mongoose = require('mongoose');
// var jwt = require('jsonwebtoken');
var config = require('./config');
// var User = require('./models/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
// mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
mongoose.connect(config.database);
//app.set('superSecret', config.secret);

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use('/register', register);
app.use('/login', login);
app.use('/resetpw', resetpw);
app.use('/forgetpw', forgetpw);
app.use('/updatedeviceinfo', updateDevice);
app.use('/logout', logout);

app.use('/setname', namesetting);
app.use('/customer/profileupdate', cprofileupdate);
app.use('/setpostcode', postcodesetting);
app.use('/countrylist', countrylist);
app.use('/setphoto', photosetting);
app.use('/setphone', phonesetting);
app.use('/setexpertise', expertisesetting);
app.use('/servicelist', servicelist);
app.use('/setbiodetail', biosetting);
app.use('/merchant/profileupdate', mprofileupdate);
app.use('/customer/topostjob', topostjob);
app.use('/customer/updatejobstatus', updatejobstatus);
app.use('/customer/deletejob', deletejob);
app.use('/customer/updatejob', updatejob);
//
app.use('/customer/serviceload', serviceload);
app.use('/customer/servicerating', servicerating);
app.use('/customer/reviewload', reviewload);
app.use('/customer/reviewpost', reviewpost);
app.use('/customer/sendmessage', cSendMsg);
app.use('/customer/messagesload', cMsgLoading);
app.use('/customer/promotionload', promoLoading);
//
app.use('/merchant/jobsload', mJobsLoading);
app.use('/merchant/sendmessage', mSendMsg);
app.use('/merchant/messagesload', mMsgLoading);
app.use('/merchant/reviewload', mLoadReviews);
//
app.use('/userslist', userslist);
app.use('/usercreate', usercreate);
app.use('/servicecreate', servicecreate);
app.use('/countrycreate', countrycreate);
//
app.get('/pwreseted', function(req, res, next) {
   res.render('pwreseted', {title: 'HomeHome'});
});
app.get('/', function(req, res, next) {
  res.send('Home for HomeHome, Cheng.');
});
app.use('/geolocation', geoloc);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
