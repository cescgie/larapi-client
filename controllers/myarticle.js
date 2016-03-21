angular.module('MyApp')
  .controller('MyArticleCtrl', function($scope, $auth, toastr, Article, Account) {
    $scope.getUserArticle = function(){
      Account.getProfile().then(function(response){
        var user_id = response.data.id;
        Article.getUserArticle(user_id)
          .then(function(response) {
            $scope.articles = response.data;
          })
          .catch(function(response) {
            toastr.error(response.data.message, response.status);
        });
      });
    };

    $scope.getUserArticle();

  });
