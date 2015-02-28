/**
 * Created by panew on 14-12-9.
 */
angular.module('admin', ['ngRoute'])
  .factory('sessionRecoverer', ['$q', '$injector','$window', function ($q, $injector, $window) {
    return {
      request: function (config) {

        return config || $q.when(config);
      },
      responseError: function (rejection) {
        $window.location = '/login';
        return $q.reject(rejection);
      },
      response: function (response) {
        switch (response.status) {
          case (200):
            if (!angular.isObject(response.data)) {
              //这里可以做自己相应的处理
              if (response.data.indexOf("location.replace(\"/views/login.html\")") > 0) {
                window.location = "/views/login.html";
              }
            }
            break;
          case (500):
            alert("服务器系统内部错误");
            break;
          case (401):
            alert("未登录");
            break;
          case (403):
            alert("无权限执行此操作");
            break;
          case (408):
            alert("请求超时");
            break;
          default:
            alert("未知错误");
        }
        return response;
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
