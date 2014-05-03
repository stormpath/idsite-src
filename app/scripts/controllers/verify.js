'use strict';



angular.module('stormpathIdpApp')
  .controller('VerifyCtrl', function ($scope, $location) {
    function doasyncthing(sptoken,cb){
      cb(sptoken==='1' ? null : true);
    }
    function getParam(param,url) {
      var m = url.match(new RegExp(param + '=[^/&#]+','g'));
      return (m && m.length > 0) ? m[0].split('=')[1] : null;
    }
    $scope.status = '';

    var token = getParam('emailVerificationToken',$location.absUrl());

    doasyncthing(token,function(err){
      $scope.status = err ? 'failed' : 'verified';
    });

    return $scope;
  });
