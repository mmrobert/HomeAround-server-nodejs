var aFCM = require('fcm-node');

var serverKey = 'AAAALwM6r6M:APA91bHfmbihghIF_s1StXimawFFWp9RoVW86faEU6oE0gu3gvMlFRS-hhfESW9PpO7BQLbfJzlz4Ibj1LpKZyc93uWxh4hCF5jnrFkfmOMl9vSh7Qfa0C7FaNP_qoZCcgAxlAPDJ3_VX-rAVWXk_3xwu63hwi7Scw';

var fcm = new aFCM(serverKey);

module.exports = fcm;