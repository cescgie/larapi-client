angular.module('MyApp')
  .factory('Account', function($http) {
    var BaseUrl = '/api';
    return {
      getProfile: function() {
        return $http.get(BaseUrl+'/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put(BaseUrl+'/api/me', profileData);
      },
      getUser: function(id){
        return $http.get(BaseUrl+'/user/'+id);
      },
      changePassword: function(username,passwordData){
       return $http.post(BaseUrl+'/user/'+username+'/change-password',passwordData);
      },
      resetPassword: function(passwordData){
       return $http.post(BaseUrl+'/user/forget_password',passwordData);
      }
    };
  });
