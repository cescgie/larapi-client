angular.module('MyApp')
  .controller('PeopleCtrl', function($scope, $http,User) {
    console.log('people page');
    $scope.getAllUser = function() {
      User.all()
        .then(function(response) {
          $scope.users = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.getAllUser();
  })

  .controller('PopUserCtrl', function($scope,$stateParams,User) {
    $scope.params = $stateParams;

    $scope.populateData = function (){
      var id = $stateParams.id;
        User.getUser(id)
          .then(function(response) {
            $scope.user = response.data;
          })
          .catch(function(response) {
            toastr.error(response.data.message, response.status);
          });
    };

    $scope.populateData();

  });
