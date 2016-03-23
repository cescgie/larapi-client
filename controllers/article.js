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

  })

  .controller('PopArticleCtrl', function($scope, $auth, toastr, Article,$stateParams,Account) {
    $scope.params = $stateParams;

    $scope.populateData = function (){
      var id = $stateParams.id;
        Article.getArticle(id)
          .then(function(response) {
            var user_id = response.data.own_by;
            Account.getUser(user_id).then(function(res2){
              var user = res2.data.username;
              var result = response.data;
              result['username'] = user;
              $scope.article = result;
            });
          })
          .catch(function(response) {
            toastr.error(response.data.message, response.status);
          });
    };

    $scope.populateData();

  });
