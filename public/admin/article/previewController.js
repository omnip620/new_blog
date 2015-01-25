/**
 * Created by panew on 15-1-24.
 */
angular.module('admin').controller('PreviewController', function ($scope) {
  $scope.article = JSON.parse(sessionStorage.getItem('tempArticle'));
});

angular.module('admin').directive('mdStyle', function ($compile) {
  return {
    restrict: 'EA',
    link: function (scope, element) {
      element.html(window.markdownit().render(scope.article.content));
    }
  }
});