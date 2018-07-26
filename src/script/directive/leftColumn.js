'use strict';
angular.module('app').directive('appLeftColumn', ['cache','server','$state', function (cache,server,$state) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'view/template/public/leftColumn.html',
        scope:{
            data:'='
        },
        link:function($scope){
            var storage=window.localStorage;
            server.server().zjprojectprojectListdo({},function(data){
                if(data.result===true){
                    if(data.data && data.data.length>0){
                        $scope.leftdata = data.data;
                        // storage.clear();//在赋值前先清除所有storage的缓存值
                        if(!storage.getItem("a")){
                            storage.setItem("a",$scope.leftdata[0].id);
                        }
                    }

                    $scope.$apply();
                }else{
                    alert(data.message)
                }
            })
        }
    };
}])

//左侧有值跳转
.directive('appLeft', ['cache','$http','server','$cookieStore','$state', function(cache,$http,server,$cookieStore,$state){
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'view/template/public/left.html',
        scope:{
            data:'='
        },
        link:function($scope){
            var storage=window.localStorage;
            server.server().zjprojectprojectListdo({},function(data){
                if(data.result===true){
                    $scope.leftdata = data.data;
                    if(!storage.getItem("a")){
                        storage.setItem("a",$scope.leftdata[0].id);
                    }
                    $scope.$apply();

                }else{
                    alert(data.message)
                }
            },function(err){

            })
            $scope.leftClick=function(id){
                storage.setItem("a",id);
                if(storage.getItem("f")){
                    $state.go(storage.getItem("f"),{projectid:id})
                }else if(storage.getItem("j")){
                    $state.go(storage.getItem("j"),{projectid:id})
                } else{
                    $state.go(storage.getItem("b"),{projectid:id})
                } 
            }
        }
    };
}])
// 系统设置
    .directive('leftSystem', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/leftSystem.html',
            scope:{
                data:'='
            },
            link:function($scope){

                var storage=window.localStorage;
                server.server().zjprojectprojectListdo({},function(data){
                    if(data.result===true){
                        $scope.leftdata = data.data;
                        if(!storage.getItem("a")){
                            storage.setItem("a",$scope.leftdata[0].id);
                        }
                        $scope.$apply();
                    }else{
                        alert(data.message)
                    }
                })
            }
        };
    }])
    // 关注
    .directive('attention', ['server',function (server) {
        return {
            restrict: 'E',
            templateUrl: 'view/template/public/attention.html',
            replace: true,
            scope:{
                params:'@list'
            },
            link:function($scope){
                $scope.params = JSON.parse($scope.params)
                $scope.useparams = $scope.params
                //false 未关注  true已关注
                $scope.acctionName = false;
                //是否关注查询
                let promisef=function(back,flag){

                        server.server().zjsharedtransferconqueryFollowdo({
                            dataId:	$scope.useparams.projectId,        //项目id或者物业id
                            userId:	$scope.useparams.createUser        //当前登入的用户id
                        },function(data){
                            if(data.result) {
                                $scope.statusId = data.data.id;
                                data.data.status == '1'
                                    ? $scope.acctionName = true
                                    : $scope.acctionName = false
                                $scope.$apply();
                                if(flag){
                                    back(data.data.id)
                                }
                            }
                        })

                }
                promisef()

                //取消关注
                $scope.acctionClick=function(statusId){
                    promisef()
                    if($scope.acctionName===true){
                            server.server().zjsharedtransfercondestroydo({
                                id:statusId
                            },function(data){
                                if(data.result){
                                    $scope.acctionName = false
                                }else{
                                    $scope.acctionName = true;
                                }
                                $scope.$apply();
                            })

                    }else{
                        server.server().lgcMainInfosharedtransferconSave(JSON.parse($scope.params),function(data){
                            if(data.result){
                                $scope.acctionName = true
                            }else{
                                $scope.acctionName = false;
                            }
                            $scope.$apply();
                        })
                    }
                }

            }
        };
    }])
    // top详细项目信息
    .directive('topInformation', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/topInformation.html',
            scope:{
                params:'@listtop'
            },
            link:function($scope){
                $scope.params = JSON.parse($scope.params)
                server.server().zjprojectdeleteById({
                    id: $scope.params.projectId,
                    userId: $scope.params.createUser
                }, function (data) {
                    if (data.result === true) {
                        $scope.project2 = data.data.project;
                        $scope.$apply();
                    }
                })
            }
        };
    }])
    // top详细物业信息
    .directive('topPactInformation', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/topPactInformation.html',
            scope:{
                params:'@list',
                pacts: "="
            },
            link:function($scope){

                var datas= {
                    id: "0042bff0b06b42d8bdf10f1311b0e2cd",  //物业id
                    createTime: 1516007392000, //创建时间
                    status: 2,  //制作合同状态   null   2显示    0  1  3 是隐藏按钮
                    updateTime: null,   //更新时间
                    address: "东八巷4号",  //地址
                    realname: "周炳辉", //创建人
                    code: null,  //地址
                    splitJointName: "风门坳" //地址
                }
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params)
                server.server().zjroomqueryPropertyDetaileddo({
                    roomId:$scope.params.roomId
                }, function (data) {
                    if (data.result === true) {
                        $scope.patcData =data.data;
                        $scope.statusId = $scope.patcData.id;
                        $scope.pacts = $scope.patcData.status;
                        console.log($scope.pacts)
                        //申请同 //0未审核 1审核通过 2审核通过3审核中',
                        if($scope.patcData.status=='2'||$scope.patcData.status===null){
                            $scope.Pact = true;
                        }else{
                            $scope.Pact = false;
                        }
                    }
                    $scope.$apply();
                })
                //关注
                $scope.useparams = $scope.params
                //false 未关注  true已关注
                $scope.acctionName = false;
                //是否关注查询
                let promisef=function(back,flag){

                        server.server().zjsharedtransferconqueryFollowdo({
                            dataId:	$scope.useparams.projectId,        //项目id或者物业id
                            userId:	$scope.useparams.createUser        //当前登入的用户id
                        },function(data){
                            if(data.result) {
                               
                                data.data.status == '1'
                                    ? $scope.acctionName = true
                                    : $scope.acctionName = false
                                $scope.$apply();
                                if(flag){
                                    back(data.data.id)
                                }
                            }
                        })

                }
                promisef()

                //取消关注
                $scope.acctionClick=function(statusId){
                    promisef()
                    if($scope.acctionName===true){
                            server.server().zjsharedtransfercondestroydo({
                                id:statusId
                            },function(data){
                                if(data.result){
                                    $scope.acctionName = false
                                }else{
                                    $scope.acctionName = true;
                                }
                                $scope.$apply();
                            })

                    }else{
                        server.server().lgcMainInfosharedtransferconSave(JSON.parse($scope.params),function(data){
                            if(data.result){
                                $scope.acctionName = true
                            }else{
                                $scope.acctionName = false;
                            }
                            $scope.$apply();
                        })
                    }
                }

                
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.createUser = $scope.useparams.createUser;
                $scope.roomId = $scope.useparams.roomId;
                $scope.firstParentState = true;
                //申请制制作合同
                $scope.doApplyPact = function () {
                    confirm("申请制作合同", function () {
                        if($scope.firstParentState){
                            applypactajax()
                        }
                        
                    })
                }

                function applypactajax(){
                    $scope.firstParentState = false;
                    server.server().zjpactinfoaddSavedo({
                        propertyId: $scope.roomId,
                        createUser: $scope.createUser
                    }, function (data) {
                        if (data.result === true) {
                            $scope.Pact = false;
                            alert(data.message);
                        } else {
                            $scope.Pact = true;
                            $scope.firstParentState = true;
                            alert(data.message);
                        }
                        $scope.$apply();
                    });
                }

            }
        };
    }])

    // right时间详细信息
    .directive('rightInformation', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/rightInformation.html',
            scope:{
                params:'@listtop'
            },
            link:function($scope){

                $scope.params = JSON.parse($scope.params)
                server.server().zjprojectdeleteById({
                    id: $scope.params.projectId,
                    userId: $scope.params.createUser
                }, function (data) {
                    if (data.result === true) {
                        $scope.project2 = data.data.project;
                        $scope.$apply();
                    }
                })
            }
        };
    }])
    //右侧周日丙浑时间信息
    .directive('rightInformationTwo', ['cache', 'server',function (cache,server) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'view/template/public/rightInformationTwo.html',
        scope:{
            params:'@listtop'
        },
        link:function($scope){
            $scope.params = JSON.parse($scope.params);
            $scope.useparams = $scope.params;
            server.server().zjroomessentialInformationdo({
                roomId:$scope.useparams.roomId
            },data=>{
                if(data.result===true){
                    $scope.room=data.data.room;
                    $scope.$apply();
                }
            })
        }
    };
}])
    // 物业信息详情
    .directive('roomInformation', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/roomInformation.html',
            scope:{
                params:'@listtop'
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params)
                server.server().basicInformation({
                    roomId: $scope.params.roomId
                }, function (data) {
                    if (data.result === true) {
                        $scope.informations = data.data.surveyCount; //信息
                        $scope.attachment = data.data.attachment; //签约进度
                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                });
            }
        };
    }])
    // 物业签约进度
    .directive('roomAttachment', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/roomAttachment.html',
            scope:{
                params:'@listtop'
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params)
                server.server().surveyingList({
                    roomId: $scope.params.roomId,
                    type: 2
                }, data=> {
                    if (data.result === true) {
                        $scope.surveyingList = data.data;
                        $scope.$apply();
                    } else {
                        alert(data.message)
                    }
                });
            }
        };
    }])
    // 物业附件
    .directive('roomSurveying', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/roomSurveying.html',
            scope:{
                params:'@listtop',
                length:'='
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params);
                $scope.imgHost = $scope.params.imgHost;
                server.server().basicInformation({
                    roomId: $scope.params.roomId
                }, function (data) {
                    if (data.result === true) {
                        $scope.informations = data.data.surveyCount; //信息
                        $scope.attachment = data.data.attachment; //签约进度
                        $scope.length = $scope.attachment.length||0;
                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                });
            }
        };
    }])
    // 添加 产品 跟进信息和展示删除  物业的
    .directive('addFollow', ['cache', 'server','dict','$http','$rootScope',function (cache,server,dict,$http,$rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/addFollow.html',
            scope:{
                params:'@listtop',
                length:'='
            },
            link:function($scope){
                $scope.no = '/';
                $scope.localhostimg = $rootScope.localhostimg;
                $scope.params = JSON.parse($scope.params);
                $scope.useparams = $scope.params
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.projectflag = $scope.useparams.projectflag;
                $scope.headImg = server.server().headImg;
                var usetime=function(UNIX){
                    var a = new Date(UNIX);
                    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
                    var year = a.getFullYear();
                    var month = months[a.getMonth()];
                    var date = a.getDate()<10?'0'+a.getDate():a.getDate();
                    var hour = a.getHours()<10?'0'+a.getHours():a.getHours();
                    var min = a.getMinutes()<10?'0'+a.getMinutes():a.getMinutes();
                    var time = year + month +  date + hour +  min;
                    return time;
                }
                //项目列表展示（查询）
                function zjfollowuplistdo(){
                    server.server().zjfollowuplistdo({
                        projectId:$scope.projectflag=='1'?$scope.useparams.projectId:$scope.useparams.roomId,
                        type:$scope.projectflag
                    },function(data){
                        if(data.result===true){
                            //判断ajax里面的值是否存在（避免报错
                            if(data.data.length>0){
                                // 拿到ajax返回的数据（页面展示ng-repeat）
                                $scope.showMes=data.data;
                                //时间排序
                                $scope.showMes.sort(function(p1, p2) {
                                    return new Date(p2.createTime).getTime() - new Date(p1.createTime).getTime();
                                });
                                //把时间戳转成时间 2017/10/10/12:00
                                for(var i = 0;i<data.data.length;i++){
                                    if(usetime(new Date().getTime())-usetime(data.data[i].createTime)<=1){
                                        data.data[i].createTime='刚刚'
                                    }else
                                    if(usetime(new Date().getTime())-usetime(data.data[i].createTime)<=2){
                                        data.data[i].createTime='2分钟前'
                                    }else
                                    if(usetime(new Date().getTime())-usetime(data.data[i].createTime)<=3){
                                        data.data[i].createTime='3分钟前'
                                    }else{
                                        data.data[i].createTime =dict.timeConverter(data.data[i].createTime);
                                    }
                                }
                                $scope.$apply();
                            }
                        }else{alert(data.message)
                        }
                    },function(err){alert(err)
                    })
                }
                zjfollowuplistdo()

                //图片上传
                // /上传添加文件数组返回src
                $scope.fileArr = []
                $scope.fileNameChanged = function(e){
                    var fd = new FormData();
                    var eve = e.target;
                    if (eve.files[0]) {
                        var file = eve.files[0];
                        var ext = file.name.slice(file.name.lastIndexOf(".") + 1).toUpperCase();
                        if ( ext == "PNG" ||  ext == "JPEG" ||ext == "JPG") {
                            fd.append('multipartFile', file);
                            $http({
                                method: 'POST',
                                url: $scope.imgHost + "attachment/fielUpload.do",
                                data: fd,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }).then(function successCallback(data) {
                                eve.value = '';
                                if (data.data.result) {
                                    $scope.fileArr.push(data.data.data);
                                } else {
                                    alert(data.message)
                                }
                            })
                            $scope.$apply()
                        }else{
                            eve.value = '';
                            alert("请上传正确格式的图片");
                            return false;
                        }
                    }

                }
                //input上传文件删除
                $scope.fileArrDel=function(ind){
                    $scope.fileArr.splice(ind,1);
                }


                //项目管理发布
                $scope.issue=function(val){
                    if(!val){alert('描述不能为空！');return;}
                    $scope.attachments=[];
                    if($scope.fileArr){
                        $scope.fileArr.forEach((item,i)=>{
                            $scope.attachments[i]={
                                filePath:$scope.fileArr[i].filePath,
                                fileName:$scope.fileArr[i].fileName,
                                size:$scope.fileArr[i].size
                            }
                        })
                    }
                    server.server().zjfollowupaddSavedo({
                        type: $scope.projectflag,          //	跟进类型	是	1项目  2物业
                        dataId:$scope.projectflag=='1'?$scope.useparams.projectId:$scope.useparams.roomId,       //	项目  或者 物业id	是
                        depict:val?val:'',         //	描述	是
                        createUser:$scope.useparams.createUser,        //	用户id	是
                        attachment:JSON.stringify($scope.attachments)||""
                    },function(data){
                        if(data.result===true){
                            alert('发布成功！');
                            $scope.textareaVal='';
                            $scope.fileArr = [];
                            $scope.$apply();
                            zjfollowuplistdo();
                        }else{
                            alert(data.message)
                        }
                    },function(err){
                        alert(err)
                    })

                }


                //删除
                $scope.delete=function(id,indx){
                    server.server().zjfollowupdeleteByIddo({
                        id:id
                    },function(data){
                        if(data.result===true){
                            confirm('确认删除这条信息吗？',function(){
                                $scope.showMes.splice(indx,1);
                                $scope.$apply();
                            })
                        }else{
                            alert(data.message)
                        }
                    },function(err){
                        alert(err)
                    })
                }

            }
        };
    }])
    // 添加 产品 跟进信息和跳转回调 alert  项目的
    .directive('addFollowAlert', ['cache', 'server','dict','$http','$rootScope',function (cache,server,dict,$http,$rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/addFollowAlert.html',
            scope:{
                params:'@listtop',
                length:'=',
                action:'=',
                myFollow: "&",
                myLocation: "&"
            },
            link:function($scope){
            // <span class="fs12 tr disblock mr20" style="margin-top:-14px;">最多输入256个字符</span>
                $scope.localhostimg = $rootScope.localhostimg;
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params);
                $scope.useparams = $scope.params
                $scope.imgHost = $scope.params.imgHost;
                $scope.projectflag = $scope.useparams.projectflag;
                if($scope.projectflag=='1'){
                    $scope.projectName = '项目';
                    $scope.projectId = $scope.useparams.projectId;
                }else{
                    $scope.projectName = '产品';
                    $scope.roomId = $scope.useparams.roomId;
                }

                $scope.action.reset = function (roomId,type) {
                    $scope.genjingId = roomId;
                    $scope.genjingtype = type
                    $('.hopbntfollow').dialog();
                }


                // /图片上传
                // /上传添加文件数组返回src
                $scope.fileArr = []
                $scope.fileNameChanged = function(e){
                    var fd = new FormData();
                    var eve = e.target;
                    if (eve.files[0]) {
                        var file = eve.files[0];
                        var ext = file.name.slice(file.name.lastIndexOf(".") + 1).toUpperCase();
                        if ( ext == "PNG" ||  ext == "JPEG" ||ext == "JPG") {
                            fd.append('multipartFile', file);
                            $http({
                                method: 'POST',
                                url: $scope.imgHost + "attachment/fielUpload.do",
                                data: fd,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }).then(function successCallback(data) {
                                eve.value = '';
                                if (data.data.result) {
                                    $scope.fileArr.push(data.data.data);
                                } else {
                                    alert(data.message)
                                }
                            })
                            console.log($scope.fileArr)
                            $scope.$apply()
                        }else{
                            eve.value = '';
                            alert("请上传正确格式的图片");
                            return false;
                        }
                    }

                }
                //input上传文件删除
                $scope.fileArrDel=function(ind){
                    $scope.fileArr.splice(ind,1);
                }


                //项目管理发布
                $scope.issue=function(genjingId,genjingtype){
                    if(!$scope.followinfo){alert('描述不能为空！');return;}
                    if(!genjingId){
                        genjingId = $scope.useparams.projectId
                    }else{
                        $scope.projectflag = 2;
                    }
                    if(genjingtype){
                        $scope.projectflag = 1;
                    }else{
                        $scope.projectflag = 2;
                    }
                    $scope.attachments=[];
                    if($scope.fileArr){
                        $scope.fileArr.forEach((item,i)=>{
                            $scope.attachments[i]={
                                filePath:$scope.fileArr[i].filePath,
                                fileName:$scope.fileArr[i].fileName,
                                size:$scope.fileArr[i].size
                            }
                        })
                    }
                    server.server().zjfollowupaddSavedo({
                        type: $scope.projectflag,          //	跟进类型	是	1项目  2物业
                        dataId:genjingId,       //	项目  或者 物业id	是
                        depict:$scope.followinfo||'',         //	描述	是
                        createUser:$scope.useparams.createUser,        //	用户id	是
                        attachment:JSON.stringify($scope.attachments)||""
                    },function(data){
                        if(data.result===true){
                            confirm('发布成功！',function(){
                                $('.hopbntfollow').fadeOut(200);
                                $scope.textareaVal='';
                                $scope.fileArr = [];
                                $scope.followinfo = '';
                                if($scope.useparams.locationflag=='1'){
                                    $scope.myLocation();
                                }
                                //刷新接口
                                if($scope.useparams.reloadajax=='1'){
                                    $scope.myFollow();
                                }

                                $scope.$apply();
                            });


                        }else{
                            alert(data.message)
                        }
                    },function(err){
                        alert(err)
                    })

                }

            }
        };
    }])
    // 业权人展示
    .directive('ownerShow', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/ownerShow.html',
            scope:{
                params:'@listtop',
                length:'='
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params);
                $scope.imgHost = $scope.params.imgHost;
                $scope.useparams = $scope.useparams
                $scope.projectId = $scope.params.projectId;
                $scope.roomId = $scope.params.roomId;
                //关系图谱数据

                $scope.uhshifts={
                    relationShip:'业权人',
                    relationPersion:''
                }

                server.server().zjownershipqueryOwnerAndRecievedo({
                    holderId: $scope.roomId
                }, function (data) {
                    if (data.result === true) {
                        if (data.data) {
                            $scope.data = data.data;
                            if ($scope.data) {
                                $scope.data.forEach(function (item, i) {
                                    $scope.data[i].isType = $scope.data[i].recieveType;
                                    switch ($scope.data[i].recieveType) {
                                        case 1:
                                            $scope.data[i].recieveType = '业权人收款';
                                            break;
                                        case 2:
                                            $scope.data[i].recieveType = '其他人代收款';
                                            break;
                                        case 3:
                                            $scope.data[i].recieveType = '未满18岁监护人待收款';
                                            break;
                                        case 4:
                                            $scope.data[i].recieveType = '关联其他业权人收款';
                                            break;
                                    }
                                })
                            }
                            for (var i = 0; i < data.data.length; i++) {
                                $scope.data[i].indx = i;
                            }
                            $scope.$apply();
                        }
                    } else {
                        alert(data.message)
                    }
                })

                //业权人关系图谱
                $scope.editInformation=function(id,indx){
                    $scope.usedata = [];
                    $scope.links=[];
                    server.server().zjownershipqueryOwnerRelationShipdo({
                        id:id
                    },function(data){
                        if(data.result===true){
                            $scope.relationdata=data.data;
                            $scope.relation=data.data.relation;
                            $scope.uhshifts.relationPersion=$scope.relationdata.holderName;

                            $scope.relation.unshift($scope.uhshifts)
                            for(var i = 0;i<$scope.relation.length;i++){
                                //多少位
                                $scope.usedata[i]={
                                    name:$scope.relation[i].relationPersion,
                                    category:i===0?0:1,
                                    draggable:true
                                };
                                //关系
                                $scope.links[i]={
                                    source:0,
                                    target:(i+1),
                                    category:0,
                                    value:$scope.relation[i].relationShip
                                }
                            }

                            echart($scope.usedata,$scope.links)
                        }else{
                            alert(data.message)
                        }
                    })
                }

                //联系人关系图谱
                $scope.makecoll=function(id,indx){
                    $scope.usedata = [];
                    $scope.links=[];
                    server.server().zjmakecollectionsqueryRelationShipdo({
                        id:id
                    },function(data){
                        if(data.result===true){
                            $scope.relationdata=data.data;
                            $scope.relation=data.data.relation;
                            $scope.uhshifts.relationPersion=$scope.relationdata.holderName;

                            $scope.relation.unshift($scope.uhshifts)
                            for(var i = 0;i<$scope.relation.length;i++){
                                //多少位
                                $scope.usedata[i]={
                                    name:$scope.relation[i].relationPersion,
                                    category:i===0?0:1,
                                    draggable:true
                                };
                                //关系
                                $scope.links[i]={
                                    source:0,
                                    target:(i+1),
                                    category:0,
                                    value:$scope.relation[i].relationShip
                                }
                            }

                            echart($scope.usedata,$scope.links)
                        }else{
                            alert(data.message)
                        }
                    })
                }



                var myChart = echarts.init(document.getElementById('main'));


                function echart(usedata,links){

                    var option = {
                        title: {
                            text: ''
                        },
                        tooltip: {},
                        animationDurationUpdate: 1500,
                        animationEasingUpdate: 'quinticInOut',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 12
                                },
                            }
                        },
                        legend: {
                            x: "center",
                            show: false,
                            data: [ "家人", "朋友",'亲戚']
                        },
                        series: [

                            {
                                type: 'graph',
                                layout: 'force',
                                symbolSize: 50,
                                focusNodeAdjacency: true,
                                roam: true,
                                categories: [{
                                    name: '家人',
                                    itemStyle: {
                                        normal: {
                                            color: "#009800",
                                        }
                                    }
                                }, {
                                    name: '朋友',
                                    itemStyle: {
                                        normal: {
                                            color: "#4592FF",
                                        }
                                    }
                                }, {
                                    name: '亲戚',
                                    itemStyle: {
                                        normal: {
                                            color: "#3592F",
                                        }
                                    }
                                }],
                                label: {
                                    normal: {
                                        show: true,
                                        textStyle: {
                                            fontSize: 14
                                        },
                                    }
                                },
                                force: {
                                    repulsion: 1000
                                },
                                edgeSymbolSize: [4, 50],
                                edgeLabel: {
                                    normal: {
                                        show: true,
                                        textStyle: {
                                            fontSize: 12
                                        },
                                        formatter: "{c}"
                                    }
                                },
                                data: usedata,
                                links: links,
                                lineStyle: {
                                    normal: {
                                        opacity: 0.9,
                                        width: 1,
                                        curveness: 0
                                    }
                                }
                            }
                        ]
                    };
                    myChart.setOption(option);

                }
            }
        };
    }])
    //补偿方案展示
    .directive('compensateShow', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/compensateShow.html',
            scope:{
                params:'@listtop',
                length:'='
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params);
                $scope.imgHost = $scope.params.imgHost;

                //获取查询补偿方案展示信息
                server.server().zjbuiltinfogetCompensatePlando({
                    propertyId:$scope.params.roomId
                },data=>{
                    data.result===true
                        ?data.data.length>0
                        ?(
                                $scope.topData = data.data,
                                $scope.$apply()
                        )
                        :alert(data.message)
                        :alert(data.message)
                })
            }
        };
    }])
    //附件
    .directive('enclosureShow', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/enclosureShow.html',
            scope:{
                params:'@listtop',
                length:'='
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params);
                $scope.imgHost = $scope.params.imgHost;
                $scope.useparams = $scope.params;
                //根据物业id查询相关附件（attachement）
                const type2 = function(){
                    let p = new Promise((resolve,reject)=>{
                        server.server().enclorurelist({
                            propertyId:$scope.useparams.roomId
                        },data=>{
                            data.result===true
                                ?(data.data
                                    ?(resolve(data.data),$scope.$apply())
                                    :alert(data.message)
                                )
                                :alert(data.message)
                        })
                    })
                    return p;
                }

                Promise
                    .all([type2()])
                    .then(data=>{
                        $scope.total = 0;
                        $scope.list = data[0];
                        $scope.list.forEach(function(item,i){
                            $scope.total+= $scope.list[i].propertyAttachments.length;
                        })
                        $scope.$apply();
                    },err=>{});

                //下载导入弹窗
                $scope.DownSave=function(schemId){
                    let useHost = server.server().host;
                    let host=useHost+'propertyAttachment/attachmentDownload.do';
                    $scope.link=host+'?id='+schemId;
                }

            }
        };
    }])
    // 测绘信息展示
    .directive('examineShow', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/examineShow.html',
            scope:{
                params:'@listtop'
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params)
                $scope.useparams = $scope.params;
                $scope.hostname = $scope.useparams.imgHost;
                //测绘信息
                server.server().surveyingInformationById({
                    roomId: $scope.useparams.roomId
                }, function (data) {
                    if (data.result === true) {
                        $scope.surveyInfo = data.data;
                        $scope.singleList = data.data.singleList;
                        $scope.surveyList = data.data.surveyList;
                        $scope.housesImg = data.data.housesImg;
                        $scope.$apply();
                    } else {
                        alert(data.message)
                    }
                });
            }
        };
    }])
    // 测绘信息中图片展示
    .directive('examineImgShow', ['cache', 'server',function (cache,server) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/examineImgShow.html',
            scope:{
                params:'@listtop'
            },
            link:function($scope){
                $scope.no = '/';
                $scope.params = JSON.parse($scope.params)
                $scope.useparams = $scope.params;
                $scope.hostname = $scope.params.imgHost;

                //测绘信息
                server.server().surveyingInformationById({
                    roomId: $scope.useparams.roomId
                }, function (data) {
                    if (data.result === true) {
                        $scope.housesImg = data.data.housesImg;
                        $scope.$apply();
                    } else {
                        alert(data.message)
                    }
                });
            }
        };
    }])
    // 跟踪跟踪 发布没有展示 alert
    .directive('follow', ['cache', 'server','$state','$http','$sce',function (cache,server,$state,$http,$sce) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/follow.html',
            scope:{
                params:'@listtop',
                action:'=',
                myFollow: "&",
                myLocation: "&"
            },
            controller:function($scope){

            },
            link:function($scope){
                $scope.no = '/';
                $scope.useparams = JSON.parse($scope.params);
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.flag = false;
                $scope.projectflag = $scope.useparams.projectflag;
                $scope.userId = server.server().userId;

                $scope.myMobFlag =$scope.useparams.myMobFlag

                // 
                $scope.add={
                    peopel:'',
                    peopelproject:''
                }
                $scope.addflag={
                    peopel:false,
                    peopelproject:false
                }


                // 我的工作的
                if($scope.myMobFlag){
                    // ======================================================
                // 模糊输入ajax
                function initAdddo (param){
                    $scope.dimArr=[];
                    var p = new Promise((resolve, reject) =>{
                        server.server().zjtaskqueryRoomNamedo2({
                            userId:$scope.userId,
                            param:param,
                            projectId:$scope.projectuserId
                        },data=>{
                            if(data.result){
                                $scope.dimArr = data.data;
                                resolve(data.data)
                                $scope.$apply();
                            }else{
                                alert(data.message)
                            }

                        })
                    })
                    return p;
                }
                //被指派的人
                function UserNamedo (param){
                    $scope.personarr=[];
                    var p = new Promise((resolve, reject) =>{
                        server.server().zjtaskqueryUserNamedo({
                            projectId:$scope.projectId,
                            realname:param
                        },data=>{
                            if(data.result){
                                $scope.personarr = data.data;
                                resolve(data.data)
                                $scope.$apply();
                            }else{
                                alert(data.message)
                            }

                        })
                    })
                    return p;
                }

                //获取焦点事件
                $scope.addfocus = function(val,flag){
                    !flag
                        ?(initAdddo(val).then(function(data){
                            data.length>0?$scope.dimArrFlag = true:$scope.dimArrFlag = false
                            $scope.addflag.peopel = false;
                            $scope.$apply();
                        }),
                        $scope.addflag.peopel = false)
                        :(UserNamedo(val).then(function(data){
                            data.length>0?$scope.personarrFlag = true:$scope.personarrFlag = false
                            $scope.addflag.person = false;
                            $scope.$apply();
                        }))
                }



                //失去焦点
                $scope.addblur = function(val,flag){
                    if(flag){

                        setTimeout(function(){
                            $scope.personarrFlag = false;
                            !$scope.add.person?$scope.addflag.person=true:$scope.addflag.person=false
                            $scope.$apply();
                        },200)
                    }else{

                        setTimeout(function(){
                            $scope.dimArrFlag = false;
                            !$scope.add.peopel?$scope.addflag.peopel=true:$scope.addflag.peopel=false
                            $scope.$apply();
                        },200)
                    }
                }

                // 模糊输入
                $scope.addchange = function(val,flag){
                    console.log(val);
                    flag
                        ?(UserNamedo(val).then(function(data){
                                data.length>0?$scope.personarrFlag = true:$scope.personarrFlag = false
                                $scope.$apply();
                            })
                            ,$scope.addflag.person = false
                        )
                        :(initAdddo(val).then(function(data){
                                data.length>0?$scope.dimArrFlag = true:$scope.dimArrFlag = false
                                $scope.$apply();
                            })
                            ,$scope.addflag.peopel = false
                        )
                }
                //点击选择
                $scope.alertliAdd = function(ind,flag){
                    !flag
                        ?($scope.add.peopel = $scope.dimArr[ind].splitJointName
                        ,$scope.peopelArr = $scope.dimArr[ind].id
                        )
                        :($scope.add.person = $scope.personarr[ind].realname
                        ,$scope.personArr = $scope.personarr[ind].id
                        )
                }

                

    // ======================================================================

                //物业输入项目拿id=========================================
                $scope.addfocusproject = function(val){
                    if(!val){$scope.projectuserId = null}
                    server.server().zjprojectprojectVaguedo({
                        searchKeys:val
                    },data=>{
                        if(data.result){
                            $scope.dimArrproject = data.data;
                            $scope.$apply();
                        }else{
                            alert(data.message)
                        }

                    })
                }
                //物业输入项目拿id
                $scope.addchangeproject = function(val){
                    if(!val){$scope.projectuserId = null}
                    server.server().zjprojectprojectVaguedo({
                        searchKeys:val
                    },data=>{
                        if(data.result){
                            $scope.dimArrproject = data.data;
                            $scope.$apply();
                        }else{
                            alert(data.message)
                        }

                    })
                }
                // 失去隐藏
                $scope.addblurproject = function(val){
                    setTimeout(function(){
                        $scope.dimArrproject = [];
                        $scope.$apply();
                    },200)
                    
                }

                // 项目ul 选择
                $scope.alertliAddproject = function(indx){
                    $scope.projectuserId = $scope.dimArrproject[indx].id
                    $scope.add.peopelproject = $scope.dimArrproject[indx].projectName
                
                }

                // =================================================================
            }


                $scope.action.reset = function (roomId) {
                    $scope.genjingId = roomId;
                    //遇到问题一级
                    server.server().signListProblem({}, function (data) {
                        data.result
                            ?($scope.signListP = data.data
                                ,$scope.flag = false
                                ,$scope.$apply())
                            :alert(data.message)
                    });
                    // 问题类型
                    server.server().zjsettingsquerySettingsTypedo({
                        type:$scope.useparams.questiontype
                    }, function (data) {
                        data.result
                            ?($scope.questionArr = data.data
                                ,$scope.flag = false
                                ,$scope.$apply())
                            :alert(data.message)
                    });
                    $('.hopbntshare2').dialog();
                }

                // 遇到问题二级
                $scope.myFunc = function (val,ind) {
                    $scope.listSecondP = [];
                    for (var i = 0; i < $scope.signListP.length; i++) {
                        if ($scope.signListP[i].id == $scope.myselect) {
                            $scope.listSecondP.push($scope.signListP[i].stage);
                        }
                    }
                    if (JSON.stringify($scope.listSecondP[0]) != '[]') {
                        $scope.flag = true;
                    }
                };

                //图片上传
                // /上传添加文件数组返回src
                $scope.fileArr = []
                $scope.fileNameChanged = function(e,flag){
                    var files = e.target.files;
                    var eve = e.target;
                    for(var i = 0;i<files.length;i++){
                        filesupdate(flag,files[i],eve)
                    }
                }
                function filesupdate(flag,file,eve){
                    var fd = new FormData();
                    if (file) {
                        var ext = file.name.slice(file.name.lastIndexOf(".") + 1).toUpperCase();
                        console.log(ext)
                        if(flag=='photos'){
                            if ( ext == "PNG" ||  ext == "JPEG" ||ext == "JPG" || ext == 'GIF') {
                                updatefiles(eve,fd,file,flag,1)
                            }else{
                                eve.value = '';
                                alert("请上传正确的图片格式");
                                return false;
                            }
                        }else if(flag=='video'){
                            if ( ext == "MP4" ||ext == "MPEG" ||ext == "MPG") {
                                updatefiles(eve,fd,file,flag,2)
                            }else{
                                eve.value = '';
                                alert("请上传 .mp4 .mpeg .mpg格式的视频");
                                return false;
                            }
                        }
                        
                    }
                }
                // 视频地址
                $scope.trustSrc = function(url){
                    return $sce.trustAsResourceUrl($scope.imgHost+url);
                }
                // 播放弹窗
                $scope.playauto = function(url){
                    $scope.playurl = url;
                    $('.other').dialog();
                    console.log($('#otherplay'))
                    // $('#otherplay')[0].play();
                    // document.getElementById('otherplay').play();
                    

                }
                $scope.stopplay = function(){
                    // $('#otherplay').pause();
                }
                function updatefiles(eve,fd,file,flag,type){
                    fd.append('multipartFile', file);
                    $http({
                        method: 'POST',
                        url: $scope.imgHost + "attachment/fielUpload.do",
                        data: fd,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    }).then(function successCallback(data) {
                        eve.value = '';
                        if (data.data.result) {
                            data.data.data.flag = flag;
                            data.data.data.type = type;
                            $scope.fileArr.unshift(data.data.data);
                        } else {
                            alert(data.message)
                        }
                    })
                    $scope.$apply()
            }
                
                //input上传文件删除
                $scope.fileArrDel=function(ind){
                    $scope.fileArr.splice(ind,1);
                }

                //跟进保存
                $scope.advice = '';  //物业跟踪信息
                $scope.depict = '';  //问题描述
                $scope.solution = '';//解决办法
                $scope.addInformation=function(roomid){
                    if(!roomid){
                        roomid = $scope.useparams.projectId;
                    }
                    if($scope.myMobFlag){
                        roomid = $scope.peopelArr;
                    }
                    $scope.attachments=[];
                    if($scope.fileArr){
                        $scope.fileArr.forEach((item,i)=>{
                            $scope.attachments[i]={
                                filePath:$scope.fileArr[i].filePath,
                                fileName:$scope.fileArr[i].fileName,
                                size:$scope.fileArr[i].size,
                                type:$scope.fileArr[i].type
                            }
                        })
                    }

                    server.server().addInformation({
                        typeValue: $scope.projectflag, //(1.表示项目跟踪 2.物业跟踪 3.测绘数据跟踪）
                        dataId: roomid,  //所属项目或物业id
                        orderSignType: $scope.myselect,//签约阶段父类型
                        orderSignName: $scope.myselect2,//签约阶段子类型
                        settingsId:$scope.question,
                        advice: $scope.advice,
                        depict: $scope.depict,
                        solution: $scope.solution,
                        attachments:JSON.stringify($scope.attachments)||'',
                        createUser:$scope.useparams.createUser
                    }, function (data) {
                        if (data.result === true) {
                            $('.hopbntshare2').fadeOut(200);
                            alert('发布成功',function(){
                                $scope.advice = '';
                                $scope.depict = '';
                                $scope.solution = '';
                                $scope.questionArr=[];
                                $scope.signListP=[];
                                $scope.fileArr=[];
                                
                                $scope.add.peopelproject = '';
                                $scope.add.peopel = '';
                                $scope.dimArrproject = [];
                                $scope.personarr=[];

                                //跳转
                                if($scope.useparams.locationflag=='1'){
                                    $scope.myLocation();
                                }
                                //刷新接口
                                if($scope.useparams.reloadajax=='1'){
                                    $scope.myFollow();
                                }
                            });

                            $scope.$apply();
                        }else{
                            alert(data.message);
                        }

                    });
                }
            }
        };
    }])
    //不是弹窗的跟踪信息，发布没有展示
    .directive('followPage', ['cache', 'server','$state','$http','$sce',function (cache,server,$state,$http,$sce) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/followPage.html',
            scope:{
                params:'@listtop',
                action:'=',
                myFollow: "&",
                myLocation: "&"
            },
            link:function($scope){
                $scope.no = '/';
                $scope.useparams = JSON.parse($scope.params);
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.flag = false;
                $scope.projectflag = $scope.useparams.projectflag;
                $scope.roomId = $scope.useparams.roomId;
                $scope.genjingId = $scope.useparams.roomId;
                
               
                // 问题类型
                server.server().zjsettingsquerySettingsTypedo({
                    type:$scope.useparams.questiontype
                }, function (data) {
                    data.result
                        ?($scope.questionArr = data.data
                            ,$scope.flag = false
                            ,$scope.$apply())
                        :alert(data.message)
                });

                 //遇到问题一级
                 server.server().signListProblem({}, function (data) {
                    data.result
                        ?($scope.signListP = data.data
                            ,$scope.flag = false
                            ,$scope.$apply())
                        :alert(data.message)
                });

                // 遇到问题二级
                $scope.myFunc = function () {
                    $scope.listSecondP = [];
                    for (var i = 0; i < $scope.signListP.length; i++) {
                        if ($scope.signListP[i].id == $scope.myselect) {
                            $scope.listSecondP.push($scope.signListP[i].stage);
                        }
                    }
                    if (JSON.stringify($scope.listSecondP[0]) != '[]') {
                        $scope.flag = true;
                    }
                };

                //图片上传
                // /上传添加文件数组返回src
                $scope.fileArr = []


                
                

                $scope.fileNameChanged = function(e,flag){
                    var files = e.target.files;
                    var eve = e.target;
                    for(var i = 0;i<files.length;i++){
                        filesupdate(flag,files[i],eve)
                    }
                }
                function filesupdate(flag,file,eve){
                    var fd = new FormData();
                    if (eve.files[0]) {
                        var ext = file.name.slice(file.name.lastIndexOf(".") + 1).toUpperCase();
                        if(flag=='photos'){
                            if ( ext == "PNG" ||  ext == "JPEG" ||ext == "JPG"||ext=="GIF") {
                                updatefiles(eve,fd,file,flag,1)
                            }else{
                                eve.value = '';
                                alert("请上传正确的图片格式");
                                return false;
                            }
                        }else if(flag=='video'){
                            if ( ext == "MP4" ||ext == "MPEG" ||ext == "MPG") {
                                updatefiles(eve,fd,file,flag,2)
                            }else{
                                eve.value = '';
                                alert("请上传 .mp4 .mpeg .mpg格式的视频");
                                return false;
                            }
                        }
                        
                    }

                }
                // 视频地址
                $scope.trustSrc = function(url){
                    return $sce.trustAsResourceUrl($scope.imgHost+url);
                }
                // 播放弹窗
                $scope.playauto = function(url){
                    $scope.playurl = url;
                    $('.other').dialog();
                    console.log($('#otherplay'))
                    // $('#otherplay')[0].play();
                    // document.getElementById('otherplay').play();
                    

                }
                $scope.stopplay = function(){
                    // $('#otherplay').pause();
                }

                function updatefiles(eve,fd,file,flag,type){
                        fd.append('multipartFile', file);
                        $http({
                            method: 'POST',
                            url: $scope.imgHost + "attachment/fielUpload.do",
                            data: fd,
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity
                        }).then(function successCallback(data) {
                            eve.value = '';
                            if (data.data.result) {
                                data.data.data.flag = flag;
                                data.data.data.type = type
                                $scope.fileArr.unshift(data.data.data);
                            } else {
                                alert(data.message)
                            }
                        })
                        $scope.$apply()
                }
                //input上传文件删除
                $scope.fileArrDel=function(ind){
                    $scope.fileArr.splice(ind,1);
                }

                //跟进保存
                $scope.advice = '';  //物业跟踪信息
                $scope.depict = '';  //问题描述
                $scope.solution = '';//解决办法
                $scope.addInformation=function(roomid){

                    $scope.attachments=[];
                    if($scope.fileArr){
                        $scope.fileArr.forEach((item,i)=>{
                            $scope.attachments[i]={
                                filePath:$scope.fileArr[i].filePath,
                                fileName:$scope.fileArr[i].fileName,
                                size:$scope.fileArr[i].size,
                                type:$scope.fileArr[i].type
                            }
                        })
                    }

                    server.server().addInformation({
                        typeValue: $scope.projectflag, //(1.表示项目跟踪 2.物业跟踪 3.测绘数据跟踪）
                        dataId: $scope.roomId,  //所属项目或物业id
                        orderSignType: $scope.myselect,//签约阶段父类型
                        orderSignName: $scope.myselect2,//签约阶段子类型
                        settingsId:$scope.question,
                        advice: $scope.advice,
                        depict: $scope.depict,
                        solution: $scope.solution,
                        attachments:JSON.stringify($scope.attachments)||'',
                        createUser:$scope.useparams.createUser
                    }, function (data) {
                        if (data.result === true) {
                            $('.hopbntshare2').fadeOut(200);
                            alert('发布成功',function(){
                                $scope.advice = '';
                                $scope.depict = '';
                                $scope.solution = '';
                                $scope.question= '';
                                $scope.myselect = '';
                                $scope.myselect2 = '';
                                $scope.fileArr = [];
                                //跳转
                                if($scope.useparams.locationflag=='1'){
                                    $scope.myLocation();
                                }
                                //刷新接口
                                if($scope.useparams.reloadajax=='1'){
                                    $scope.myFollow();
                                }
                            });

                            $scope.$apply();
                        }else{
                            alert(data.message);
                        }

                    });
                }
            }
        };
    }])
    //跟踪信息展示  (没做好
    .directive('followShow', ['cache', 'server','$state','$http',function (cache,server,$state,$http) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/followShow.html',
            scope:{
                params:'@listtop',
                action:'=',
                myFollow: "&",
                myLocation: "&"
            },
            link:function($scope){
                $scope.no = '/';
                $scope.useparams = JSON.parse($scope.params);
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.flag = false;
                $scope.projectflag = $scope.useparams.projectflag;
                $scope.roomId = $scope.useparams.roomId;
                $scope.genjingId = $scope.useparams.roomId;

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


            }
        };
    }])
    //转移共享
    .directive('transfer', ['cache', 'server','$state','$http',function (cache,server,$state,$http) {
        return {
            // restrict: 'E',
            // replace: true,
            // templateUrl: 'view/template/public/transfer.html',
            // scope:{
            //     params:'@listtop',
            //     transferclick:'=',
            //     myFollow: "&",
            //     myLocation: "&"
            // },
            // link:function($scope){
            //     $scope.no = '/';
            //     $scope.useparams = JSON.parse($scope.params);
            //     $scope.imgHost = $scope.useparams.imgHost;
            //     $scope.createUser = $scope.useparams.createUser;
            //     $scope.projectId = $scope.useparams.projectId;
            //     $scope.conf_1 = {
            //         total: 6,  //共多少页
            //         currentPage: 1,  //默认第一页
            //         itemPageLimit: 6, //一页多少条
            //         isSelectPage: true,
            //         isLinkPage: false
            //     };

            //     //筛选
            //     $scope.seach=function(){
            //         initrole($scope.projectId)
            //     }

            //     $scope.$watch('conf_1.currentPage + conf_1.itemPageLimit+searchKeys', function (news) {
            //         initrole($scope.projectId)
            //     });

            //     function update(projectId,rows){
                    
            //     }

            //     //角色列表初始化
            //     function initrole(project) {
            //         server.server().initrolelist({
            //             searchKeys: $scope.searchKeys||'',
            //             pageNo: $scope.conf_1.currentPage||'1',
            //             pageSize: $scope.conf_1.itemPageLimit,
            //         }, function (data) {
            //             if (data.result === true) {
            //                 $scope.rolelist = data.data.rows;
            //                 for(var i = 0;i<$scope.rolelist.length;i++){
            //                     for(var j = 0;j<$scope.userJson.length;j++){
            //                         if($scope.rolelist[i].id===$scope.userJson[j]){
            //                             $scope.rolelist[i].isFlag = true;
            //                         }
            //                     }
            //                 }
            //                 update((project||$scope.projectId),$scope.rolelist)
            //                 $scope.total = data.data.total;
            //                 //共多少页
            //                 $scope.conf_1.total = data.data.pageCount;
            //                 //共有多少条数据
            //                 $scope.conf_1.counts = data.data.total;
            //                 $scope.$broadcast("categoryLoaded");
            //                 $scope.$apply();
            //             } else {
            //                 alert(data.message);
            //             }
            //         }, function (err) {

            //         });
            //     }

            //     $scope.typeFlag = true;
            //     $scope.userJson = [];

            //     //显示选择弹窗
            //     $scope.transferclick.reset = function (flag,rows) {
            //         $('.hchakantwo').dialog();
            //         $scope.typeFlag = flag;
            //         for (let o in $scope.rolelist) {
            //             $scope.rolelist[o].isFlag = false  //每个都未选中
            //         }
            //         $scope.userJson = [];
            //         if(rows){
            //             $scope.rows = rows;
            //             for (let t of $scope.rows) {
            //                 if (t.status_1) {
            //                     $scope.projectId = t.id
            //                 }
            //             }
            //         }

            //         initrole($scope.projectId)


            //     };




            //     //点击选中效果
            //     $scope.addrole = function (i, id) {
            //         var isFlag = $scope.rolelist[i].isFlag; //每个都未选中
            //             $scope.rolelist[i].isFlag = !isFlag;  //false 共享多选
            //             if ($scope.rolelist[i].isFlag) {
            //                 $scope.userJson.push(id)
            //             } else {
            //                 $scope.userJson.splice(i, 1);
            //             }
            //         // }
            //     };

            //     //转移和共享提交
            //     $scope.addAllotRole = function (type,rows) {  //10 转移  20  共享
            //         if(rows){
            //             for (let t of rows) {
            //                 if (t.status_1) {
            //                     $scope.projectId = t.id
            //                 }
            //             }
            //         }

            //         if (!$scope.projectId) {
            //             alert('没有找到对应的项目');
            //             return
            //         }
            //         if ($scope.userJson.length == 0) {
            //             alert('请选择角色');
            //             return
            //         }

            //         if(type){
            //             !$scope.userJson?alert('请选择要转移的角色'):$scope.userJson
            //             server.server().zjsharedtransferaddTransferdo({
            //                 userId:$scope.userJson.join(','),	    //接受转移的用户id	是
            //                 projectId:$scope.projectId,	//项目id	是
            //                 createUser:$scope.createUser
            //             }, function (data) {
            //                 if (data.result === true) {
            //                     $scope.userJson = [];
            //                     $('.hchakantwo').fadeOut(200)
            //                     alert('转移成功');
            //                 } else {
            //                     alert(data.message);
            //                 }
            //             });
            //         }else{
            //             !$scope.userJson?alert('请选择要共享的角色'):$scope.userJson
            //             server.server().zjsharedtransferaddShareddo({
            //                 userIdJson:$scope.userJson.join(','),	    //接受转移的用户id	是
            //                 projectId:$scope.projectId,	//项目id	是
            //                 createUser:$scope.createUser
            //             }, function (data) {
            //                 if (data.result === true) {
            //                     $('.hchakantwo').fadeOut(200)
            //                     $scope.userJson = []
            //                         alert('共享成功')
            //                 } else {
            //                     alert(data.message);
            //                 }
            //             });
            //         }

            //     };




            // }
        };
    }])
    // 各种授权
    .directive('gezhong',['cache', 'server','$state','$http',function (cache,server,$state,$http){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/transfer.html',
            scope:{
                params:'@listtop',
                transferclick:'=',
                myFollow: "&",
                myLocation: "&"
            },
            link:function($scope){
                $scope.no = '/';
                $scope.useparams = JSON.parse($scope.params);
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.createUser = $scope.useparams.createUser;
                $scope.projectId = $scope.useparams.projectId;
                $scope.conf_1 = {
                    total: 6,  //共多少页
                    currentPage: 1,  //默认第一页
                    itemPageLimit: 6, //一页多少条
                    isSelectPage: true,
                    isLinkPage: false
                };

                //筛选
                $scope.seach=function(){
                    initrole($scope.projectId)
                }

                $scope.$watch('conf_1.currentPage + conf_1.itemPageLimit+searchKeys', function (news) {
                    initrole($scope.searchKeys)
                });

                //角色初始化
                function initrole(searchKeys){
                    server.server().initrolelist({
                        searchKeys:$scope.searchKeys,
                        pageNo:$scope.conf_1.currentPage,
                        pageSize:$scope.conf_1.itemPageLimit,
                    }, function (data) {
                        if (data.result === true) {
                            $scope.rolelist=data.data.rows;
                            $scope.total=data.data.total;
                            //共多少页
                            $scope.conf_1.total = data.data.pageCount;
                            //共有多少条数据
                            $scope.conf_1.counts = data.data.total;
                            $scope.$apply()
                            $scope.$broadcast("categoryLoaded2");
                        } else {
                            alert(data.message);
                        }
                    });
                }

                



            }
        };
    }])




    //申请制作合同
    .directive('applypact', ['cache', 'server','$state','$http','$rootScope',function (cache,server,$state,$http,$rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/applypact.html',
            scope:{
                params:'@list'
            },
            link:function($scope){
                $scope.useparams = JSON.parse($scope.params);
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.createUser = $scope.useparams.createUser;
                $scope.roomId = $scope.useparams.roomId;
                //0未审核 1审核通过 2审核通过3审核中',
                if($rootScope.sbstauts=='0'){  
                    $scope.Pact = true;
                }else{
                    $scope.Pact = false;
                }
                console.log($rootScope.sbstauts)

                //申请制制作合同
                $scope.doApplyPact = function () {
                    confirm("申请制作合同", function () {
                        applypactajax()
                    })
                }
                function applypactajax(){
                    server.server().zjpactinfoaddSavedo({
                        propertyId: $scope.roomId,
                        createUser: $scope.createUser
                    }, function (data) {
                        if (data.result === true) {
                            $scope.Pact = false;
                            alert(data.message);
                        } else {
                            $scope.Pact = true;
                            alert(data.message);
                        }
                        $scope.$apply();
                    });
                }
                
            }
        };
    }])
    //删除项目 已提交至审核
    .directive('deleteProject', ['cache', 'server','$state','$http',function (cache,server,$state,$http) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'view/template/public/deleteProject.html',
            scope:{
                params:'@list'
            },
            link:function($scope){
                $scope.useparams = JSON.parse($scope.params);
                $scope.imgHost = $scope.useparams.imgHost;
                $scope.createUser = $scope.useparams.createUser;
                $scope.projectId = $scope.useparams.projectId;
                $scope.flag = true;
                //删除项目
                $scope.deleteProject=function(id){
                    confirm('确认删除项目?',function(){
                        server.server().delProject({
                            userId:$scope.createUser,
                            projectId: $scope.projectId
                        }, function (data) {
                            if (data.result === true) {
                                alert('项目已提交至审核',function(){
                                    $scope.flag = false;
                                    $state.go("projectmanagement");
                                })
                                $scope.$apply();
                            } else {
                                $scope.flag = true;
                                alert(data.message);
                            }
                        });
                    })
                }
            }
        };
    }])


