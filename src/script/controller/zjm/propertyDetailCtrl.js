/**
 * Created by pc on 2017/10/26.
 */
angular.module('app').controller('propertyDetailCtrl', ['$http', '$scope', 'server', '$state', 'dict', '$rootScope','$sce', function ($http, $scope, server, $state, dict, $rootScope,$sce) {
    //右侧-基本信息
    $scope.roomId = $state.params.roomId;
    $scope.projectId = $state.params.projectid;
    var roomId = $state.params.roomId;
    $scope.localhostimg = $rootScope.localhostimg;
    $scope.imgHost = server.server().imgHost;
    var cause = "空地";
    var createUser = server.server().userId;
    $scope.no = '/';
    $scope.headImg = server.server().headImg;


    //关注
    $scope.list = {
        roomId:$state.params.roomId,
        projectId:$state.params.roomId, //1是项目id 2是物业id
        createUser:server.server().userId,
        toUserId:server.server().userId,
        type:3,   //1转移   2分享   3关注
        status:2 //类型 1 项目 2物业
    }
    // 跟进跟踪
    $scope.listtop={
        projectId:$state.params.projectid,
        roomId:$state.params.roomId,
        createUser:server.server().userId,
        imgHost:server.server().imgHost,
        questiontype:4,//1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag:2,  //项目id1  物业id2
        reloadajax:1,   //需要调用函数就传1 or ''
        locationflag:1, //需要跳转到某页面就填写 1 or ''
    }

    //跟进页面刷新
    $scope.myajax=function(){
        trackInfoList();
    }


    //右侧-补偿信息
    server.server().basicCompensate({
        propertyId: roomId
    }, function (data) {
        if (data.result === true) {
            $scope.compensates = data.data;
            $scope.compensateItemList = data.data.compensateItemList;
            $scope.builtInAreaList = data.data.builtInAreaList;
            $scope.$apply();
        } else {
            alert(data.message);
        }
    });

    //右侧-签约进度
    server.server().signList({
        roomId: roomId
    }, function (data) {
        if (data.result === true) {
            $scope.signList = data.data;
            $scope.$apply();
        } else {
            alert(data.message);
        }
    }, function (err) {

    });
    // 视频地址
    $scope.trustSrc = function(url){
        return $sce.trustAsResourceUrl($scope.imgHost+url);
    }

    //追踪信息列表
    function trackInfoList(){
        server.server().informationDetail({
            typeValue: 2,
            dataId: roomId,
        }, function (data) {
            if (data.result === true) {
                $scope.data = data.data;

                //window.location.reload();
                $scope.$apply();
            } else {
                // alert(data.message);
            }
        }, function () {

        });
    }
    trackInfoList();
    //daletetrack物业跟踪信息
    $scope.daletetrack = function (item) {
        var id = item;
        console.log(id)
        confirm('确认删除这条追踪信息?',function(){
            server.server().deltranckinfo({
                id: id,
                userId: createUser
            }, function (data) {
                alert(data.message, function () {
                    trackInfoList();
                    $('.delbox').addClass('disnone')
                })
            })
        })

    }


}]);