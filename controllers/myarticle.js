angular.module('MyApp')
  .controller('MyArticleCtrl', function($scope, $auth, toastr, Article, Account,$location) {
    $scope.getUserArticle = function(){
      Account.getProfile().then(function(response){
        var username = response.data.id;
        Article.getUserArticle(username)
          .then(function(response) {
            $scope.articles = response.data;
          })
          .catch(function(response) {
            toastr.error(response.data.message, response.status);
        });
      });
    };

    $scope.getUserArticle();

    $scope.createArticle = function() {
      Account.getProfile().then(function(response){
        var own_by = response.data.id;
        $scope.article.own_by = own_by;
        Article.createNewArticle($scope.article)
          .then(function(response,event) {
            if(response.data.status===false){
              toastr.error(response.data.message);
            }else{
              toastr.success(response.data.message);
            }
          })
          .catch(function(response) {
            toastr.error(response.data.message, response.status);
          });
      });
      $scope.getUserArticle();
      $location.path( "/myarticle" );
    };

    $scope.deleteArticle = function(id) {
      Article.remove(id)
        .then(function() {
          toastr.success(response.data.message);
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });

        $scope.getUserArticle();
        $location.path( "/myarticle" );
    };
  })

  .controller('ListArticle', function($scope,$stateParams,$state,Article,toastr,$location) {
    $scope.state = $state.current;
    $scope.params = $stateParams;

    $scope.populateData = function (){
      var id = $stateParams.id;
      Article.getArticle(id)
        .then(function(response) {
          $scope.article = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.populateData();

    $scope.saveArticle = function(id) {
      Article.updateArticle(id,$scope.article)
        .then(function() {
          toastr.success(response.data.message);
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
        $location.path( "/myarticle" );
    };

  });
