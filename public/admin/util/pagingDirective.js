/**
 * Created by panew on 15-1-15.
 */
angular.module('admin').directive('paging', function () {
  var scope;
  function setScope(s) {
    scope = s;
    scope.currentPage = parseInt(scope.currentPage) || 0;
    scope.pageSize = parseInt(scope.pageSize) || 10;
    scope.pageCount = parseInt(scope.pageCount) || 0;
    scope.pageLinkItems = [];
    
    scope.prevPage = function () {
      if (scope.currentPage > 0) {
        scope.currentPage--;
      }
    };
    scope.nextPage = function () {
      if (scope.currentPage < scope.pageCount) {
        scope.currentPage++;
      }
    };
    scope.prevPageDisabled = function () {
      return scope.currentPage === 0 ? "disabled" : "";
    };
    scope.nextPageDisabled = function () {
      return scope.currentPage === scope.pageCount ? "disabled" : "";
    };
    scope.clickPageLink = function () {
      if (typeof this.item.value !== 'number')
        return;
      scope.currentPage = this.item.value;
    };
  }
  function generatePageLinkItemRange(start, end) {
    var i = 0;
    for (i = start; i <= end; i++) {
      var item = {
        value: i,
        aClass: scope.currentPage == i ? 'active' : ''
      };
      scope.pageLinkItems.push(item);
    }
  }
  function addDots() {
    scope.pageLinkItems.push({
      value: '...'
    });
  }
  function addStart(point) {
    generatePageLinkItemRange(0, point - 1);
    addDots();
  }
  function addLast(point) {
    addDots();
    generatePageLinkItemRange(scope.pageCount - point + 1, scope.pageCount);
  }
  function build(s) {
    setScope(s);
    if (scope.pageCount <= (scope.point + scope.rest) * 2 + 1) {
      generatePageLinkItemRange(0, scope.pageCount);
    }
    else {
      var start, end;
      if (scope.currentPage > scope.point + scope.rest && scope.currentPage < scope.pageCount - (scope.rest + scope.point)) {
        start = scope.currentPage - scope.rest;
        end = scope.currentPage + scope.rest;
        addStart(scope.point);
        generatePageLinkItemRange(start, end);
        addLast(scope.point);
      }
      else if (scope.currentPage <= scope.point + scope.rest) {
        end = scope.point + 2 * scope.rest + 1;
        generatePageLinkItemRange(0, end);
        addLast(scope.point);
      }
      else if (scope.currentPage >= scope.pageCount - (scope.rest + scope.point)) {
        start = scope.pageCount - (scope.point + 2 * scope.rest + 1);
        addStart(scope.point);
        generatePageLinkItemRange(start, scope.pageCount);
      }
    }
  }
  return {
    restrict: 'EA',
    scope: {
      currentPage: '=',
      pageSize: '@',
      pageCount: '@',
      point: '=',
      rest: '='
    },
    templateUrl: '/admin/util/pagingTpl.html',
    link: function (scope) {
      scope.$watchCollection('[currentPage,pageCount]', function () {
        build(scope);
      });
    }
  }
});
