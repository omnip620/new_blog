/**
 * Created by panew on 14-12-9.
 */
angular.module('admin', ['ngRoute'])
  .factory('sessionRecoverer', ['$q', '$injector', '$window', function ($q, $injector, $window) {
    return {
      request: function (config) {

        return config || $q.when(config);
      },
      responseError: function (rejection) {
        $window.location = '/login';
        return $q.reject(rejection);
      }
    };

  }])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('sessionRecoverer');
    $routeProvider.when('/', {
      controller: 'AdminController',
      template: ''
    }).when('/articles', {
      controller: 'ArticlesController',
      templateUrl: '/admin/articles/articles.html'
    }).when('/preview', {
      controller: 'PreviewController',
      templateUrl: '/admin/article/preview.html'
    }).when('/tags', {
      controller: 'TagsController',
      templateUrl: '/admin/tags/tags.html'
    }).when('/article/:id', {
      controller: 'ArticleController',
      templateUrl: '/admin/article/article.html'
    }).otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  });
