/**
 * Created by pc on 2017/10/25.
 */
angular.module('app').controller('checkingFalseCtrl', ['$http', '$scope', 'server', '$state', 'dict', '$rootScope', function ($http, $scope, server, $state, dict, $rootScope) {
    $scope.propertyId = $state.params.roomId;
    $scope.roomId = $state.params.roomId;
    $scope.projectId = $state.params.projectid;
    var createUser = server.server().userId;
    var propertyId = $scope.roomId;
    $scope.hostname = server.server().imgHost;
    $scope.imgHost = server.server().imgHost;
    $scope.localhostimg = $rootScope.localhostimg;
    $scope.headImg = server.server().headImg;
    server.server().checkingFalseList({
        propertyId: propertyId
    }, function (data) {
        if (data.result === true) {
            //$scope.checkList=data.data;
            $scope.falseList = data.data;
            console.log(data.data);
            $scope.$apply();

        } else {

            alert(data.message);
        }
    }, function (err) {

    });

    //关注
    $scope.list = {
        roomId: $state.params.roomId, //1是项目id 2是物业id
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
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
    };
    //查伪信息列表
    function ajaxlist(){
        server.server().checkingFalseList({
            propertyId: $scope.roomId,
        }, function (data) {
            if (data.result === true) {
    
                $scope.falseList = data.data;
                $scope.illegalInfoList = data.data.illegalInfoList;
                $scope.illegalRule = data.data.illegalRule;
                var length = $scope.illegalInfoList.length ? $scope.illegalInfoList.length : 0;
                if (length == 0) {
                    $scope.parentid = null;
                } else {
                    $scope.parentid = $scope.illegalInfoList[length - 1].id;
                }
    
                $scope.$apply();
            } else {
                alert(data.message)
            }
        });
    }
    ajaxlist()
   

    $scope.attachments=[];
    //添加附件
    $scope.addannex=function(files){
        for(var i = 0;i<files.length;i++){
            filesupdate(files[i],files.length)
        }
    }
    function filesupdate(file,length){
        var fd = new FormData();
        $scope.filename = file.name;
        fd.append('multipartFile', file);
        $http({
            method: 'POST',
            url: $scope.hostname+"attachment/fielUpload.do",
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            // 请求成功执行代码
            $scope.data = response.data.data;
            $scope.attachments.push({'filePath':$scope.data.filePath,'fileName':$scope.data.fileName,'size':$scope.data.size});
        }, function errorCallback(response) {
            alert(response);// 请求失败执行代码
        });
    }
    //删除附件
    $scope.deleteImg=function(i){
        $scope.attachments.splice(i,1);

    }
    //图片放大
    $scope.showImg=function(flag,attachment){
        $('.'+flag).dialog();
        $scope.Imgattachment=attachment;
    }
    //图片轮播
    $scope.animate=function(flag,Imgattachment){
        var startLeft=$('.ck-ul').position().left;
        var juli=$('.ck-ul li').eq(0).width();
        var maxLeft=(Imgattachment.length-1)*juli;
        if(flag=='prev'){
            if(startLeft==0){
                $('.ck-ul').stop(true,true).animate({'left':-maxLeft+'px'});
            }else {
                $('.ck-ul').stop(true,true).animate({'left':startLeft+juli+'px'});
            }
        }else{
            if(startLeft==-maxLeft){
                $('.ck-ul').stop(true,true).animate({'left':0});
            }else{
                $('.ck-ul').stop(true,true).animate({'left':startLeft-juli+'px'});
            }
        }
    }
    function callback(num){
        console.log('iiiii')
        var that=$('.ck-ul'),
            li=$('.ck-ul li');
        var juli=$('.ck-ul li').eq(0).width();
        if(num==0)
        {
            that.css({
                'left':0
            })
            li.eq(0).appendTo(that);
        }else{
            that.css({
                'left':0
            })
            li.eq(li.length-1).prependTo(that);
        }
        return false;
    }
    //添加查伪信息


    $scope.addfalseinfo = function (type) {

        server.server().addfalseinfo({
            propertyId: $scope.roomId,
            depict: $scope.falsetext,
            attachments: $scope.attachments?JSON.stringify($scope.attachments):null,
            parentId: $scope.parentid,
            createUser: createUser,
            type: type
        }, function (data) {
            if (data.result === true) {
                // alert('发布成功');
                alert(data.message, function () {
                    // location.reload();
                    ajaxlist()
                });
                $scope.$apply();

            } else {
                alert(data.message)
            }
        }, function () {
            alert('404请求失败')
        });
    }

}])