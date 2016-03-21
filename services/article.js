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
        return $http.get('api/article/sort/own_by/'+user_id);
      },
      createNewArticle: function(dataArticle){
        return $http.post('api/article', dataArticle);
      },
      updateArticle: function(id, editArticle){
        return $http.put('api/article/'+id, editArticle);
      },
      remove: function(id){
        return $http.delete('api/article/'+id);
      }
    };
  });
