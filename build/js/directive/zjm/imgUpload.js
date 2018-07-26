angular.module('app').directive('fileModel', ['$parse', '$http',function ($parse,$http) {
    return{
        //通过设置项来定义
        restrict: 'AE',
        scope: false,
        template: '<div class="fl"><input type="button" id="storeBtn" style="padding:0; position: absolute; top: 0; left: 0; background: none; border: none;color: #fff; width:84px; height: 30px; line-height: 30px;" value="选择文件"><input type="file" name="testReport" id="file" ng-disabled="imgDisabled" style="position: absolute; top: 0; left: 0; opacity: 0;height: 30px;" accept="image/*"></div>',   //name:testReport 与接口字段相对应。
        replace: true,
        link: function(scope, ele, attrs) {
            ele.bind('click', function() {
                $('#file').val('');
            });
            ele.bind('change', function() {
                scope.file = ele[0].children[1].files;
                if(scope.file[0].size > 52428800){
                    alert("图片大小不大于50M");
                    scope.file = null;
                    return false;
                }
                scope.fileName = scope.file[0].name;
                var postfix = scope.fileName.substring(scope.fileName.lastIndexOf(".")+1).toLowerCase();
                if(postfix !="jpg" && postfix !="png"&& postfix !="jpeg"){
                    alert("图片仅支持png、jpg、jpeg类型的文件");
                    scope.fileName = "";
                    scope.file = null;
                    scope.$apply();
                    return false;
                }
                scope.$apply();

                //创建一个FileReader接口
                //console.log(scope.reader);
                if (scope.file) {
                    //获取图片（预览图片）
                    var fd = new FormData();
                    var file=scope.file[0];
                    fd.append('multipartFile', file);
                    $http({
                        method: 'POST',
                        url: "http://192.168.5.32:8080/web-sample/attachment/fielUpload.do",
                        // type:'json',
                        data: fd,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    }).then(function successCallback(response) {
                        // 请求成功执行代码
                        scope.data = response.data.data;
                        console.log(scope.data);
                        //scope.$apply(function(){
                            scope.thumb={
                                imgSrc:scope.data.filePath,
                                picName:scope.data.fileName
                            };
                        //})
                        //scope.$emit("FromChild", { mysrc: scope.thumb});

                        console.log(scope.data);
                    // scope.reader.readAsDataURL(scope.file[0]);    //FileReader的方法，把图片转成base64
                    // scope.reader.onload = function(ev) {
                    //     scope.$apply(function(){
                    //
                    //         scope.thumb = {
                    //             imgSrc : ev.target.result       //接收base64，scope.thumb.imgSrc为图片。
                    //         };
                    //     });
                    });

                }else{
                    alert('上传图片不能为空!');
                }
            });
        }
    };
}])