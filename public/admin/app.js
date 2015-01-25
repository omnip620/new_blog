/**
 * Created by panew on 14-12-9.
 */
angular.module('admin', ['ngRoute'])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider.when('/', {
      controller: 'AdminController',
      template: ''
    }).when('/articles', {
      controller:'ArticlesController',
      templateUrl:'/admin/articles/articles.html'
    }).when('/preview', {
      controller:'PreviewController',
      templateUrl:'/admin/article/preview.html'
    }).when('/article/:id', {
      controller:'ArticleController',
      templateUrl:'/admin/article/article.html'
    }).otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  });
