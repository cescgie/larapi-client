angular.module('MyApp')
  .factory('User', function($http) {
    return {
      all: function(id){
        return $http.get(BaseUrl+'/user');
      },
      getUser: function(id){
        return $http.get(BaseUrl+'/user/'+id);
      }
    };
  });
