var BaseUrl = '/api';

angular.module('MyApp', ['ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'satellizer','ngRoute','monospaced.qrcode', 'btford.socket-io','luegg.directives','yaru22.angular-timeago','ngDialog'])
  .config(function($stateProvider, $urlRouterProvider, $authProvider,$locationProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'partials/home.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
          }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('myarticle', {
        url: '/myarticle',
        templateUrl: 'partials/myarticle.html',
        controller: 'MyArticleCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('article', {
        url: '/article',
        templateUrl: 'partials/article.html',
        controller: 'ArticleCtrl'
      })
      .state('createarticle',{
        url: '/createarticle',
        templateUrl: 'partials/createarticle.html',
        controller: 'MyArticleCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('editarticle',{
        url: '/editarticle/:id',
        templateUrl: 'partials/editarticle.html',
        controller: 'ListArticle',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('deletearticle',{
        url: '/deletearticle/:id',
        controller: 'ListArticle',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('selectarticle',{
        url: '/selectarticle/:id',
        templateUrl: 'partials/selectarticle.html',
        controller: 'PopArticleCtrl'
      })
      .state('change-password', {
        url: '/change-password',
        templateUrl: 'partials/changepassword.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'partials/forgotpassword.html',
        controller: 'LoginCtrl'
      })
      .state('qr-code', {
        url: '/qr-code',
        templateUrl: 'partials/qr-code.html',
        controller: 'QRCodeCtrl'
      })
      .state('chat', {
        url: '/chat',
        templateUrl: 'partials/chat/chatroom.html',
        // controller: 'ChatCtrl'
      })
      .state('people', {
        url: '/people',
        templateUrl: 'partials/people.html',
        controller: 'PeopleCtrl'
      })
      .state('friends', {
        url: '/friends',
        templateUrl: 'partials/friends.html',
        controller: 'FriendsCtrl'
      })
      .state('user',{
        url: '/user/:id',
        templateUrl: 'partials/selectuser.html',
        controller: 'PopUserCtrl'
      })
      .state('chatmember', {
        url: '/chat/:id',
        templateUrl: 'partials/chat/chatmember.html',
        controller: 'ChatMemberCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      });

    $urlRouterProvider.otherwise('/');

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

  });
