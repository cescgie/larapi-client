angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('api/public/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('api/public/api/me', profileData);
      }
    };
  });
