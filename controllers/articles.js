angular.module('MyApp')
  .controller('ArticleCtrl', function($scope, $auth, toastr, Article) {
    $scope.getArticle = function() {
      Article.all()
        .then(function(response) {
          $scope.articles = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.getArticle();

  });
