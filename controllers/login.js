angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $location, $auth, toastr, Account, $location) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          toastr.success('You have successfully signed in!');
          $location.path('/');
        })
        .catch(function(error) {
          toastr.error(error.data.message, error.status);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          toastr.success('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            toastr.error(error.data.message, error.status);
          } else {
            toastr.error(error);
          }
        });
    };

    $scope.forgot_password = function(){
      Account.resetPassword($scope.user)
        .then(function(response) {
          if(response.data.success==true){
            toastr.info(response.data.message, response.status);
            $location.path( "/login" );
          }else{
            toastr.info(response.data.message, response.status);
          }
        })
        .catch(function(response) {
          toastr.info(response.data.message, response.status);
      });
    };
  });
