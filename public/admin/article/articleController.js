/**
 * Created by panew on 14-12-23.
 */
angular.module('admin').controller('ArticleController', function ($scope, $routeParams, $http,$location) {
  $scope.article = {};
  $scope.errors = {};
  var id = $routeParams.id;
  if (id == 'add') {

  }
  $scope.processForm = function () {
    $http({
      method: 'post',
      url: '/api/articles',
      data: $scope.article,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status) {
      $location.path("/articles");
    })
  };
});

angular.module('admin').directive('tagsStyle', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      ctrl.$parsers.push(function (data) {
        if(data){
          data = data.split('|');
        }
        return data;
      });
      ctrl.$formatters.push(function(data){
        if(data){
          data=data.join();
        }
        return data;
      })
    }
  }
});