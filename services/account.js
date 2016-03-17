angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('api/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('api/api/me', profileData);
      }
    };
  });
