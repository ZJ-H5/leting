
angular.module('app').controller('newFilesCtrl', ['$http', '$scope', 'dict', 'server', '$state', function ($http, $scope, dict, server, $state) {
    $scope.createUser = server.server().userId;
    $scope.flag = {
        projectNameflag: false,
        projectnumberflag: false,
        provinceIdflag: false,
        cityIdflag: false,
        areaIdflag: false,
        roadIdflag: false,
        areaDemolitionflag: false,
        plannedVolumeRatioflag: false,
        planningFloorAreaflag: false,
        surveyAreaflag: false
    }
    $scope.tips = function (val, flag) {
        //项目名称
        if (flag == 'projectName') {
            !val ? $scope.flag.projectNameflag = true : $scope.flag.projectNameflag = false;
        }
        //宗地编号
        if (flag == 'projectnumber') {
            !val ? $scope.flag.projectnumberflag = true : $scope.flag.projectnumberflag = false;
        }
        //详细地址
        if (flag == 'roadId') {
            if (!$scope.provinceId) {
                $scope.flag.provinceIdflag = true;
                return;
            } else {
                $scope.flag.provinceIdflag = false;
            }
            if (!$scope.cityId) {
                $scope.flag.cityIdflag = true;
                return;
            } else {
                $scope.flag.cityIdflag = false;
            }
            if (!$scope.areaId) {
                $scope.flag.areaIdflag = true;
                return;
            } else {
                $scope.flag.areaIdflag = false;
            }

            !val ? $scope.flag.roadIdflag = true : $scope.flag.roadIdflag = false;
        }
        //拆除范围占地面积
        if (flag == 'areaDemolition') {
            !val ? $scope.flag.areaDemolitionflag = true : $scope.flag.areaDemolitionflag = false;
        }
        //规划容积率
        if (flag == 'plannedVolumeRatio') {
            !val ? $scope.flag.plannedVolumeRatioflag = true : $scope.flag.plannedVolumeRatioflag = false;
            val<=0?$scope.flag.plannedVolumeRatioNumflag=true : $scope.flag.plannedVolumeRatioNumflag=false;
        }
        //规划建筑面积
        if (flag == 'planningFloorArea') {
            !val ? $scope.flag.planningFloorAreaflag = true : $scope.flag.planningFloorAreaflag = false;
        }
        //测绘面积
        if (flag == 'surveyArea') {
            !val ? $scope.flag.surveyAreaflag = true : $scope.flag.surveyAreaflag = false;
        }
    }
    // 省
    var sid, cid, aid, citylen, arealen, addresst = "";
    server.server().lyProvince({}, function (opt) {
        $scope.signListP = opt.data;
        $scope.$apply();

    })
    //市
    $scope.provincetab = function () {
        if ($scope.provinceId) {
            $scope.flag.provinceIdflag = false;
        } else {
            $scope.flag.provinceIdflag = true;
        }
       server.server().lyCity({
             parentId: $scope.provinceId
       }, function (opt) {
            $scope.city = opt.data;
            citylen = $scope.city.length;
            $scope.$apply();
       });
    }
    //区
    $scope.citytab = function () {
        if ($scope.cityId) {
            $scope.flag.cityIdflag = false;
        } else {
            $scope.flag.cityIdflag = true;
        }
        server.server().lyCity({
           parentId: $scope.cityId
        }, function (opt) {
           $scope.area = opt.data;
           $scope.$apply();
        })
    }
    //}
    //提交项目管理接口
    $scope.saveSubMit = function () {
        //接收时间
        $scope.startTime = $('.test1').val();

        if (!$scope.projectName) {
            $scope.flag.projectNameflag = true;
            return;
        }
       var addresst = $scope.provinceId + $scope.cityId + $scope.areaId + $scope.roadId
        server.server().lySaveSubMit({
                projectName: $scope.projectName,
                parcelNumber: $scope.projectnumber,
                provinceId: $scope.provinceId,
                cityId: $scope.cityId,
                areaId: $scope.areaId,
                roadId: $scope.roadId,
                // address: addresst,
                areaDemolition: $scope.areaDemolition,
                plannedVolumeRatio: $scope.plannedVolumeRatio,
                planningFloorArea: $scope.planningFloorArea,
                surveyArea: $scope.surveyArea,
                signingAgreementTime: $scope.startTime,
                createUser: $scope.createUser,
                agreementName:$scope.agreementName?$scope.agreementName:'框架协议'
            },
            function (opt) {
                if (!opt.result) {
                    alert(opt.message)
                } else {
                     alert(opt.message,function(){
                         $state.go('projectmanagement')});

                }

            }, function (opt) {
                alert(opt.message)
            });

    }
    //日期控件

    // laydate.render({
    //     elem: '.text1' //指定元素
    // });
    $scope.mychange = function (val) {
        laydate.render({
            elem: '.test1',
            //   value: new Date().toLocaleDateString(), //必须遵循format参数设定的格式
            format: 'yyyy-MM-dd', //可任意组合
            show: true, //直接显示
            closeStop: '.test2' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
        });
    }


    $scope.freturn = function () {
        $state.go('projectmanagement');
    }

}])
