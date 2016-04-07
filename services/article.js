angular.module('MyApp')
  .factory('Article', function($http) {
    var BaseUrl = '';
    return {
      all: function() {
        return $http.get(BaseUrl+'api/article');
      },
      getArticle: function(id){
        return $http.get(BaseUrl+'api/article/'+id);
      },
      getUserArticle: function(user_id){
        return $http.get(BaseUrl+'api/article/sort/own_by/'+user_id);
      },
      createNewArticle: function(dataArticle){
        return $http.post(BaseUrl+'api/article', dataArticle);
      },
      updateArticle: function(id, editArticle){
        return $http.put(BaseUrl+'api/article/'+id, editArticle);
      },
      remove: function(id){
        return $http.delete(BaseUrl+'api/article/'+id);
      }
    };
  });
