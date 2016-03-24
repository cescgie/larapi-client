angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('api/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('api/api/me', profileData);
      },
      getUser: function(id){
        return $http.get('api/user/'+id);
      },
      changePassword: function(username,passwordData){
       return $http.post('api/user/'+username+'/change-password',passwordData);
      }
    };
  });
