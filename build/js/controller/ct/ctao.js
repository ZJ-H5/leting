'use strict';

/******************************/
/*附件（项目详情）*/

angular.module('app').controller('annexCtrl', ['$http', '$rootScope', '$scope', 'dict', 'server', '$state', function ($http, $rootScope, $scope, dict, server, $state) {
    $scope.projectId = $state.params.projectid;
    var projectId = $scope.projectId;
    var createUser = server.server().userId;
    var userId = server.server().userId;
    $scope.hostname = server.server().imgHost;

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
    //附件列表
    function fileListDate(){
        server.server().filelist({
            projectId: projectId
        }, function (data) {
            if (data.result === true) {
                $scope.data = data.data;
                $scope.length = data.data.length;
                console.log($scope.data);
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
    fileListDate();
    //添加附件
    $scope.addannex=function(files){
        $scope.count = 0;
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
            $scope.fileName = $scope.data.fileName;
            $scope.filePath = $scope.data.filePath;
            $scope.size = $scope.data.size;
            server.server().savefile({
                fileName: $scope.fileName,
                fileUrl: $scope.filePath,
                fileSize: $scope.size,
                dataId: projectId,
                createUser: createUser
            }, function (data) {
                if (data.result === true) {
                    fileListDate();
                    $scope.count++;
                    if($scope.count==length){
                        alert(data.message);
                    }
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        })
    }



    //下载
    $scope.downloadprojectfile = function (id) {
        var host = $scope.hostname + 'attachment/fileDownload.do'
        $scope.link = host + '?id=' + id;

    }
    //删除
    $scope.deletefifle = function (id) {
        console.log(id);
        server.server().deletefifle({
            id: id
        }, function (data) {
            if (data.result === true) {
                alert(data.message, function () {
                    fileListDate();
                });
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
}])
/*拆迁补偿*/
    .controller('compensationRulesCtrl', ['$http', '$scope', 'server', 'dict', function ($http, $scope, server, dict) {
        //添加补偿类型
        var projectId = '261e554de2f3493ebed1e4b6567818d1';
        var createUser = server.server().userId;
        var updateUser = server.server().userId;
        $scope.flagc = true;
        $scope.flagp = true;
        $scope.whetherOrNot = true;
        //本地村民补偿规则数据列表
        server.server().compensationlist({
            projectId: projectId
        }, function (data) {
            if (data.result === true) {
                $scope.data = data.data;
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        //获取类型名称
        $scope.add = function (name, id) {
            $scope.name = name;
            $scope.id = id;
        };
        //添加主题建筑产权置换初始化二级联动数据
        server.server().ruleslist({}, function (data) {
            if (data.result === true) {
                // console.log(data.data);
                $scope.compensateType = data.data.compensateType; //补偿类型父级
                //  console.log($scope.compensateType);
                $scope.compensate = data.data.compensateProject;//补偿项目
                $scope.rebuildTypes = data.data.rebuildTypes;//还建
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        })
        $scope.projectselect = function (typeid) {
            // console.log(typeid);
            server.server().projectlist({
                parentId: typeid
            }, function (data) {
                if (data.result === true) {
                    // console.log(data.data);
                    $scope.sublevel = data.data;
                    $scope.whetherOrNot=0;
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //显示级别与否
        //var length=$scope.compensateProject.length;
        $scope.whether = function (id) {
            for (var i = 0; i < $scope.sublevel.length; i++) {
                if (id == $scope.sublevel[i].id) {
                    $scope.whetherOrNot = $scope.sublevel[i].whetherOrNot;
                    // console.log($scope.whetherOrNot);
                }
            }
        }
        //置换保存
        $scope.mianflag = true;
        $scope.addbuilding = function (replacementratio, remaker, rank, rankremaker) {
            server.server().addbuild({
                typeId: $scope.id,
                type: 0,
                compensationId: $scope.typeid,
                childId: $scope.projectid,
                rank: rank,
                rankRemaker: rankremaker,
                replacementRatio: replacementratio,
                buildType: $scope.buildid,
                pricesMode: null,
                compensationPrice: null,
                remaker: remaker,
                createUser: createUser,
                compensateProjectId: null
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.mianflag = false;
                    $scope.rank = '';
                    $scope.rankRemaker = '';
                    $scope.replacementRatio = '';
                    $scope.remaker = '';
                    window.location.reload();
                    $scope.$apply();


                } else {
                    $scope.rank = '';
                    $scope.rankRemaker = '';
                    $scope.replacementRatio = '';
                    $scope.remaker = '';
                    alert(data.message);
                }
            }, function (err) {

            });
            $scope.rank = '';
            $scope.rankremaker = '';
            $scope.replacementratio = '';
            $scope.remaker = '';
            $scope.typeid = '';
            $scope.projectid = '';
            $scope.buildid = '';

        }
        //添加类型
        $scope.addTypeName = function (typename) {

            server.server().addtype({
                projectId: projectId,
                createUser: createUser,
                name: typename
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //货币补偿
        $scope.pricetype = 1;
        $scope.ok = function () {
            console.log($scope.pricetype);
        }
        //货币补偿二级初始化
        $scope.compensatesel = function (id) {
            server.server().projectlist({
                parentId: id
            }, function (data) {
                if (data.result === true) {
                    // console.log(data.data);
                    // $scope.compensate=data.data;
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //货币补偿新增保存
        $scope.savepricelist = function (price, remaker, compensateid) {
            server.server().addbuild({
                typeId: $scope.id,
                type: 1,
                compensationId: $scope.typeid,
                childId: $scope.projectid,
                rank: $scope.rank,
                rankRemaker: $scope.rankremaker,
                replacementRatio: null,
                buildType: null,
                pricesMode: $scope.pricetype,
                compensationPrice: price,
                remaker: remaker,
                createUser: createUser,
                compensateProjectId: $scope.compensateid
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.mianflag = false;
                    window.location.reload();
                    $scope.$apply();

                } else {
                    $scope.rank = '';
                    $scope.rankRemaker = '';
                    $scope.replacementRatio = '';
                    $scope.remaker = '';
                    alert(data.message);
                }
            }, function (err) {

            });
            $scope.rank = '';
            $scope.rankremaker = '';
            $scope.replacementratio = '';
            $scope.remaker = '';
            $scope.typeid = '';
            $scope.projectid = '';
            $scope.buildid = '';
        }
        //查看
        $scope.checkinfo = function (showtype, name, id, rid) {
            $('.' + showtype).dialog();
            $scope.name = name;
            $scope.id = id;
            console.log(rid);
            server.server().checkinfolist({
                id: rid
            }, function (data) {
                console.log(data);
                if (data.result === true) {
                    $scope.data = data.data;
                    console.log(data.data);
                    $scope.remaker = data.data.remaker ? data.data.remaker : '';
                    $scope.compensationPrice = data.data.compensationPrice
                    // console.log($scope.compensationPrice);
                    // $scope.compensate=data.data;
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //编辑
        $scope.editinfo = function (rtype, name, id, rid,compensationId) {
            $scope.rid = rid;
            $scope.typeid=compensationId;
            if (rtype == 0) {//主体建筑产权置换
                $('.hopruleopenedit').dialog();
                $scope.id = id;
                server.server().editinfobuild({
                    id: rid
                }, function (data) {
                    if (data.result === true) {
                        console.log(data.data.rulesMap);
                        $scope.builddata = data.data.rulesMap;
                        $scope.rebuildTypes = data.data.rebuildTypes;
                        $scope.typeid=$scope.builddata.compensationId;
                        $scope.comid=$scope.builddata.compensateProjectId;

                        //获取置换类型
                        for (var i = 0; i < $scope.compensateType.length; i++) {
                            if ($scope.builddata.compensationId == $scope.compensateType[i].id) {

                                $scope.cname = $scope.compensateType[i].compensateName;
                                //console.log($scope.cname);
                            }
                        }
                        //获取置换类型子类型
                        // console.log(typeid);
                        // $scope.sid=$scope.builddata.childId;
                        server.server().projectlist({
                            parentId: $scope.builddata.compensationId
                        }, function (data) {
                            if (data.result === true) {
                                $scope.sublevel = data.data;
                                for (var i = 0; i < $scope.sublevel.length; i++) {
                                    if ($scope.builddata.childId == $scope.sublevel[i].id) {
                                        $scope.sublevelcompensatename = $scope.sublevel[i].sublevelCompensateName;
                                        // console.log($scope.sublevelcompensatename);
                                    }
                                }
                                $scope.$apply();

                            } else {
                                alert(data.message);
                            }
                        }, function (err) {

                        });

                        for (var i = 0; i < $scope.rebuildTypes.length; i++) {
                            if ($scope.builddata.buildType == $scope.rebuildTypes[i].id) {
                                $scope.rebuildtype = $scope.rebuildTypes[i].shemaName;
                                console.log($scope.rebuildtype);
                            }
                        }

                        //console.log($scope.builddata);
                        // $scope.remaker=data.data.remaker;
                        //console.log(data.data);
                        // $scope.compensate=data.data;
                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            }
            else {//货币补偿
                $('.hopbntshareedit').dialog();
                $scope.name = name;
                $scope.id = id;
                // console.log(rid);
                server.server().editinfoprice({
                    id: rid
                }, function (data) {
                    if (data.result === true) {
                        $scope.pricedata = data.data.rulesMap;
                        $scope.comid=$scope.pricedata.compensateProjectId;
                        $scope.compensateProject = data.data.compensateProject;
                        console.log($scope.compensateProject);//补偿项目
                        $scope.compensateType = data.data.compensateType;//置换类型
                        $scope.compensateProjectId = $scope.pricedata.compensateProjectId;
                        $scope.typeid=$scope.pricedata.compensationId;
                        //获取还建类型
                        $scope.buildid=$scope.pricedata.buildType;
                        //获取项目类型
                        for (var i = 0; i < $scope.compensateProject.length; i++) {
                            if ($scope.compensateProjectId == $scope.compensateProject[i].id) {
                                $scope.pName = $scope.compensateProject[i].compensateName;
                                console.log($scope.pName);
                            }
                        }
                        //获取置换类型
                        for (var i = 0; i < $scope.compensateType.length; i++) {
                            if ($scope.pricedata.compensationId == $scope.compensateType[i].id) {

                                $scope.cname = $scope.compensateType[i].compensateName;
                                //console.log($scope.cname);
                            }
                        }
                        //获取置换类型子类型
                        server.server().projectlist({
                            parentId: $scope.pricedata.compensationId
                        }, function (data) {
                            if (data.result === true) {
                                $scope.sublevel = data.data;
                                for (var i = 0; i < $scope.sublevel.length; i++) {
                                    if ($scope.pricedata.childId == $scope.sublevel[i].id) {
                                        $scope.sublevelcompensatename = $scope.sublevel[i].sublevelCompensateName;
                                        // console.log($scope.sublevelcompensatename);
                                    }
                                }
                                $scope.$apply();

                            } else {
                                alert(data.message);
                            }
                        }, function (err) {

                        });
                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            }

        }
        //
        // $scope.change=function(id){
        //     $scope.comid=id;
        //     console.log($scope.comid);
        // }
        //修改保存货币
        $scope.updatepricelist = function (price, remaker, rank, rankremaker) {
            console.log($scope.comid);

            server.server().updatepricelist({
                id: $scope.rid,
                typeId: $scope.id,
                type: 1,
                compensationId: $scope.typeid,
                childId: $scope.sid,
                rank: rank ? rank : null,
                rankRemaker: rankremaker,
                replacementRatio: null,
                buildType: null,
                pricesMode: $scope.pricetype,
                compensationPrice: price,
                remaker: remaker ? remaker : null,
                createUser: createUser,
                compensateProjectId: $scope.comid,
                updateUser: updateUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.mianflag = false;
                    $scope.$apply();

                } else {
                    $scope.rank = '';
                    $scope.rankRemaker = '';
                    $scope.replacementRatio = '';
                    $scope.remaker = '';
                    alert(data.message);
                }
            }, function (err) {

            });
            $scope.rank = '';
            $scope.rankremaker = '';
            $scope.replacementratio = '';
            $scope.remaker = '';
            $scope.typeid = '';
            $scope.projectid = '';
            $scope.buildid = '';
            $scope.comid = ''
        }
        //修改主体建筑
        $scope.updatabuild = function (replacementratio, remaker, rank, rankremaker) {
            console.log($scope.typeid);
            console.log($scope.builddata.replacementRatio);

            server.server().updatepricelist({
                id: $scope.rid,
                typeId: $scope.id,
                type: 0,
                compensationId: $scope.typeid,
                childId: $scope.sid,
                rank: rank,
                rankRemaker: rankremaker,
                replacementRatio: replacementratio,
                buildType: $scope.buildid,
                pricesMode: null,
                compensationPrice: null,
                remaker: remaker,
                updateUser: updateUser,
                compensateProjectId: null
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.mianflag = false;
                    $scope.$apply();

                } else {
                    $scope.rank = '';
                    $scope.rankRemaker = '';
                    $scope.replacementRatio = '';
                    $scope.remaker = '';
                    alert(data.message);
                }
            }, function (err) {

            });
            $scope.rank = '';
            $scope.rankremaker = '';
            $scope.replacementratio = '';
            $scope.remaker = '';
            $scope.typeid = '';
            $scope.projectid = '';
            $scope.buildid = '';

        }

        //删除
        $scope.deleteinfo = function (id) {
            confirm('确认删除该条信息', function () {
                server.server().deletecom({
                    id: id,
                    userId: createUser
                }, function (data) {
                    if (data.result === true) {
                        alert("删除成功");

                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            });
            console.log(id);
        }


        //添加主体建筑产权置换
        // $scope.addbuilding=function(){
        //     server.server().compensationlist({
        //         typeId:'1',
        //         createUser:createUser,
        //         replacementRatio:,
        //
        //     }, function (data) {
        //         if (data.result === true) {
        //             $scope.data=data.data;
        //             console.log(data.data);
        //             $scope.$apply();
        //
        //         } else {
        //             alert(data.message);
        //         }
        //     }, function (err) {
        //
        //     });
        // }


    }])
    //项目详情拆迁补偿规则
    .controller('projectcompensationRulesCtrl', ['$http', '$scope', 'server', '$state', 'dict', '$location', '$rootScope', function ($http, $scope, server, $state, dict, $location, $rootScope) {
        //添加补偿类型
        $scope.projectId = $state.params.projectid;
        var projectId = $scope.projectId;
        var createUser = server.server().userId;
        var updateUser = server.server().userId;
        // $scope.pricedata={pricesMode:1};
        $scope.flagc = true;
        $scope.flagp = true;
        $scope.whetherOrNot = 0;//级别初始化
        $scope.status=false;//限定面积初始化
        $scope.isRestricted=1;//是否限定
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
        //取消按钮
        $scope.cancel=function(){
            canceldata();
        };
        function canceldata(){
            $scope.typeid='';//补偿项目ID/货币补偿项目类型
            $scope.sid='';//补偿项目子类型ID/货币补偿项目子类型
            $scope.rank='';//级别
            $scope.rankremaker='';//级别备注
            $scope.replacementratio='';//置换比例
            $scope.buildid='';//还建类型
            $scope.remaker='';//备注
            $scope.compensateid='';//货币补偿-补偿项目
            $scope.priceType=1;//单价
            $scope.price='';
            $scope.compensateid='';
            $scope.status=false;
            $scope.restrictedArea='';
            $scope.whetherOrNot = 0;//级别初始化
            $scope.isRestricted=1;//限定面积checkbox
            $scope.updateRestrictedArea='';//编辑限定面积为空
            $('.saveDisabled').removeAttr('disabled');//去除按钮无法点击
        };
        //规则名称修改
        $scope.editRule=function(flag,name,id){
            $('.'+flag).dialog();
            $scope.ruleName=name;
            $scope.ruleId=id;
        }
        //规则名称修改保存
        $scope.editRuleName=function(ruleId){
            server.server().ruleNameUpdate({
                name:$scope.ruleName,
                id:ruleId,
                updateUser: updateUser,
                projectId: projectId
            }, function (data) {
                if (data.result === true) {
                   alert(data.message,function(){
                       compensationListData();
                   })
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //规则删除
        $scope.releteRule=function(name,id){
            confirm('确定删除'+name+'?',function(){
                server.server().ruleDelete({
                    id:id,//规则ID
                    userId:createUser
                }, function (data) {
                    console.log(data);
                    if (data.result === true) {
                        alert(data.message,function(){
                            compensationListData();
                        })
                        $scope.$apply();

                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
        //本地村民补偿规则数据列表
        function compensationListData(){
            server.server().compensationlist({
                projectId: projectId
            }, function (data) {
                console.log(data);
                if (data.result === true) {
                    $scope.dataInfo = data.data;
                    $scope.dataInfo.forEach(function(item,i){
                        $scope.dataInfo[i].flag = i;
                    })
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        compensationListData();
        //获取类型名称
        $scope.add = function (flag,name, id) {
             $('.'+flag).dialog();
             $scope.leixingname = name;
            $scope.id = id;

        };
        //添加主题建筑产权置换初始化二级联动数据
        server.server().ruleslist({}, function (data) {
            if (data.result === true) {
                $scope.compensateType = data.data.compensateType; //补偿类型父级
                $scope.compensate = data.data.compensateProject;//补偿项目
                $scope.rebuildTypes = data.data.rebuildTypes;//还建
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        });

        //选择来判断限定面积出现与否
        $scope.compensateSelect=function(compensateid){
            $scope.compensate.forEach(function(item,i){
                if(item.id==compensateid) {
                    if (item.status == 1) {
                        $scope.status = true;
                    } else {
                        $scope.status = false;
                        $scope.updateRestrictedArea='';
                        $scope.restrictedArea='';
                        $scope.isRestricted='';//是否限定

                    }
                }
            })
        }
        //选择来判断级别出现与否
        $scope.projectselect = function (typeid) {
            server.server().projectlist({
                parentId: typeid
            }, function (data) {
                if (data.result === true) {
                    $scope.sublevel = data.data;
                    $scope.whetherOrNot=0;
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //显示级别与否
        $scope.whether = function (id) {
            for (var i = 0; i < $scope.sublevel.length; i++) {
                if (id == $scope.sublevel[i].id) {
                    $scope.whetherOrNot = $scope.sublevel[i].whetherOrNot;
                }
            }
        }
        //置换保存
        $scope.mianflag = true;
        $scope.addbuilding = function (replacementratio, remaker, rank, rankremaker) {
            $('.saveDisabled').attr('disabled','disabled');
            server.server().addbuild({
                typeId: $scope.id,
                type: 0,
                compensationId: $scope.typeid,
                childId: $scope.sid,
                rank: rank,
                rankRemaker: rankremaker,
                replacementRatio: replacementratio,
                buildType: $scope.buildid,
                pricesMode: null,
                compensationPrice: null,
                remaker: remaker,
                createUser: createUser,
                compensateProjectId: null
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                   $('.hopaddruleopen').fadeOut(300);
                    $('body').css({
                        "overflow": "auto",
                        "padding-right": 0
                    });
                    $('.hopmainopen').hide();
                    $('.saveDisabled').removeAttr('disabled');
                    canceldata();
                    $scope.$apply();
                    compensationListData();

                } else {
                    alert(data.message,function(){
                        canceldata();
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    canceldata();
                    $('.saveDisabled').removeAttr('disabled');
                    $scope.$apply();
                });
            });

        }
        //添加类型
        $scope.addTypeName = function (typename) {

            server.server().addtype({
                projectId: projectId,
                createUser: createUser,
                name: typename
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.typeName='';
                    compensationListData();
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //货币补偿
        $scope.priceType = 1;
        //货币补偿二级初始化
        $scope.compensatesel = function (id) {
            server.server().projectlist({
                parentId: id
            }, function (data) {
                if (data.result === true) {
                    // console.log(data.data);
                    // $scope.compensate=data.data;
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        $scope.rank = '';
        $scope.rankremaker = '';
        //货币补偿新增保存
        $scope.savepricelist = function (price, remaker,rank,rankremaker) {
            $('.saveDisabled').attr('disabled','disabled');
            if($scope.isRestricted==0){
                $scope.restrictedArea='';
            }
            server.server().addbuild({
                typeId: $scope.id,
                type: 1,
                compensationId: $scope.typeid,
                childId: $scope.sid,
                rank: rank,
                rankRemaker: rankremaker,
                replacementRatio: null,
                buildType: null,
                pricesMode: $scope.priceType,
                compensationPrice: price,
                remaker: remaker,
                createUser: createUser,
                isRestricted:$scope.isRestricted,
                restrictedArea:$scope.restrictedArea,
                compensateProjectId: $scope.compensateid
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $('.hopaddruleopen').fadeOut(300);
                    $('body').css({
                        "overflow": "auto",
                        "padding-right": 0
                    });
                    $('.hopmonetopen').hide();
                    $('.saveDisabled').removeAttr('disabled');
                    canceldata();
                    compensationListData();
                    $scope.$apply();

                } else {

                    alert(data.message,function(){
                        canceldata();
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    canceldata();
                    $('.saveDisabled').removeAttr('disabled');
                    $scope.$apply();
                });

            });
        }
        //查看
        $scope.checkinfo = function (indx,flag) {
            if($scope.dataInfo[flag].rules[indx].type=='0'){
                $('.hopruleopen').dialog();
            }else{
                $('.hopbntshare').dialog();
            }

            $scope.hopruleopenname = $scope.dataInfo[flag].name;
            $scope.id = $scope.dataInfo[flag].id;
            server.server().checkinfolist({
                id: $scope.dataInfo[flag].rules[indx].id
            }, function (data) {
                if (data.result === true) {
                    $scope._data = data.data;
                    $scope.remaker = data.data.remaker ? data.data.remaker : '';
                    $scope.compensationPrice = data.data.compensationPrice;
                    $scope.pricesMode=data.data.pricesMode;
                    // console.log($scope.compensationPrice);
                    // $scope.compensate=data.data;
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });


        }
        // $scope.close = function () {
        //     compensationListData();
        // }
        //编辑初始化
        $scope.editinfo = function (rtype, name, id, rid,r) {
            $scope.rid = rid;
            if (rtype == 0) {//主体建筑产权置换
                $('.hopruleopenedit').dialog();
                $scope.hopruleopeneditname = name;
                $scope.id = id;
                server.server().editinfobuild({
                    id: rid
                }, function (data) {
                    console.log(data);
                    if (data.result === true) {
                        $scope.builddata = data.data.rulesMap;
                        $scope.rebuildTypes = data.data.rebuildTypes;//还建类型列表
                        //获取置换类型
                        $scope.typeid=$scope.builddata.compensationId;//置换类型ID
                        $scope.sid=$scope.builddata.childId;//置换类型子ID

                        //获取置换类型子类型
                        server.server().projectlist({
                            parentId: $scope.typeid
                        }, function (data) {
                            if (data.result === true) {
                                $scope.sublevel = data.data;
                                $scope.$apply();

                            } else {
                                alert(data.message);
                            }
                        }, function (err) {

                        });
                        //获取还建类型ID
                        $scope.buildid=$scope.builddata.buildType;
                        $scope.$apply();
                    } else {
                        alert(data.message,function(){
                            $('.hopruleopenedit').hide();
                        });
                    }
                }, function (err) {

                });
            }
            else {//货币补偿
                $('.hopbntshareedit').dialog();
                $scope.hopbntshareeditname = name;
                $scope.id = id;
                // console.log(rid);
                server.server().editinfoprice({
                    id: rid
                }, function (data) {
                    if (data.result === true) {
                        console.log(data.data.rulesMap);
                        $scope.pricedata = data.data.rulesMap;
                        $scope.compensateProject=data.data.compensateProject;//补偿项目列表
                        $scope.comid = $scope.pricedata.compensateProjectId;//补偿项目ID
                        $scope.typeid=$scope.pricedata.compensationId;//置换类型ID
                        $scope.sid=$scope.pricedata.childId;//置换类型子ID
                        $scope.isupdateRestricted=$scope.pricedata.isRestricted;//限定面积显示与否
                        $scope.status=$scope.isupdateRestricted==1||$scope.isupdateRestricted==0?true:false;
                        $scope.updateRestrictedArea=$scope.pricedata.restrictedArea;//限定面积
                        //获取置换类型子类型
                        server.server().projectlist({
                            parentId: $scope.pricedata.compensationId
                        }, function (data) {
                            if (data.result === true) {
                                $scope.sublevel = data.data;
                                $scope.$apply();

                            } else {
                                alert(data.message);
                            }
                        }, function (err) {

                        });
                        $scope.$apply();
                    } else {
                        alert(data.message,function(){
                            $('.hopbntshareedit').hide();
                        });
                    }
                }, function (err) {

                });
            }

        }
        //修改保存货币
        $scope.updatepricelist = function (price, remaker, rank, rankremaker) {
            $('.saveDisabled').attr('disabled','disabled');
            if($scope.isupdateRestricted==0){
                $scope.updateRestrictedArea='';
            }
            server.server().updatepricelist({
                id: $scope.rid,
                typeId: $scope.id,
                type: 1,
                compensationId: $scope.typeid,//置换类型ID
                childId: $scope.sid,//置换类型子ID
                rank: rank ? rank : null,
                rankRemaker: rankremaker,
                replacementRatio: null,
                buildType: null,
                pricesMode: $scope.pricedata.pricesMode,
                compensationPrice: price,
                remaker: remaker ? remaker : null,
                createUser: createUser,
                isRestricted:$scope.isupdateRestricted,
                restrictedArea:$scope.updateRestrictedArea,
                compensateProjectId: $scope.comid,//补偿项目id
                updateUser: updateUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.mianflag = false;
                    $('#editsuccessprice').hide();
                    $('.saveDisabled').removeAttr('disabled');
                    canceldata();
                    compensationListData();
                    $scope.$apply();

                } else {
                    alert(data.message,function(){
                        $scope.mianflag = false;
                        $('#editsuccessprice').hide();
                        $('.saveDisabled').removeAttr('disabled');
                        canceldata();
                        compensationListData();
                        $scope.$apply();
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    $scope.mianflag = false;
                    $('#editsuccessprice').hide();
                    $('.saveDisabled').removeAttr('disabled');
                    canceldata();
                    compensationListData();
                    $scope.$apply();
                });
            });
        }
        //修改保存主体建筑
        $scope.updatabuild = function (replacementratio, remaker, rank, rankremaker) {
            $('.saveDisabled').attr('disabled','disabled');

            server.server().updatepricelist({
                id: $scope.rid,
                typeId: $scope.id,
                type: 0,
                compensationId: $scope.typeid,
                childId: $scope.sid,
                rank: rank,
                rankRemaker: rankremaker,
                replacementRatio: replacementratio,
                buildType: $scope.buildid,
                pricesMode: null,
                compensationPrice: null,
                remaker: remaker,
                updateUser: updateUser,
                compensateProjectId: null
            }, function (data) {
                if (data.result === true) {
                    
                    alert(data.message,function(){
                        $scope.mianflag = false;
                        $('.hopruleopenedit').hide();
                        $('.saveDisabled').removeAttr('disabled');
                        compensationListData();
                        canceldata();
                    });

                    $scope.$apply();

                } else {

                    alert(data.message,function(){
                        canceldata();
                        $('.hopruleopenedit').hide();
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    canceldata();
                    $('.hopruleopenedit').hide();
                    $('.saveDisabled').removeAttr('disabled');
                    $scope.$apply();
                });
            });


        }

        //删除
        $scope.deleteinfo = function (id) {
            confirm('确认删除该条信息', function () {
                server.server().deletecom({
                    id: id,
                    userId: createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            compensationListData();
                        });
                        $scope.$apply();

                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            });
        }
    }])


    /******************************/
    //项目详情-佣金规则
    .controller('projectcommissionreleaseCtrl', ['$http', '$scope', 'server', '$state', 'dict', '$rootScope', function ($http, $scope, server, $state, dict, $rootScope) {
        $scope.projectId = $state.params.projectid;
        $scope.typeValue=1;
        var createUser = server.server().userId;
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
        //清除数据
        function cancel(){
            //查处违建佣金规则
            $scope.wzIssuingNode='';//发放节点
            $scope.wzCommission='';//佣金
            $scope.wzRemarks='';//备注
            //签约佣金
            $scope.process='';//进度1
            $scope.process2='';//进度2、
            $scope.standard='';//标准’
            //总合业务
            $scope.zhIntegratedName='';//项目名称
            $scope.typeValue=1;
            $scope.zhCommission='';
            $scope.zhRemarks='';
            $scope.checkData.ruletabsel='';
            $scope.checkData.ruletabselone='';
            $scope.checkData.ruletabselTwo='';
            $scope.checkData.ruletabselThree='';
            $('.saveDisabled').removeAttr('disabled');
        }
        //签约佣金取消
        $scope.qyCancel=function(){
            window.location.reload();//由于代码是由jquery写的，导致页面清除没办法使用$scope来清除，所以使用重新请求来完成清除数据
            $('.saveDisabled').removeAttr('disabled');
        }
        //综合和查伪的取消
        $scope.clearData=function(){
            cancel();
            $('.saveDisabled').removeAttr('disabled');
        }
        //var createUser=server.server().userId;
        // 违建佣金规则查询列表
        function ctRule(){
            server.server().ctillegalcommissionrule({
                projectId: $scope.projectId
            }, function (data) {


                $scope.weijian = data.data;

                $scope.$apply();//如果数据无法正常出来则调用该方法
            }, function () {

            })
        };
        ctRule();


        // 综合业务佣金规则查询列表
        function ctIntegratedList(){
            server.server().ctintegratedservices({
                projectId: $scope.projectId
            }, function (data) {
                $scope.yewu = data.data;
                $scope.yewu.forEach(function (item, index) {
                    $scope.yewu[index].types = $scope.yewu[index].type == 1 ? '签约节点' : '测绘数据';
                })
                $scope.$apply();//如果数据无法正常出来则调用该方法
            })
        }
        ctIntegratedList();
        //查看综合业务佣金规则查询列表
        $scope.serviceslook = function (id,type, obj) {
            $('.' + obj).dialog();
                // 查看查处违建佣金规则
                server.server().servicefindbyid({
                    id: id,
                    userId: createUser,
                    type:type
                }, function (data) {
                    $scope.services = data.data;
                    $scope.$apply();//如果数据无法正常出来则调用该方法
                })


        }

        // 编辑综合业务佣金规则查询列表
        $scope.serviceseditor = function (item, obj) {
            $('.' + obj).dialog();
            $scope.id = item.id;
            server.server().servicedupdate({
                id: $scope.id
            }, function (data) {

                $scope.services = data.data.synthesize;
                $scope.stage = data.data.sign.stage;
                $scope.sublevelStage = data.data.sign.sublevelStage;
                $scope.surveyList = data.data.survey.surveyList;
                $scope.typeList = data.data.survey.typeList;
                $scope.projectId = data.data.synthesize.projectId;
                //初始化
                $scope.typeValue2=$scope.services.type;
                if($scope.typeValue2==1){//签约节点
                    $scope.ruletabsel=$scope.services.paymentStandardOne;
                    //签约节点二级列表请求
                    server.server().servisign({
                        parentId: $scope.ruletabsel
                    }, function (data) {
                        $scope.singe = data.data;
                        $scope.$apply();
                    })
                    $scope.onesel=$scope.services.paymentStandardTwo;
                }else if($scope.typeValue2==2){//测绘数据
                    $scope.threesel=$scope.services.paymentStandardTwo;
                    $scope.twosel=$scope.services.paymentStandardOne;
                }

                $scope.$apply();//如果数据无法正常出来则调用该方法
                $scope.editsaveservices = function () {
                    $('.saveDisabled').attr('disabled','disabled');
                    var one='',two='',typenum='';
                    if ($scope.typeValue2==1) {//签约节点
                         typenum = 1;
                         one = $scope.ruletabsel;
                         two = $scope.onesel;
                    } else if($scope.typeValue2==2){//测绘数据
                         typenum = 2;
                         one = $scope.twosel;
                         two = $scope.threesel;
                    }

                    server.server().servicesavedata({
                        id: $scope.id,
                        projectId: $scope.projectId,
                        updateUser: createUser,
                        integratedName: $scope.services.integratedName,
                        paymentStandardOne: one,
                        paymentStandardTwo: two,
                        type: typenum,
                        commission: $scope.services.commission,
                        unit: typenum,
                        remarks: $scope.services.remarks
                    }, function (data) {
                        alert(data.message, function () {
                            $('.saveDisabled').removeAttr('disabled');
                            ctIntegratedList();
                            $scope.$apply();
                        });

                    })
                }
            }, function () {

            })
        }
        // 删除综合业务佣金规则查询列表
        $scope.servicesdel = function (item) {
            $scope.servicesid = item.id;

            confirm('你确定要删除?', function () {
                server.server().servicedeldata({
                    id: $scope.servicesid,
                    userId: createUser
                }, function (data) {
                    alert(data.message);
                    ctIntegratedList();
                    $scope.$apply();
                })
            })
        }
        $scope.isflag1 = true;
        $scope.changeColor = function () {
            if ($scope.typeValue == 1) {
                $scope.isflag1 = true;
                $scope.isflag2 = false
            } else {
                $scope.isflag1 = false;
                $scope.isflag2 = true
            }
        }


        /*添加规则--综合业务佣金规则添加*/
        $scope.clear=function(flag){
            if(flag==1){//签约事件请求
                $scope.twosel='';
                $scope.threesel='';
                $scope.checkData.ruletabselTwo='';
                $scope.checkData.ruletabselThree=''
            }else if (flag==2){//测绘请求
                $scope.checkData.ruletabsel='';
                $scope.checkData.ruletabselone='';
                $scope.ruletabsel='';
                $scope.onesel='';
            }
        }


        //签约节点一级和测绘节点一二级
        server.server().serviceinitAdd({}, function (data) {

            $scope.stage = data.data.sign;//签约节点一层
            $scope.surveyList = data.data.survey.surveyList;//测绘一层
            $scope.typeList = data.data.survey.typeList;//测绘二层
        })

        $scope.checktab = function (item) {
            //签约节点二级列表请求
            server.server().servisign({
                parentId: item
            }, function (data) {
                $scope.singe = data.data;
                $scope.$apply();
            })
        }
        var one='',two='',typenum='';
        // $scope.checkData={ruletabsel:'',ruletabselone:'',ruletabselTwo:'',ruletabselThree:''};
        $scope.saveZHYW = function () {
            $('.saveDisabled').attr('disabled','disabled');
                if ($scope.typeValue==1) {//签约
                     typenum = 1;
                     one = $scope.checkData.ruletabsel;
                     two = $scope.checkData.ruletabselone;
                     $scope.unit= 1;
                } else if($scope.typeValue==2){//测绘
                     typenum = 2;
                     one = $scope.checkData.ruletabselTwo;
                     two = $scope.checkData.ruletabselThree;
                     $scope.unit= 2;
                }
                server.server().ctintegratedaddsave({
                    projectId: $scope.projectId,
                    createUser: createUser,
                    integratedName: $scope.zhIntegratedName,
                    paymentStandardOne: one,
                    paymentStandardTwo: two?two:'',
                    type: typenum,
                    commission: $scope.zhCommission,
                    unit: $scope.unit,
                    remarks: $scope.zhRemarks
                }, function (data) {
                    if(data.result==true){
                        alert(data.message, function () {
                            $('.addzhywRules').hide();
                            ctIntegratedList();
                            $scope.checkData={ruletabsel:'',ruletabselone:'',ruletabselTwo:'',ruletabselThree:''};
                            $scope.zhIntegratedName='';
                            $scope.zhCommission='';
                            $scope.unit='';
                            $scope.zhRemarks='';
                            $('.saveDisabled').removeAttr('disabled');
                            $scope.$apply();
                        })
                    }else{
                        alert(data.message, function () {
                            $('.saveDisabled').removeAttr('disabled');
                            $scope.$apply();
                        })
                    }

                },function(data){
                    alert(data.message, function () {
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    })
                })
            }


        // 签约佣金规则列表
        function ctommissionList(){
            server.server().ctommissionrules({
                projectId: $scope.projectId,
            }, function (data) {
                $scope.rulesdata = data.data;
                $scope.$apply();
            })
        }
        ctommissionList();
        //查看签约佣金
        $scope.rulelook=function(item, obj){
            $('.' + obj).dialog();
            var nodejsonsrt = [];
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            server.server().ruleinitupdata({
                id: $scope.useid
            }, function (data) {
                $scope.ruleditor = data.data;
                $scope.$apply();
            })
        }
        //编辑中点击增加
        $scope.addDetail=function(){
            if($scope.detailsList.length<4){
                $scope.detailsList.push({commsionPercent:'',ruleNodes:''});
            }

        }
        //编辑中点击删除
        $scope.delDetail=function(){
            if($scope.detailsList.length>0) {
                $scope.detailsList.pop();
            }

        }
        //编辑签约佣金
        $scope.ruleedit = function (item, obj) {
            $('.' + obj).dialog();
            var nodejsonsrt = [];
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            server.server().ruleinitupdata({
                id: $scope.useid
            }, function (data) {
                $scope.ruleditor = data.data;
                $scope.detailsList=data.data.detailsList;
                console.log($scope.detailsList);
                $scope.$apply();
                $scope.saveeditorule = function () {
                    $('.saveDisabled').attr('disabled','disabled');
                    var sum = 0, ffPercentNum = 0;
                    for (var i = 0; i < $scope.ruleditor.detailsList.length; i++) {
                        nodejsonsrt[i] = {
                            id: $scope.ruleditor.detailsList[i].id,
                            rank: i + 1,
                            ruleNodes: $scope.ruleditor.detailsList[i].ruleNodes,
                            commsionPercent: $scope.ruleditor.detailsList[i].commsionPercent,
                            isHandOver: i
                        }
                        ffPercentNum = $scope.ruleditor.detailsList[i].commsionPercent;
                        ffPercentNum = parseInt(ffPercentNum);
                        sum += ffPercentNum;
                    }
                    var nodetype = JSON.stringify(nodejsonsrt);


                    if (sum !== 100) {
                        alert("提交失败，发放比例之和必须等于100%！");
                        $('.saveDisabled').removeAttr('disabled');
                        return;
                    }

                    server.server().ruleupdateSave({
                        projectId: $scope.projectId,
                        id: $scope.useid,
                        updateUser: createUser,
                        allProcess: $scope.ruleditor.allProcess,
                        allProcess2: $scope.ruleditor.allProcess2,
                        standard: $scope.ruleditor.standard,
                        nodeJson: nodetype
                    }, function (data) {
                        alert(data.message, function () {
                            $('.saveDisabled').removeAttr('disabled');
                            window.location.reload();
                        });

                    })
                }
            }, function () {
                $('.saveDisabled').removeAttr('disabled');
            })

        }
        //5、删除提交审核
        $scope.ruledel = function (item) {
            $scope.id = item.id;

            confirm('你确定要删除?', function () {
                server.server().ruledeleteSave({
                    id: $scope.id,
                    userId: createUser
                }, function (data) {
                    alert(data.message, function () {
                        ctommissionList();
                    });

                    $scope.$apply();
                })
            })
        }

        var htm = "<tr>\n" +
            "<th width=\"15%\" class=\"pl30 maincolor\">发放节点：</th>\n" +
            "<td >\n" +
            "<input type=\"text\"  value=\"\" class=\"c-yjgzinpc c-bordere6 mt10 left ffNodes\">\n" +
            "<span class=\"ml50 mr10 maincolor left\">发放比例(%)：</span>\n" +
            "<input type=\"text\"   class=\"c-yjgzinpc c-bordere6 mr5 mt10 left ffPercent\">\n" +
            "</td>\n" +
            "</tr>";
        var trleng;
        $scope.addffjd = function (obj) {

            trleng = $("." + obj).find("tr").length;

            if (trleng < 5) {
                $("." + obj).append(htm);
            }
            $scope.$apply();
        }

        $scope.delffjd = function (obj) {
            trleng = $("." + obj).find("tr").length;
            if (trleng > 2) {
                $("." + obj).find("tr:last-child").remove();
            }
            $scope.$apply();
        }
        //判断非空
        var ifalse = true;
        $scope.inputips = function (item) {
            if ($(item.target).val() == '') {
                ifalse = false;
                $(item.target).parent().find('.red').removeClass('disnone')

            } else {
                ifalse = true;
                $(item.target).parent().find('.red').addClass('disnone')
            }

        }

        //添加签约佣金规则 点击保存
        $scope.saveYJGZ = function (obj) {
            $('.saveDisabled').attr('disabled','disabled');
            if (!$scope.process2) {
                $('.saveDisabled').removeAttr('disabled');
                $('.t1').removeClass('disnone');
                ifalse = false;
                $(item.target).parent().find('.red').removeClass('disnone')
            }
            if (!$scope.standard) {
                $(item.target).parent().find('.red').removeClass('disnone')
                $('.t2').removeClass('disnone');
                ifalse = false;
                $('.saveDisabled').removeAttr('disabled');
            }
            if (!$scope.standard) {
                $(item.target).parent().find('.red').removeClass('disnone')
                $('.t2').removeClass('disnone');
                ifalse = false;
                $('.saveDisabled').removeAttr('disabled');
            }
            if (!ifalse) {
                $(item.target).parent().find('.red').removeClass('disnone')
                $('.saveDisabled').removeAttr('disabled');
                return;
            }
            var nodeJson = [];
            var dtr = $("." + obj).find("tr");
            var ffPercentNum, sum = 0;

            // var trleng=dtr.length;

            for (var i = 0; i < dtr.length - 1; i++) {
                var rulenode = $("." + obj).find('.ffNodes').eq(i).val();
                nodeJson[i] =
                    {
                        rank: i + 1,
                        ruleNodes: rulenode,
                        commsionPercent: $("." + obj).find('.ffPercent').eq(i).val(),
                        isHandOver: i
                    }

            }


            $scope.nodeJson = nodeJson;

            for (var j = 0; j < $scope.nodeJson.length; j++) {
                ffPercentNum = $scope.nodeJson[j].commsionPercent;
                ffPercentNum = parseInt(ffPercentNum, 10);
                sum += ffPercentNum;
            }
            if (sum !== 100) {
                alert("提交失败，发放比例之和必须等于100%！",function(){
                    $('.saveDisabled').removeAttr('disabled');
                });
                $(item.target).parent().find('.red').removeClass('disnone')

                return;
            }


            //var  strjson=JSON.stringify($scope.nodeJson);
            //var  strjson=$scope.nodeJson;
            //alert( strjson );
            server.server().ctommissionrulesSave({
                projectId: $scope.projectId,
                createUser: createUser,
                allProcess: $scope.process,
                allProcess2: $scope.process2,
                standard: $scope.standard,
                nodeJson: JSON.stringify($scope.nodeJson)
            }, function (data) {
                if (data.result) {
                    alert(data.message, function () {
                        $('.addqyyjRules').hide();
                        $('.saveDisabled').removeAttr('disabled');
                        window.location.reload();
                        $scope.$apply();
                    })
                } else {
                    alert(data.message,function(){
                        $('.saveDisabled').removeAttr('disabled');
                    })
                }


            })
        }
        //查处违建佣金规则 点击查看
        $scope.wjyjCheck = function (item) {
            $scope.useid = item.id;

            // 查看查处违建佣金规则
            server.server().ctcheckillegalcommission({
                id: $scope.useid
            }, function (data) {
                $scope.checkwjyj = data.data;

                $scope.$apply();//如果数据无法正常出来则调用该方法
            })

        }
        $scope.addwjyjgz = function () {
        }
        //查处违建佣金规则 点击编辑
        $scope.wjyjEdit = function (item, obj) {
            $('.' + obj).dialog();
            $scope.useid = item.id;
            $scope.projectId = item.projectId;

            server.server().ctcheckillegalcommission({
                id: $scope.useid
            }, function (data) {
                $scope.checkwjyj = data.data;
                $scope.$apply();//如果数据无法正常出来则调用该方法
                //查处违建佣金规则 点击编辑保存

                $scope.saveeditor = function () {
                    console.log($scope.checkwjyj.issuingNode, $scope.checkwjyj.commission, $scope.checkwjyj.remarks)
                    server.server().updateSave({
                        id: $scope.useid,
                        projectId: $scope.projectId,
                        issuingNode: $scope.checkwjyj.issuingNode,
                        commission: $scope.checkwjyj.commission,
                        remarks: $scope.checkwjyj.remarks,
                        updateUser: createUser
                    }, function (data) {
                        alert(data.message);
                        ctRule();
                        $scope.$apply();

                    })
                }
            }, function () {
                alert(data.message);
            })
        }

        //查处违建佣金规则 点击删除item
        $scope.wjyjDel = function (item) {
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            confirm('你确定要删除?', function () {
                server.server().deleteById({
                    id: $scope.useid,
                    userId: createUser
                }, function (data) {
                    alert(data.message, function () {
                        ctRule();
                        $scope.$apply();
                    });

                })
            })
        }
        /*添加规则--违建佣金规则添加*/
        $scope.saveCCWZ = function () {
            $('.saveDisabled').attr('disabled','disabled');
            if (+$scope.wzCommission <= 0) {
                alert('佣金不能为负数');
                $('.saveDisabled').removeAttr('disabled');
                return;
            }
            if (!$scope.wzIssuingNode) {
                $('.t5').removeClass('disnone')
                $('.saveDisabled').removeAttr('disabled');
                return;
            }
            if (!$scope.wzCommission) {
                $('.t6').removeClass('disnone')
                $('.saveDisabled').removeAttr('disabled');
                return;
            }
            server.server().ctaddillegalcommission({
                projectId: $scope.projectId,
                issuingNode: $scope.wzIssuingNode,
                commission: $scope.wzCommission,
                remarks: $scope.wzRemarks,
                createUser: createUser
            }, function (data) {
                if(data.result==true){
                    $scope.weijian = data;
                    alert(data.message, function () {
                        ctRule();
                        $('.addccwzRules').hide();
                        $scope.wzIssuingNode='';
                        $scope.wzCommission='';
                        $scope.wzRemarks='';
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    })
                }else{
                    alert(data.message, function () {
                        ctRule();
                        $('.addccwzRules').hide();
                        $scope.wzIssuingNode='';
                        $scope.wzCommission='';
                        $scope.wzRemarks='';
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    })
                }

                //如果数据无法正常出来则调用该方法
            },function(data){
                alert(data.message, function () {
                    ctRule();
                    $('.addccwzRules').hide();
                    $scope.wzIssuingNode='';
                    $scope.wzCommission='';
                    $scope.wzRemarks='';
                    $('.saveDisabled').removeAttr('disabled');
                    $scope.$apply();
                })
            })
        }
    }])
    /*佣金规则(新建项目)*/
    .controller('commissionRulesCtrl', ['$http', '$scope', 'server', function ($http, $scope, server) {

        var createUser = server.server().userId;
        // 违建佣金规则查询列表
        server.server().ctillegalcommissionrule({
            projectId: $scope.projectId
        }, function (data) {
            //console.log(data)


            $scope.weijian = data.data;
            console.log($scope.weijian);
            $scope.$apply();//如果数据无法正常出来则调用该方法
        }, function () {

        })


        // 综合业务佣金规则查询列表
        server.server().ctintegratedservices({
            projectId: $scope.projectId
        }, function (data) {

            $scope.yewu = data.data;
            $scope.yewu.forEach(function (item, index) {
                $scope.yewu[index].types = $scope.yewu[index].type == 1 ? '签约节点' : '测绘数据';
            })

            $scope.$apply();//如果数据无法正常出来则调用该方法
        }, function () {

        })
        //查看综合业务佣金规则查询列表
        $scope.serviceslook = function (item, obj) {
            $('.' + obj).dialog();

            $scope.id = item.id;
            server.server().servicedupdate({
                id: $scope.id
            }, function (data) {
                var typenume = data.data.synthesize.type;
                $scope.stage = data.data.sign.stage;
                $scope.sublevelStage = data.data.sign.sublevelStage;
                $scope.surveyList = data.data.survey.surveyList;
                $scope.typeList = data.data.survey.typeList;
                if (typenume == 1) {
                    $scope.isflag1 = true;
                    $scope.isflag2 = false

                } else {
                    $scope.isflag1 = false;
                    $scope.isflag2 = true;
                }
                // 查看查处违建佣金规则
                server.server().servicefindbyid({
                    id: $scope.id,
                    type: typenume
                }, function (data) {

                    $scope.services = data.data;
                    //   $scope.services.sublevesel=data.data.paymentstandardTwo;
                    $scope.$apply();//如果数据无法正常出来则调用该方法
                })
            })

        }

        // 编辑综合业务佣金规则查询列表
        $scope.serviceseditor = function (item, obj) {
            $('.' + obj).dialog();

            $scope.id = item.id;
            //

            server.server().servicedupdate({
                id: $scope.id
            }, function (data) {

                $scope.services = data.data.synthesize;
                $scope.stage = data.data.sign.stage;
                $scope.sublevelStage = data.data.sign.sublevelStage;
                $scope.surveyList = data.data.survey.surveyList;
                $scope.typeList = data.data.survey.typeList;
                $scope.projectId = data.data.synthesize.projectId;
                $scope.$apply();//如果数据无法正常出来则调用该方法
                $scope.saveservices = function () {
                    if ($scope.isflag1) {
                        var typenum = 0;
                        var one = $scope.stagesel,
                            two = $scope.sublevesel;
                    } else {
                        var typenum = 1;
                        var one = $scope.surveyesel,
                            two = $scope.compensel;
                    }

                    server.server().servicesavedata({
                        id: $scope.id,
                        projectId: $scope.projectId,
                        updateUser: createUser,
                        integratedName: $scope.services.integratedName,
                        paymentStandardOne: one,
                        paymentStandardTwo: two,
                        type: typenum,
                        commission: $scope.services.commission,
                        unit: '1',
                        remarks: $scope.services.remarks
                    }, function (data) {
                        alert(data.message, function () {
                            location.reload();
                            $scope.$apply();
                        });

                    })
                }
            }, function () {

            })
        }
        // 删除综合业务佣金规则查询列表
        $scope.servicesdel = function (item) {
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            confirm('你确定要删除?', function () {
                server.server().servicedeldata({
                    id: $scope.useid,
                    userId: createUser
                }, function (data) {
                    alert(data.message);
                    location.reload();
                    $scope.$apply();
                })
            })
        }
        $scope.isflag1 = true;
        $scope.changeColor = function () {
            if ($scope.typeValue == "签约节点") {
                $scope.isflag1 = true;
                $scope.isflag2 = false
            } else {
                $scope.isflag1 = false;
                $scope.isflag2 = true
            }
        }


        /*添加规则--综合业务佣金规则添加*/
        $scope.checktab = function (item,flag) {
            if(flag==0){//签约事件请求
                $scope.twosel='';
                $scope.threesel=''
            }else if (flag==1){//测绘请求
                $scope.ruletabsel='';
                $scope.onesel='';
            }
            //二级列表请求
            server.server().servisign({
                parentId: item
            }, function (data) {
                $scope.singe = data.data;
            })
        }
        server.server().serviceinitAdd({}, function (data) {
            $scope.stage = data.data.sign;
            $scope.surveyList = data.data.survey.surveyList;
            $scope.typeList = data.data.survey.typeList;
            $scope.saveZHYW = function () {
                $('.saveDisabled').attr('disabled','disabled');
                if (!$scope.zhIntegratedName) {
                    $('.t8').removeClass('disnone');
                    return;
                }

                if ($scope.isflag1) {
                    var typenum = 0;
                    var one = $scope.ruletabsel;
                    two = $scope.onesel;

                } else {
                    var typenum = 1;
                    var one = $scope.twosel,
                        two = $scope.threesel;
                }

                server.server().ctintegratedaddsave({
                    projectId: $scope.projectId,
                    createUser: createUser,
                    integratedName: $scope.zhIntegratedName,
                    paymentStandardOne: one,
                    paymentStandardTwo: two?two:'',
                    type: typenum,
                    commission: $scope.zhCommission,
                    unit: 2,
                    remarks: $scope.zhRemarks
                }, function (data) {
                    alert(data.message, function () {
                        $('.saveDisabled').removeAttr('disabled');
                        location.reload();
                        $scope.$apply();
                    })

                }, function (data) {
                    // alert(data.message)
                })
            }
        });


        // 签约佣金规则列表
        server.server().ctommissionrules({
            projectId: $scope.projectId,
        }, function (data) {


            $scope.rulesdata = data.data;

        })
            //查看签约佣金
        $scope.rulelook=function(item, obj){
            $('.' + obj).dialog();
            var nodejsonsrt = [];
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            server.server().ruleinitupdata({
                id: $scope.useid
            }, function (data) {
                $scope.ruleditor = data.data;
                $scope.$apply();
            })
        }
        //编辑签约佣金
        $scope.ruleedit = function (item, obj) {
            $('.' + obj).dialog();
            var nodejsonsrt = [];
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            server.server().ruleinitupdata({
                id: $scope.useid
            }, function (data) {
                $scope.ruleditor = data.data;
                $scope.$apply();

                $scope.saveeditorule = function () {
                    $('.saveDisabled').attr('disabled','disabled');
                    if (!$scope.ruleditor.allProcess) {
                        $('.t3').removeClass('disnone');
                        return;
                    }
                    if (!$scope.ruleditor.allProcess2) {
                        $('.t3').removeClass('disnone');
                        return;
                    }
                    if (!$scope.ruleditor.standard) {
                        $('.t4').removeClass('disnone');
                        return;
                    }
                    var sum = 0, ffPercentNum = 0;
                    for (var i = 0; i < $scope.ruleditor.detailsList.length; i++) {
                        nodejsonsrt[i] = {
                            id: $scope.ruleditor.detailsList[i].id,
                            rank: i + 1,
                            ruleNodes: $scope.ruleditor.detailsList[i].ruleNodes,
                            commsionPercent: $scope.ruleditor.detailsList[i].commsionPercent,
                            isHandOver: i
                        }
                        ffPercentNum = $scope.ruleditor.detailsList[i].commsionPercent;
                        ffPercentNum = parseInt(ffPercentNum);
                        sum += ffPercentNum;
                    }
                    var nodetype = JSON.stringify(nodejsonsrt);


                    if (sum !== 100) {
                        alert("提交失败，发放比例之和必须等于100%！");
                        return;
                    }

                    server.server().ruleupdateSave({
                        projectId: $scope.projectId,
                        id: $scope.useid,
                        updateUser: createUser,
                        allProcess: $scope.ruleditor.allProcess,
                        allProcess2: $scope.ruleditor.allProcess2,
                        standard: $scope.ruleditor.standard,
                        nodeJson: nodetype
                    }, function (data) {
                        alert(data.message, function () {
                            $('.saveDisabled').removeAttr('disabled');
                            location.reload()
                        });


                        $scope.$apply();
                    })
                }
                $scope.$apply();//如果数据无法正常出来则调用该方法
            }, function () {

            })

        }
        //5、删除提交审核
        $scope.ruledel = function (item) {
            $scope.id = item.id;

            confirm('你确定要删除?', function () {
                server.server().ruledeleteSave({
                    id: $scope.id,
                    userId: createUser
                }, function (data) {
                    alert(data.message, function () {
                        location.reload();
                    });

                    $scope.$apply();
                })
            })
        }
        var htm = "<tr>\n" +
            "<th width=\"15%\" class=\"pl30 maincolor\">发放节点：</th>\n" +
            "<td >\n" +
            "<input type=\"text\"  value=\"\" class=\"c-yjgzinpc c-bordere6 mt10 left ffNodes\">\n" +
            "<span class=\"ml50 mr10 maincolor left\">发放比例：</span>\n" +
            "<input type=\"text\"   class=\"c-yjgzinpc c-bordere6 mr5 mt10 left ffPercent\">%\n" +
            "</td>\n" +
            "</tr>";
        var trleng;
        $scope.addffjd = function (obj) {

            trleng = $("." + obj).find("tr").length;

            if (trleng < 5) {
                $("." + obj).append(htm);
            }
            $scope.$apply();
        }

        $scope.delffjd = function (obj) {
            trleng = $("." + obj).find("tr").length;
            if (trleng > 3) {
                $("." + obj).find("tr:last-child").remove();
            }
            $scope.$apply();
        }
        //判断非空
        var ifalse = true;
        $scope.inputips = function (item) {
            if ($(item.target).val() == '') {
                ifalse = false;
                $(item.target).parent().find('.red').removeClass('disnone')

            } else {
                ifalse = true;
                $(item.target).parent().find('.red').addClass('disnone')
            }

        }

        //添加签约佣金规则 点击保存
        $scope.saveYJGZ = function (obj) {

            if (!$scope.process2) {
                $('.t1').removeClass('disnone');
                ifalse = false
            }
            if (!$scope.standard) {
                $('.t2').removeClass('disnone');
                ifalse = false;
            }
            if (!$scope.standard) {
                $('.t2').removeClass('disnone');
                ifalse = false;
            }

            if (!ifalse) {
                return;
            }
            var nodeJson = [];
            var dtr = $("." + obj).find("tr");
            var ffPercentNum, sum = 0;

            // var trleng=dtr.length;

            for (var i = 0; i < 4; i++) {
                var rulenode = $("." + obj).find('.ffNodes').eq(i).val();
                console.log(rulenode)
                nodeJson[i] =
                    {

                        rank: i + 1,
                        ruleNodes: rulenode,
                        commsionPercent: $("." + obj).find('.ffPercent').eq(i).val(),
                        isHandOver: i
                    }

            }

            $scope.nodeJson = nodeJson;

            for (var j = 0; j < $scope.nodeJson.length; j++) {
                ffPercentNum = $scope.nodeJson[j].commsionPercent;
                ffPercentNum = parseInt(ffPercentNum);
                sum += ffPercentNum;
            }
            if (sum !== 100) {
                alert("提交失败，发放比例之和必须等于100%！");
                return;
            }


            //var  strjson=JSON.stringify($scope.nodeJson);
            //var  strjson=$scope.nodeJson;
            //alert( strjson );
            server.server().ctommissionrulesSave({
                projectId: $scope.projectId,
                createUser: createUser,
                allProcess: $scope.process,
                allProcess2: $scope.process2,
                standard: $scope.standard,
                nodeJson: JSON.stringify($scope.nodeJson)
            }, function (data) {
                alert(data.message, function () {
                    location.reload();
                    $scope.$apply();
                })

            })
        }
        //编辑签约佣金规则
        //查处违建佣金规则 点击查看
        $scope.wjyjCheck = function (item) {
            $scope.useid = item.id;

            // 查看查处违建佣金规则
            server.server().ctcheckillegalcommission({
                id: $scope.useid
            }, function (data) {
                $scope.checkwjyj = data.data;

                $scope.$apply();//如果数据无法正常出来则调用该方法
            })

        }
        $scope.addwjyjgz = function () {

        }
        //查处违建佣金规则 点击编辑
        $scope.wjyjEdit = function (item, obj) {
            $('.' + obj).dialog();
            $scope.useid = item.id;
            $scope.projectId = item.projectId;

            server.server().ctcheckillegalcommission({
                id: $scope.useid
            }, function (data) {
                $scope.checkwjyj = data.data;
                $scope.$apply();//如果数据无法正常出来则调用该方法
                //查处违建佣金规则 点击编辑保存

                $scope.saveeditor = function () {
                    console.log($scope.checkwjyj.issuingNode, $scope.checkwjyj.commission, $scope.checkwjyj.remarks)
                    server.server().updateSave({
                        id: $scope.useid,
                        projectId: $scope.projectId,
                        issuingNode: $scope.checkwjyj.issuingNode,
                        commission: $scope.checkwjyj.commission,
                        remarks: $scope.checkwjyj.remarks,
                        updateUser: createUser
                    }, function (data) {
                        alert(data.message);
                        location.reload();
                        $scope.$apply();

                    })
                }
            }, function () {

            })
        }

        //查处违建佣金规则 点击删除item
        $scope.wjyjDel = function (item) {
            $scope.useid = item.id;
            $scope.projectId = item.projectId;
            confirm('你确定要删除?', function () {
                server.server().deleteById({
                    id: $scope.useid,
                    userId: createUser
                }, function (data) {
                    alert(data.message, function () {
                        location.reload();
                        $scope.$apply();
                    });

                })
            })
        }
        /*添加规则--违建佣金规则添加*/
        $scope.saveCCWZ = function () {
            $('.saveDisabled').attr('disabled','disabled');
            if (!$scope.wzIssuingNode) {
                $('.t5').removeClass('disnone')
                return;
            }
            if (!$scope.wzCommission) {
                $('.t6').removeClass('disnone')
                return;
            }
            if (!$scope.wzRemarks) {
                $('.t7').removeClass('disnone')
                return;
            }
            server.server().ctaddillegalcommission({
                projectId: $scope.projectId,
                issuingNode: $scope.wzIssuingNode,
                commission: $scope.wzCommission,
                remarks: $scope.wzRemarks,
                createUser: createUser
            }, function (data) {

                $scope.weijian = data;
                alert(data.message, function () {
                    $('.saveDisabled').removeAttr('disabled');
                    location.reload();
                    $scope.$apply();
                })
                //如果数据无法正常出来则调用该方法
            })
        }

    }]);


