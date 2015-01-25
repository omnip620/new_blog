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
  };
  (function(){
    var uploader=Qiniu.uploader({
      runtimes:'html5,flash,html4',
      browse_button: 'pickfiles',
      container: 'container',
      drop_element: 'container',
      max_file_size: '100mb',
      flash_swf_url: '/javascripts/plupload/Moxie.swf',
      dragdrop: true,
      chunk_size: '4mb',
      uptoken_url: '/qnuptoken',
      auto_start: true,
      domain:'7u2pew.com1.z0.glb.clouddn.com',
      init:{
        'UploadProgress': function(up, file) {
          // 每个文件上传时,处理相关的事情
          console.log(file.percent + "%", up.total.bytesPerSec);
          //var progress = new FileProgress(file, 'fsUploadProgress');
          //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
          //progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);
        },
        'FileUploaded': function(up, file, info) {
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
          var domain = up.getOption('domain');
          var res = JSON.parse(info);
          var sourceLink = domain +'/'+ res.key; //获取上传成功后的文件的Url
          console.log(sourceLink);
        }
      }
    })
  })();
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