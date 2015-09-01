/**
 * Created by panew on 14-12-9.
 */
angular.module('admin').controller('ArticlesController', function ($scope, $http, $filter) {
    var orderBy = $filter('orderBy');
    $scope.articles = {};
    $scope.selectedArticles = [];
    $scope.sortIco = true;
    $scope.titles = [];
    Papa.parse("/admin/articles/articleHeader.csv", {
      download: true,
      header: true,
      complete: function (results) {
        $scope.titles = results.data;
      }
    });
    $http({
      method: 'get',
      url: '/api/articles',
      headers: {'Content-Type': 'application/json;charset=utf8'}
    }).success(function (data) {
      $scope.articles = data;
      $scope.sort('-updated_at', false);
      $scope.pageCount = Math.ceil($scope.articles.length / $scope.pageSize) - 1;
    });

    $scope.deleteArticles = function () {
      $http({
        method: 'post',
        url: '/api/articles/delete',
        data: $scope.selectedArticles,
        headers: {'Content-Type': 'application/json;charset=utf8'}
      }).success(function (data, status) {
        _.remove($scope.articles, function (item) {
          var flag = false;
          _.each($scope.selectedArticles, function (num) {
            if (item._id == num) {
              flag = true;
            }
          });
          return flag;
        });
        $scope.selectedArticles = [];
      })
    };
    $scope.selectAll = function () {
      this.all ? $scope.selectedArticles = _.pluck($scope.articles, '_id') : $scope.selectedArticles = [];
    };
    $scope.change = function () {
      var self = this;
      this.confirmed ? $scope.selectedArticles.push(this.article._id) :
        $scope.selectedArticles = _.remove($scope.selectedArticles, function (item) {
          return item !== self.article._id;
        });
    };
    $scope.sort = function (predicate, reverse) {
      $scope.articles = orderBy($scope.articles, predicate, reverse);
    };
    //Page
    $scope.currentPage = 0;
    $scope.pageSize = 10;

  }
);

angular.module('admin').filter('pageNum', function () {
  return function (item) {
    if (typeof item === 'number') {
      return item + 1;
    }
    else if (item) {
      return '...';
    }
  }
});

angular.module('admin').filter('offset', function () {
  return function (input, start) {
    if (input.length) {
      start = parseInt(start, 10);
      return input.slice(start);
    }
  };
});

angular.module('admin').filter('top', function () {
  return function (item) {
    var c = item ? '是' : '否';
    return c;
  }
});

angular.module('admin').filter('tagsStyle', function () {
  return function (item) {
    return item.join();
  }
});