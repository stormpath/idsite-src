'use strict';

angular.module('stormpathIdpApp')
  .controller('MfaSetupCtrl', function ($window, $location, $scope, $routeParams, Stormpath) {
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

    var supportedFactors = {
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

    function getAccountFromSession() {
      var sessionJwt = Stormpath.client.getSessionJwt();

      // This should be set as body.sub, but for some reason isn't.
      // So because of that, hack it up by building our own account href.
      var accountScope = sessionJwt.body.scope.account;
      var accountId = Object.keys(accountScope)[0];
      var accountHref = 'https://api.stormpath.com/v1/accounts/' + accountId;

      return {
        href: accountHref
      };
    }

    $scope.verifyGoogleAuthenticatorCode = function () {
      var data = {
        code: $scope.googleAuthenticator.code
      };

      Stormpath.updateChallenge($scope.challenge, data, function (err, result) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        if (result.status === 'FAILED') {
          $scope.googleAuthenticator.state = 'invalid_code';
          return;
        }

        $window.location = result.serviceProviderCallbackUrl;
      });
    };

    $scope.createSmsFactor = function () {
      var account = getAccountFromSession();

      var data = {
        type: 'sms',
        phone: {
          number: $scope.smsFactor.phoneNumber
        }
      };

      Stormpath.createFactor(account, data, function (err) {
        if (err) {
          $scope.smsFactor.state = 'invalid_phone_number';
          return;
        }

        $location.path('/mfa/verify/sms');
      });
    };

    $scope.status = 'loading';

    Stormpath.init.then(function initSuccess(){
      $scope.factors = [];

      $scope.factor = supportedFactors[$routeParams.factor];

      Stormpath.client.requireMfa.forEach(function (factor) {
        if (factor in supportedFactors) {
          $scope.factors.push(supportedFactors[factor]);
        }
      });

      if ($scope.factor && $scope.factor.id === 'google-authenticator') {
        var account = getAccountFromSession();

        var data = {
          type: 'google-authenticator'
        };

        return Stormpath.createFactor(account, data, function (err, factor) {
          if (err) {
            $scope.status = 'failed';
            $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
            return;
          }

          Stormpath.createChallenge(factor, function (err, challenge) {
            if (err) {
              $scope.status = 'failed';
              $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
              return;
            }

            $scope.googleAuthenticator.factor = factor;
            $scope.googleAuthenticator.base64QRImage = factor.base64QRImage;
            $scope.challenge = challenge;
            $scope.status = 'loaded';
          });
        });
      }

      $scope.status = 'loaded';
    });
  });
