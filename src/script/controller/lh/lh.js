'use strict';
angular.module('app').controller('projectmanagementCtrl', ['$http', '$scope', 'dict', 'server', '$rootScope','$state', function ($http, $scope, dict, server, $rootScope,$state) {
    var updateUser = server.server().userId;
    var imgHost = server.server().imgHost;
    var storage=window.localStorage;
    //项目管理列表
    $scope.no = '/';
    $scope.conf = {
        total: 10,  //共多少页
        currentPage: 1,  //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
    };

    $scope.listtop={
        projectId:'',
        createUser:server.server().userId,
        imgHost:server.server().imgHost,
        questiontype:4,//1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag:1,  //项目id1  物业id2
        reloadajax:1,   //需要调用函数就传1 or ''
        locationflag:1, //需要跳转到某页面就填写 1 or ''
    }
    //转移共享
    $scope.transferclick = {};
    $scope.gcShowWin=function(flag){
        $scope.transferclick.reset(flag,$scope.rows);
    }
    //跟踪
    $scope.action = {};
    $scope.dataFollowUp=function(roomId){
        $scope.projectId = roomId;
        $scope.action.reset(roomId,1);
    }
    //跟进页面刷新
    $scope.myajax=function(){
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
        lhprojectlistajax()
    }
    //跟进页面跳转
    $scope.mylocation=function(){
        // $state.go('builtDetails',{projectid:$scope.projectId,roomId:$scope.roomId})
    }
    

    //项目选中存id storage;
    $scope.checkitems=function(index){
        storage.setItem("a",$scope.rows[index].id);
    }

    ////////////////////共享和移交选择角色弹窗从这里开始


    ///////////////////end/////////////////////////////////


    $scope.$watch('conf.currentPage + conf.itemPageLimit+projectnameinput', function (news) {
        lhprojectlistajax()
    })
    function lhprojectlistajax(){
        server.server().lhprojectlist({
            pageNo: $scope.conf.currentPage,
            pageSize: $scope.conf.itemPageLimit,
            searchKeys: $scope.projectnameinput
        }, function (data) {
            if (data.result === true) {
                $scope.rows = data.data.rows;
                $scope.rows[0].status_1=true;
                //多少页
                $scope.conf.total = data.data.pageCount;
                //共有多少条数据
                $scope.conf.counts = data.data.total;
                $scope.$apply();
                $scope.$broadcast("categoryLoaded");
            } else {
                alert(data.message);
            }
        })
    }
    //项目管理初始化功能
    $scope.edit = function (id, obj) {
        $scope.check.projectNameflag = false;
        $scope.id = id;
        server.server().editInit({
            id: id
        }, function (data) {
            if (data.result === true) {
                $('.' + obj).dialog();
                $scope.project = data.data;
                if(!$scope.project.signingAgreementTime){
                    $scope.project.signingAgreementTime= '';
                }else{
                    $scope.project.signingAgreementTime= dict.timeConverter3($scope.project.signingAgreementTime,3);
                }

                $scope.agreementName=data.data.agreementName;//框架协议
                $scope.provinceList = data.data.provinceList;
                $scope.cityList = data.data.cityList;
                $scope.areaList = data.data.areaList;
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });
    }
    //省市三级联动
    $scope.provincetab = function (provinceId) {
        if ($scope.project.provinceId) {
            $scope.check.provinceIdflag = false;
        } else {
            $scope.check.provinceIdflag = true;
        }
        server.server().provinceselect({
            parentId: provinceId
        }, function (data) {
            if (data.result === true) {
                $scope.cityList = data.data;
                $scope.$apply();
            } else {
                alert(data.message);
            }

        });
    }
    $scope.citytab = function (cityId) {
        if ($scope.project.cityId) {
            $scope.check.cityIdflag = false;
        } else {
            $scope.check.cityIdflag = true;
        }
        server.server().provinceselect({
            parentId: cityId
        }, function (data) {
            if (data.result === true) {
                $scope.areaList = data.data;
                // console.log($scope.areas);
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });
    }

    $scope.check = {
        projectNameflag: false,
    }

    //非空验证
    $scope.tips = function (val, flag) {
        //项目名称
        if (flag == 'projectName') {
            !val ? $scope.check.projectNameflag = true : $scope.check.projectNameflag = false;
        }
    }

    //修改保存
    var sid, cid, aid, citylen, arealen, addresst = "";
    $scope.saveproject = function () {
        $('.saveDisabled').attr('disabled','disabled');
        if (!$scope.project.projectName) {
            $scope.check.projectNameflag = true;
            return;
        };
        addresst = $scope.project.provinceId + $scope.project.cityId + $scope.project.areaId + $scope.project.roadId;

        server.server().saveproject({
            id: $scope.project.id,//项目ID
            projectName: $scope.project.projectName,//项目名称
            parcelNumber: $scope.project.parcelNumber,//宗地编号
            provinceId: $scope.project.provinceId,//省id
            cityId: $scope.project.cityId,//市id
            areaId: $scope.project.areaId,//区id
            roadId: $scope.project.roadId,//街道地址
            // address: addresst,//项目位置
            agreementName:$scope.agreementName?$scope.agreementName:'框架协议',//框架协议名字
            areaDemolition: $scope.project.areaDemolition,
            plannedVolumeRatio: $scope.project.plannedVolumeRatio,
            planningFloorArea: $scope.project.planningFloorArea,
            surveyArea: $scope.project.surveyArea,
            updateUser: updateUser,
            signingAgreementTime:$scope.project.signingAgreementTime
        }, function (data) {
            if (data.result === true) {
                alert(data.message,function(){
                    lhprojectlistajax();
                    $('.hopbntbuild').hide();
                    $('.saveDisabled').removeAttr('disabled');
                })

                $scope.$apply();
            } else {
                alert(data.message,function(){ $('.saveDisabled').removeAttr('disabled');});
            }

        });
    }
    //删除数据
    $scope.flag = false;
    $scope.delete = function (id) {
            confirm('确认删除项目?',function(){
                server.server().delProject({
                    userId:updateUser,
                    projectId: id
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            lhprojectlistajax();
                        })
                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                });
            })

    }
    $scope.sels = function (id) {
        $scope.flag = false;
        server.server().deleteProjectData({
            id: id,
            userId: updateUser
        }, function (data) {
            if (data.result === true) {
                console.log(data.message);
                window.location.reload();
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
    $scope.cance = function () {
        $scope.flag = false;
    }
    //跟进信息


    //时间控件
    $scope.mychange = function (val) {
        laydate.render({
            elem: '.test1',
            //   value: new Date().toLocaleDateString(), //必须遵循format参数设定的格式
            format: 'yyyy-MM-dd', //可任意组合
            show: true, //直接显示
            closeStop: '.test2' ,//这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            done:function(val){
                $scope.project.signingAgreementTime=val;
            }
        });
    }
    //
    //项目管理删除功能
    //  $scope.delete=function(id){
    //      server.server().deleteProjectData({
    //          id:id
    //      }, function (data) {
    //          if (data.result === true) {
    //              console.log(data.message);
    //              window.location.reload();
    //              $scope.$apply();
    //          } else {
    //              alert(data.message);
    //          }
    //      }, function (err) {
    //
    //      });
    //  }
    // //项目搜索功能
    // server.server().filterdata({
    //     id:id
    // }, function (data) {
    //     if (data.result === true) {
    //         console.log(data.message);
    //         window.location.reload();
    //         $scope.$apply();
    //     } else {
    //         alert(data.message);
    //     }
    // }, function (err) {
    //
    // });

}])
//修改记录
    .controller('updatarecordCtrl', ['$http', '$scope', 'dict', 'server', function ($http, $scope, dict, server) {
        var projectId = '261e554de2f3493ebed1e4b6567818d1';
        $scope.no = '/';
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 4, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+projectnameinput', function (news) {
            console.log($scope.conf.currentPage);
            server.server().updatarecoedlist({
                pageNo: $scope.conf.currentPage,
                pageSize: $scope.conf.itemPageLimit,
                projectId: projectId
            }, function (data) {
                if (data.result === true) {
                    $scope.data = data.data.rows;

                    //多少页
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    // $scope.conf.total = data.data.total/data.data.pageSize;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$broadcast("categoryLoaded");
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            });

        })
    }]);

