/**
 * Created by panew on 14-12-23.
 */
angular.module('admin').controller('ArticleController', function ($scope, $routeParams, $http, $location) {
  $scope.article = {};
  $scope.errors = {};
  var id = $routeParams.id;
  var saveDateUrl = '/api/articles';

  if (id !== 'add') {
    $http({
      method: 'get',
      url: '/api/articles/' + id,
      data: $scope.article,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status) {
      $scope.article = data;
    });
    saveDateUrl = '/api/articles/update';
  }
  $scope.processForm = function () {
    $http({
      method: 'post',
      url: saveDateUrl,
      data: $scope.article,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status) {
      $location.path("articles");
    })
  };
  $scope.mdStyle = "opacity-0";
  $scope.preview = function () {
    var md = window.markdownit();
    sessionStorage.setItem('tempArticle',JSON.stringify($scope.article));
    $location.path("preview");
  }
});

angular.module('admin').directive('tagsStyle', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      ctrl.$parsers.push(function (data) {
        if (data) {
          data = data.split('|');
        }
        return data;
      });
      ctrl.$formatters.push(function (data) {
        if (data) {
          data = data.join();
        }
        return data;
      })
    }
  }
});