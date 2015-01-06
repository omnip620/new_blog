/**
 * Created by panew on 14-12-9.
 */
angular.module('admin', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider.when('/', {
      controller: 'AdminController',
      template: ''
    }).when('/articles', {
      controller:'ArticlesController',
      templateUrl:'/admin/articles/articles.html'
    }).when('/article/:id', {
      controller:'ArticleController',
      templateUrl:'/admin/article/article.html'
    }).otherwise({redirectTo: '/'});
  });
