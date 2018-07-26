/**
 * Created by pc on 2017/10/28.
 */
angular.module('app').controller('propertyManagementCtrl', ['$http', '$scope', 'server', '$state', function ($http, $scope, server, $state) {

    //选中导航
    let timed=setInterval(function(){
        if($('.l-nav>li').length>0)
        {
            $('.l-nav>li').eq(4).addClass('cur');
            clearInterval(timed)
        }
    },10)
    $scope.projectId = $state.params.projectid;//当前操作项目的id
    //查询出物业名字和物业个数
    server.server().projectnamesel({
        projectId: $scope.projectId
    }, function (data) {
        if (data.result === true) {
            $scope.projectname = data.data.projectName;
            $scope.number = data.data.number;
            $scope.$apply();
        } else {
            alert(data.message)
        }
    }, function (err) {
        alert(err)
    })
    $scope.className = "c-wygltp";
    //加载物业的数据
    server.server().showPropertyMangageMentdo({
        projectId: $scope.projectId
    }, function (data) {
        if (data.result === true) {
            $scope.propertys = data.data;
            //全部物业信息
            $scope.count = data.data.length;
        }
        $scope.$apply();
    }, function (data) {
        alert(data);
    });
    //测绘阶段的所有子阶段，签约阶段的所有子阶段
    server.server().showSignNodedo({}, function (data) {
        if (data.result === true) {
            $scope.nodeSign = data.data.signList;
        }
        $scope.$apply();
    }, function (data) {
        alert(data)
    })
    //点击事件
    $scope.doChange = function (signId) {
        //去掉全选
        if ($('input[name="sign"]:checkbox').length != $('input[name="sign"]:checked').length) {
            $('input[name="signs"]:checkbox')[0].checked = false;
        } else {
            $('input[name="signs"]:checkbox')[0].checked = true;
        }
        var arr = [];
        $('input[name="sign"]:checked').each(function (index) {
            arr.push($(this)[0].id);
        })
        /* console.log(arr.toString())//打印出日志信息
         console.log(arr.length)//打印出日志信息*/
        $scope.dosearcher(arr.toString());
        arr = []; //数据进行回收处理
    }
    //全选操作
    $scope.selectedAll = function () {
        if ($('input[name="signs"]:checkbox').is(':checked')) {
            $('input[name="sign"]:checkbox').each(function (index) {
                this.checked = true;
            })
        } else {
            $('input[name="sign"]:checkbox').each(function (index) {
                this.checked = false;
            })
        }
        //获取所有的id
        var arr = [];
        $('input[name="sign"]:checked').each(function (index) {
            arr.push($(this)[0].id);
        })
        $scope.dosearcher(arr.toString());
        arr = []; //数据进行回收处理
    }
    //数据的操作
    $scope.dosearcher = function (arrs) {
        server.server().showPropertyMangageMentdo({
            projectId: $scope.projectId,
            searchKeys: arrs
        }, function (data) {
            if (data.result === true) {
                $scope.propertys = data.data;
                //全部物业信息
                $scope.count = data.data.length;
            }
            $scope.$apply();
        }, function (data) {
            alert(data);
        });
    }
}]);
