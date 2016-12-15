'use strict';

angular.module('stormpathIdpApp')
  .controller('MfaSetupCtrl', function ($location, $scope, $routeParams, Stormpath) {

    $scope.account = Stormpath.getAccountFromSession();
    $scope.factor = null;
    $scope.factors = [];
    $scope.challenge = null;

    $scope.googleAuthenticator = {
      state: null,
      base64QRImage: null,
      code: null,
      factor: null
    };

    $scope.smsFactor = {
      state: null,
      phoneNumber: null
    };

    var factorMetaData = {
      'sms': {
        id: 'sms',
        title: 'SMS Text Messages',
        subTitle: 'Your carrier\'s standard charges may apply.'
      },
      'google-authenticator': {
        id: 'google-authenticator',
        title: 'Google Authenticator',
        subTitle: 'A free app from Google.'
      }
    };

    $scope.selectFactor = function (factor) {
      $location.path('/mfa/setup/' + factor);
    };

    $scope.verifyGoogleAuthenticatorCode = function () {
      var data = {
        code: $scope.googleAuthenticator.code
      };

      Stormpath.createChallenge($scope.factor, data, function (err, result) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        if (result.status === 'FAILED') {
          $scope.googleAuthenticator.state = 'invalid_code';
          return;
        }

        Stormpath.mfaRedirectFromCallbackUrl('setup', result.serviceProviderCallbackUrl);
      });
    };

    $scope.createSmsFactor = function () {
      var data = {
        type: 'sms',
        phone: {
          number: $scope.smsFactor.phoneNumber
        }
      };

      Stormpath.createFactor($scope.account, data, function (err) {
        if (err) {
          if (err.code === 13105) {
            return $scope.smsFactor.state = 'duplicate_phone_number';
          }

          return $scope.smsFactor.state = 'invalid_phone_number';
        }

        $location.path('/mfa/verify/sms/true');
      });
    };

    $scope.status = 'loading';

    Stormpath.init.then(function initSuccess(){
      Stormpath.client.requireMfa.forEach(function (factorId) {
        factorId = factorId.toLowerCase();

        if (!(factorId in factorMetaData)) {
          return;
        }

        var newFactor = JSON.parse(JSON.stringify(factorMetaData[factorId]));

        if (factorId === $routeParams.factor) {
          $scope.factor = newFactor;
        }

        $scope.factors.push(newFactor);
      });

      if ($scope.factor && $scope.factor.id === 'google-authenticator') {
        var data = {
          type: 'google-authenticator',
          issuer: Stormpath.makeId()
        };

        return Stormpath.createFactor($scope.account, data, function (err, remoteFactor) {
          if (err) {
            $scope.status = 'failed';
            $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
            return;
          }

          for (var key in remoteFactor) {
            $scope.factor[key] = remoteFactor[key];
          }

          $scope.googleAuthenticator.factor = remoteFactor;
          $scope.googleAuthenticator.base64QRImage = remoteFactor.base64QRImage;
          $scope.status = 'loaded';
        });
      }

      $scope.status = 'loaded';
    });
  });
