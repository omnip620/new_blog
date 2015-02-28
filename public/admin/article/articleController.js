/**
 * Created by panew on 14-12-23.
 */
angular.module('admin').controller('ArticleController', function ($scope, $routeParams, $http, $location) {
  var baseUrl = '/api/articles/';
  $scope.article = {};
  $scope.errors = {};
  $scope.cats = {};
  $scope.tagsControl = {};
  //获得文章分类
  $http({
    method: 'get',
    url: baseUrl + 'cat',
    headers: {'Content-Type': 'application/json'}
  }).success(function (data) {
    $scope.cats = _.pairs(data);
  });
  var id = $routeParams.id;
  $scope.articleId = id;
  if (id !== 'add') {
    $http({
      method: 'get',
      url: baseUrl + id,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status) {
      $scope.article = data;
    });
    baseUrl += 'update';
  }
  $scope.processForm = function () {
    $http({
      method: 'post',
      url: baseUrl,
      data: $scope.article,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status) {
      $location.path("articles");
    })
  };
  $scope.preview = function () {
    sessionStorage.setItem('tempArticle', JSON.stringify($scope.article));
    $location.path("preview");
  };
  $scope.applyUploader = function () {
    $('#upimgs').on('shown.bs.modal', function () {
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '100mb',
        flash_swf_url: '/javascripts/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: '/common/qnuptoken',
        auto_start: true,
        domain: '7u2pew.com1.z0.glb.clouddn.com',
        init: {
          'UploadProgress': function (up, file) {
            // 每个文件上传时,处理相关的事情
            console.log(file.percent + "%", up.total.bytesPerSec);
            //var progress = new FileProgress(file, 'fsUploadProgress');
            //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            //progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);
          },
          'FileUploaded': function (up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var sourceLink = domain + '/' + res.key; //获取上传成功后的文件的Url
            console.log(sourceLink);
          }
        }
      })
    })
  };
});

angular.module('admin').directive('tagsStyle', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      ctrl.$parsers.push(function (data) {
        if (data) {
          data = data.replace(/，/g, ',').split(',');
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

angular.module('admin').directive('tags', function ($http) {
    var scope;
    function getCursortPosition(ctrl) {//获取光标位置函数
      var CaretPos = 0;	// IE Support
      if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
      }
      // Firefox support
      else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = ctrl.selectionStart;
      return (CaretPos);
    }

    function focusTrigger(el) {
      var element = el[0].firstChild;
      while (element && element.nodeType != 1) {
        element = element.nextSibling;
      }
      $(element).click(function () {
        $(this).children('input[type="text"]').focus()
      });
    }

    function save() {
      $http({
        method: 'post',
        url: '/api/tags/save',
        data: {
          id: scope.articleId,
          tags: scope.items.map(function (item) {
            return item._id;
          })
        }
      })
    }

    function remove(id) {
      _.remove(scope.items, function (o) {
        if (o._id == id)
          return true
      });
    }

    function buildMethod() {
      scope.remove = function () {
        var item = this.item;
        remove(item._id);
      };

      scope.save = function () {
        save();
      };

      scope.inputKeydown = function (event) {
        var self = event.target;
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 8 && getCursortPosition(self) === 0) {
          var prev = self.previousSibling;
          while (prev && prev.nodeType != 1) {
            prev = prev.previousSibling;
          }
          remove(prev.getAttribute("data-value"));
          prev.parentNode.removeChild(prev);
        }
        else if (e && e.keyCode == 13) {
          e.preventDefault();
        }
      };
      var t;
      scope.inputKeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        var value = event.target.value;
        if (!!e && e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 8) {
          if (!value) {
            scope.showDropdown = false;
            return;
          }
          if (!!t) {
            clearTimeout(t)
          }
          t = setTimeout(function () {
            $http({
              method: 'get',
              url: '/api/tags/get',
              params: {word: value},
              headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
              if (data.length) {
                scope.tags = data;
                scope.showDropdown = true;
              }
            })
          }, 500);
        }
      };
      scope.dropdownClick = function () {
        var tag = this.tag;
        var isHas = false;
        scope.items.forEach(function (item) {
          if (item._id == tag._id) {
            isHas = true;
          }
        });
        if (!isHas) {
          scope.items.push({_id: tag._id, name: tag.name})
        }
      }
    }

    function build(s, el) {
      scope = s;
      scope.internalControl = s.control || {};
      scope.internalControl.saveTags = function () {
        save();
      };
      scope.showDropdown = false;
      $http({
        method: 'get',
        url: '/api/tags/getatag/',
        params: {id: scope.articleId}
      }).success(function (result) {
        scope.items = result;
        focusTrigger(el);
        buildMethod();
      })
    }

    return {
      restrict: 'EA',
      template: [' <div class="form-control tags-input">',
        '          <span ng-repeat="item in items" class="label label-default" data-value="{{item._id}}">{{item.name}}<span data-role="remove" ng-click="remove()"></span></span>',
        '          <input type="text" ng-keyup="inputKeyup($event)" ng-keydown="inputKeydown($event)"/>',
        '          <span class="tag-dropdown" ng-show="showDropdown"><ul><li ng-repeat="tag in tags" value="{{tag._id}}" ng-click="dropdownClick()">{{tag.name}}</li></ul></span>',
        '        </div>'].join(""),
      scope: {
        articleId: '@',
        control: '='
      },
      link: function (scope, element, attrs, ctrl) {
        build(scope, element);
      }
    }
  }
)
;