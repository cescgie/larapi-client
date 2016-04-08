angular.module('MyApp')
  .factory('Article', function($http) {
    var BaseUrl = '/api';
    return {
      all: function() {
        return $http.get(BaseUrl+'/article');
      },
      getArticle: function(id){
        return $http.get(BaseUrl+'/article/'+id);
      },
      getUserArticle: function(user_id){
        return $http.get(BaseUrl+'/article/sort/own_by/'+user_id);
      },
      createNewArticle: function(dataArticle){
        return $http.post(BaseUrl+'/article', dataArticle);
      },
      updateArticle: function(id, editArticle){
        return $http.put(BaseUrl+'/article/'+id, editArticle);
      },
      remove: function(id){
        return $http.delete(BaseUrl+'/article/'+id);
      }
    };
  });
