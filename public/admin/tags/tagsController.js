/**
 * Created by panew on 15-2-4.
 */
angular.module('admin').controller('TagsController', function ($scope, $http, $filter) {
  var baseUrl = '/api/tags/';
  $scope.tags = {};
  $scope.titles = {};
  $scope.newTag = '';
  $scope.selectedTags = [];
  //Page
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  Papa.parse("/admin/tags/tagsHeader.csv", {
    download: true,
    header: true,
    complete: function (results) {
      $scope.titles = results.data;
    }
  });
  $http({
    method: 'get',
    url: '/api/tags',
    headers: {'Content-Type': 'application/json;charset=utf8'}
  }).success(function (data) {
    redata(data);
    $scope.pageCount = Math.ceil($scope.tags.length / $scope.pageSize) - 1;
  });
  $scope.addTag = function () {
    $http({
      method: 'post',
      url: baseUrl,
      data: {name: $scope.newTag},
      headers: {'Content-Type': 'application/json;charset=utf8'}
    }).success(function (data) {
      redata(data);
      $scope.newTag = '';
    })
  };

  function redata(data) {
    $scope.tags = data;
    $scope.pageCount = Math.ceil($scope.tags.length / $scope.pageSize) - 1;
  }

  $scope.deleteTags = function () {
    $http({
      method: 'post',
      url: baseUrl + 'delete',
      data: $scope.selectedTags,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data) {
      _.remove($scope.tags, function (item) {
        var flag = false;
        _.each($scope.selectedTags, function (num) {
          if (item._id == num) {
            flag = true;
          }
        });
        return flag;
      });
      $scope.selectedTags = [];
    })
  };

  $scope.selectAll = function () {
    this.all ? $scope.selectedTags = _.pluck($scope.tags, '_id') : $scope.selectedTags = [];
  };
  $scope.change = function () {
    var self = this;
    this.confirmed ? $scope.selectedTags.push(this.tag._id) :
      $scope.selectedTags = _.remove($scope.selectedTags, function (item) {
        return item !== self.tag._id;
      });
  };
});