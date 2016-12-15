'use strict';

angular.module('stormpathIdpApp')
  .controller('MfaVerifyCtrl', function ($location, $scope, $routeParams, Stormpath) {
    $scope.account = Stormpath.getAccountFromSession();
    $scope.factor = null;
    $scope.factors = [];
    $scope.challenge = null;
    $scope.otherFactorsAvailable = false;

    $scope.factorId = $routeParams.factor;
    $scope.isFirstVerification = $routeParams.firstVerification === 'true';

    $scope.verification = {
      code: null,
      state: null
    };

    var factorMetaData = {
      'sms': {
        id: 'sms',
        title: 'Send a Text Message',
        subTitle: 'We\'ll send a code to {{phoneNumber}}.'
      },
      'google-authenticator': {
        id: 'google-authenticator',
        title: 'Google Authenticator',
        subTitle: 'View a code in the mobile app.'
      }
    };

    $scope.selectFactor = function (factor) {
      $location.path('/mfa/verify/' + factor);
    };

    $scope.changeSmsPhoneNumber = function () {
      $location.path('/mfa/setup/sms');
    }

    $scope.resendSmsCode = function () {
      Stormpath.createChallenge($scope.factor, null, function (err, challenge) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        $scope.verification.state = 'resent_code';
        $scope.challenge = challenge;
      });
    };

    $scope.verifyCode = function () {
      var data = {
        code: $scope.verification.code
      };

      Stormpath.updateChallenge($scope.challenge, data, function (err, result) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        if (result.status === 'FAILED') {
          $scope.verification.state = 'invalid_code';
          return;
        }

        var source = $scope.isFirstVerification ? 'setup' : 'verification';

        Stormpath.mfaRedirectFromCallbackUrl(source, result.serviceProviderCallbackUrl);
      });
    };

    $scope.status = 'loading';

    Stormpath.init.then(function initSuccess(){
      var allowFactorMap = {};

      Stormpath.client.requireMfa.forEach(function (factorId) {
        allowFactorMap[factorId.toLowerCase()] = null;
      });

      $scope.otherFactorsAvailable = Stormpath.client.requireMfa.length > 1;

      Stormpath.getFactors($scope.account, function (err, factors) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        factors.items.forEach(function (remoteFactor) {
          if (remoteFactor.status !== 'ENABLED' || (remoteFactor.verificationStatus !== 'VERIFIED' && !$scope.isFirstVerification)) {
            return;
          }

          var factorId = remoteFactor.type.toLowerCase();

          if (!(factorId in allowFactorMap)) {
            return;
          }

          var factor = JSON.parse(JSON.stringify(factorMetaData[factorId]));

          for (var key in remoteFactor) {
            factor[key] = remoteFactor[key];
          }

          // Inject the phone number into the sms factor sub title.
          if (factorId === 'sms') {
            factor.subTitle = factor.subTitle.replace('{{phoneNumber}}', factor.phone.number);
          }

          // If the route 'factor' parameter is the current factor, then set that in our scope.
          if ($scope.factorId === factor.id) {
            $scope.factor = factor;
          }

          $scope.factors.push(factor);
        });

        // If we don't have any factors, then redirect to the setup step.
        if (!$scope.factors.length) {
          return $location.path('/mfa/setup/');
        }

        // If there's a factor selected, then create a new challenge.
        if ($scope.factor) {
          Stormpath.client.createChallenge($scope.factor, function (err, challenge) {
            $scope.challenge = challenge;
          });
        }

        $scope.status = 'loaded';
      });
    });
  });
