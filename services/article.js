angular.module('MyApp')
  .factory('Article', function($http) {
    return {
      all: function() {
        return $http.get('api/article');
      },
      getArticle: function(id){
        return $http.get('api/article/'+id);
      },
      getUserArticle: function(user_id){
        return $http.get('api/article/sort/user_id/'+user_id);
      }
    };
  });
