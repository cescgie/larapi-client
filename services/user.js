angular.module('MyApp')
  .factory('User', function($http) {
    return {
      all: function(){
        return $http.get(BaseUrl+'/user');
      },
      getUser: function(id){
        return $http.get(BaseUrl+'/user/'+id);
      }
    };
  });
