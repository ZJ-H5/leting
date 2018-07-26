angular.module('app').controller('projectupdaterecordCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
    $scope.projectId = $state.params.projectid;
    var projectId = $scope.projectId;
    $scope.no = '/';
    $scope.conf = {
        total: 10,  //共多少页
        currentPage: 1,  //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
    }
    var userId = server.server().userId;


    $scope.list = {
        projectId:$state.params.projectid,
        createUser:server.server().userId,
        toUserId:server.server().userId,
        type:3,   //1转移   2分享   3关注
        status:1 //类型 1 项目 2物业
    }
    $scope.listtop={
        roomId:$state.params.projectid,
        projectId:$state.params.projectid,
        paciId:$scope.pactId,
        createUser:server.server().userId,
        imgHost:server.server().imgHost,
        questiontype:4,//1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag:1,  //项目id1  物业id2
        reloadajax:1,   //需要调用函数就传1 or ''
        locationflag:1, //需要跳转到某页面就填写 1 or ''
    }

    $scope.$watch('conf.currentPage + conf.itemPageLimit+projectnameinput', function (news) {
        console.log($scope.conf.currentPage);
        server.server().updatarecoedlist({
            pageNo: $scope.conf.currentPage,
            pageSize: $scope.conf.itemPageLimit,
            projectId: projectId
        }, function (data) {
            if (data.result === true) {
                 console.log(data);
                $scope.datas = data.data.rows;

                //多少页
                $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);

                // $scope.conf.total = data.data.total/data.data.pageSize;
                //共有多少条数据
                $scope.conf.counts = data.data.total;
                $scope.$apply();
                $scope.$broadcast("categoryLoaded");
            } else {
                alert(data.message);
            }
        });

    })


}])