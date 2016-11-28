'use strict';

angular.module('stormpathIdpApp')
  .controller('MfaVerifyCtrl', function ($window, $location, $scope, $routeParams, Stormpath) {
    $scope.factor = null;
    $scope.factors = [];
    $scope.challenge = null;

    $scope.verification = {
      code: null,
      state: null
    };

    var supportedFactors = {
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

    $scope.resendSmsCode = function () {
      Stormpath.client.createChallenge($scope.factor.configuration, function (err, challenge) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        $scope.verification.state = 'resent_code';
        $scope.challenge = challenge;
      });
    };

    $scope.changeSmsPhoneNumber = function () {
      console.log('changeSmsPhoneNumber() called!');
      return false;
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

        $window.location = result.serviceProviderCallbackUrl;
      });
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

    $scope.status = 'loading';

    Stormpath.init.then(function initSuccess(){
      $scope.factors = [];

      Stormpath.client.requireMfa.forEach(function (factor) {
        if (factor in supportedFactors) {
          $scope.factors.push(supportedFactors[factor]);
        }
      });

      var account = getAccountFromSession();

      Stormpath.getFactors(account, function (err, factors) {
        if (err) {
          $scope.status = 'failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
          return;
        }

        factors.items.forEach(function (configuredFactor) {
          $scope.factors.forEach(function (scopeFactor) {
            if (scopeFactor.id === configuredFactor.type.toLowerCase()) {
              scopeFactor.configuration = configuredFactor;

              // Inject the phone number into the sms factor sub title.
              if (scopeFactor.id === 'sms') {
                scopeFactor.subTitle = scopeFactor.subTitle.replace('{{phoneNumber}}', configuredFactor.phone.number);
              }
            }

            // If the route 'factor' parameter is the current factor, then set that in our scope.
            if ($routeParams.factor === scopeFactor.id) {
              $scope.factor = scopeFactor;
            }
          });
        });

        // If there's a factor selected, then create a new challenge.
        if ($scope.factor) {
          Stormpath.client.createChallenge($scope.factor.configuration, function (err, challenge) {
            $scope.challenge = challenge;
          });
        }

        $scope.status = 'loaded';
      });
    });
  });
