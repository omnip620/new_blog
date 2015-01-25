/**
 * Created by panew on 15-1-21.
 */
angular.module('admin').directive('editor', function () {
  return {
    restrict: 'EA',
    require:'?ngModel',
    replace: true,
    scope: {
      ngModel:'='
    },
    link: function (scope,elem,attrs,ngModel) {
      var myCodeMirror = CodeMirror.fromTextArea(elem[0],{
        mode: 'markdown',
        theme:'default',
        lineNumbers: true
      });
      ngModel.$render = function() {
        //Code mirror expects a string so make sure it gets one
        //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
        var safeViewValue = ngModel.$viewValue || '';
        myCodeMirror.setValue(safeViewValue);
      };
      myCodeMirror.on('change', function(instance) {
        var newValue = instance.getValue();
        if (newValue !== ngModel.$viewValue) {
          scope.$applyAsync(function() {
            ngModel.$setViewValue(newValue);
          });
        }
      });
    }
  }
});