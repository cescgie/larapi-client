angular.module('MyApp')
  .factory('Account', function($http) {
    var BaseUrl = '';
    return {
      getProfile: function() {
        return $http.get(BaseUrl+'api/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put(BaseUrl+'api/api/me', profileData);
      },
      getUser: function(id){
        return $http.get(BaseUrl+'api/user/'+id);
      },
      changePassword: function(username,passwordData){
       return $http.post(BaseUrl+'api/user/'+username+'/change-password',passwordData);
      },
      resetPassword: function(passwordData){
       return $http.post(BaseUrl+'api/user/forget_password',passwordData);
      }
    };
  });
