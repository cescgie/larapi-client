angular.module('MyApp')
  .controller('PeopleCtrl', function($scope, $http,User) {
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

  .controller('PopUserCtrl', function($scope,$stateParams,User,$auth,ngDialog,Account,Room,toastr) {
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

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    if($auth.isAuthenticated()){
      $scope.isAuth = function() {
        var logged_uid = $auth.getPayload();
        return logged_uid.sub;
      };
    }

    $scope.populateData();


    $scope.startchat = function (id,logid) {
       $scope.my_id = logid;
       $scope.with_id = id;
       Account.getUser(id).then(function(response){
         $scope.chat_with = response.data.username;
         ngDialog.open({ template: 'partials/dialog/startchat.html', className: 'ngdialog-theme-default', scope:$scope});
       });
    };

    $scope.confirmChat = function(my_id,with_id){
      ngDialog.closeAll();
      $scope.room = {};
      var members = new Array(my_id,with_id);
      $scope.room.members = members;
      $scope.room.created_by = my_id;
      Room.createNewRoom($scope.room)
        .then(function(resp3) {
          toastr.success(resp3.data.message);
        })
        .catch(function(resp3) {
          toastr.error(resp3.data.message, resp3.status);
        });
    };

  });
