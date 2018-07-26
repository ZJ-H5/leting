/**
 * Created by lian on 2017/10/27.
 */
angular.module('app').controller('enclosureCtrl', ['$http', '$scope', 'dict', 'server', '$state', 'fileUpload', function ($http, $scope, dict, server, $state, fileUpload) {
    $scope.roomId = $state.params.roomId;
    $scope.projectId = $state.params.projectid;
    $scope.host = server.server().imgHost;
    var createUser = server.server().userId;
    //关注
    $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId, //1是项目id 2是物业id
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业

        // 跟进跟踪
    };$scope.listtop = {
        projectId: $state.params.projectid,
        roomId: $state.params.roomId,
        createUser: server.server().userId,
        imgHost: $scope.host,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
    };
    server.server().zjprojectdeleteById({
        id: $scope.projectId,
        userId: createUser
    }, function (data) {
        if (data.result === true) {
            $scope.project2 = data.data.project;
            $scope.project2.createTime = dict.timeConverter($scope.project2.createTime);
            if($scope.project2){    $scope.project2.updateTime = dict.timeConverter($scope.project2.updateTime);}
            $scope.$apply();

        } else {
            alert(data.message)
        }
    }, function () {
        alert('404请求失败')
    })
    //附件列表
    // var ownership=[],card=[],pro=[],other=[];
    function filelist(){
        server.server().enclorurelist({
            propertyId: $scope.roomId,
        }, function (data) {
            if (data.result === true) {
                $scope.lists = data.data;
                var length = 0;
                for (var key in $scope.lists) {
                    length += $scope.lists[key].propertyAttachments.length;
                }
                $scope.length = length;
                $scope.$apply();
            } else {
                alert(data.message)
            }
        }, function () {
            alert('404请求失败')
        })
    };
    filelist();


    //添加附件
    $scope.addannex=function(files,type){
        
        // var file=files[0];
        // $scope.filename = file.name;
        $scope.count = 0;
        for(var i = 0;i<files.length;i++){
            filesupdate(files[i],type,files.length)
        }
        

    }
    function filesupdate(files,type,length){
        var fd = new FormData();
        fd.append('multipartFile', files);
        $http({
            method: 'POST',
            url: $scope.host+"attachment/fielUpload.do",
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            // 请求成功执行代码

            $scope.data = response.data.data;
            console.log(response)
            $scope.fileName = $scope.data.fileName;
            $scope.filePath = $scope.data.filePath;
            $scope.size = $scope.data.size;

            var attachment={
                filePath:$scope.filePath,
                fileName:$scope.fileName,
            }

            server.server().enclosursave({
                attachment: JSON.stringify(attachment),
                propertyId: $scope.roomId,
                createUser: createUser,
                type: type
            }, function (data) {
                if (data.result === true) {
                   $scope.count++;
                   filelist();
                   if(length== $scope.count){
                        alert(data.message)
                    };
                    $scope.$apply();
                    
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        })
    }

    //附件下载
    $scope.downenclosure = function (id) {

        var hostURL = $scope.host + 'propertyAttachment/attachmentDownload.do'
        $scope.link = hostURL + '?id=' + id;
    }
    //附件删除
    $scope.deleteenclosure = function (id) {
        server.server().deleteenclosure({
            id: id
        }, function (data) {
            if (data.result === true) {
                alert(data.message);
                filelist();
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
}
])