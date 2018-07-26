/**
 * Created by lian on 2017/10/18.
 */
angular.module('app').controller('projectProcessCtrl', ['$http', '$scope', 'dict', 'server','$compile','$state', function ($http, $scope, dict, server,$compile,$state) {
    $scope.projectId=$state.params.projectid;
    var createUser=server.server().userId;
    function process(){
        server.server().processlist({
            id:$scope.projectId,
        },function(data){
            if(data.result===true){
                $scope.list = data.data;//包含一级二级三级
                $scope.$apply();

            }else{
                alert(data.message)
            }
        },function(){
            alert('404请求失败')
        })
    }
    process()
    //保存流程
    $scope.savebntprocess=function(){
        server.server().updateaccomplish({
            projectId:'044e348bd2484505a110a29bb08126c3'
        },function(data){
            alert(data.message)
        })
    }

}])

//流程进度信息
angular.module('app').controller('projectProcessInformationCtrl', ['$http', '$scope', 'dict', 'server', '$state','$rootScope','$compile','$cookieStore',function ($http, $scope, dict, server,$state,$rootScope,$compile,$cookieStore) {
    $scope.projectId=$state.params.projectid;
    var userId=server.server().userId;
    $scope.hostname=server.server().imgHost;
    $scope.completeTime='';
    $scope.remark=''
    var storage=window.localStorage;
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

    function process(){
        server.server().processlist({
            projectId:$scope.projectId,
        },function(data){
            if(data.result===true){
                $scope.list = data.data;//包含一级二级三级
                console.log(data.data);
                $scope.$apply();

            }else{
                alert(data.message)
            }
        },function(){
            alert('404请求失败')
        })
    }
    process();

    //提示信息初始化
    $scope.check={
        peoplenameFlag:false,
        completeTimeFlag:false,
    }
    //checkbox初始化
    $scope.colors=[
        {
            key:1,//1负责人
            name:'负责人',
            status:true
        },
        {
            key:2,//2完成时间
            name:'完成时间',
            status:true
        },
        {
            key:3,//3备注
            name:'备注',
            status:true
        }
    ]
    $scope.flag=false;
    $scope.flag2=true;
    //添加一级
    $scope.addfirst=function(flag){
        $('.'+flag).dialog();
    }
    //添加二级
    $scope.addsecond=function(id,flag){
        $('.'+flag).dialog();
        $scope.parentId=id;
    }
    //添加前置条件
    $scope.addcondition=function(){
        // $scope.flag2=false;
        $scope.processNameList.push({processName:''});
    }
    $scope.processNameList=[{processName:''}];
    //点击新增后保存，一级非前置
    $scope.savebnt=function(planTime){
        $('.saveDisabled').attr('disabled','disabled');
        var functionList=[];
        for(var i=0;i<$scope.colors.length;i++){
            if($scope.colors[i].status==true){
                functionList.push({key:$scope.colors[i].key});
            }
        }
        storage.setItem("firstTime",planTime);
        newadd(0,functionList,$scope.processName,$scope.processNameList,'addnew');
    }
    //一级列表新增二级非前置和3级前置
    $scope.savebnt2=function(parentId){
        $('.saveDisabled').attr('disabled','disabled');
        var functionList=[];
        for(var i=0;i<$scope.colors.length;i++){
            if($scope.colors[i].status==true){
                functionList.push({key:$scope.colors[i].key});
            }
        }
        storage.setItem("firstTime",$scope.planTime);
        newadd(parentId,functionList,$scope.processName2,$scope.processNameList,'addnewson');
    }
    //新增公用function
    function newadd(parentId,functionList,processName,processNameList,flag){
        processNameList.forEach(function(item,i){
            if(!item.processName){
                processNameList.splice(i,1);
            }
        });
        server.server().addNewProcessNode({
            projectId:$scope.projectId,
            type:2,
            planTime:$scope.planTime,
            processName:processName,
            createUser:userId,
            parentId:parentId,
            rank:JSON.stringify(processNameList),
            functionList:JSON.stringify(functionList),
        },function(data){
            if(data.result===true){
               alert(data.message,function(){
                   $('.'+flag).hide();
                   $('.saveDisabled').removeAttr('disabled');
                   process();
                   cancelData();
               });
                $scope.$apply();

            }else{
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                    process();
                    cancelData();
                })
            }
        },function(){
            alert('404请求失败',function(){
                $('.saveDisabled').removeAttr('disabled');
                process();
                cancelData();
            })
        })
    }
    //添加信息
    $scope.addinfo=function(id,flag,detailList,val){
        $('.'+flag).dialog();
        if(detailList.length){
            for(var i=0;i<detailList.length;i++){
                if(detailList[i].keyAssignments==1){
                    $scope.detailId1=detailList[i].detaillsId;
                    $scope.peoplename=detailList[i].userName;
                    $scope.nameVal=detailList[i].val;
                }else if(detailList[i].keyAssignments==2){
                    $scope.detailId2=detailList[i].detaillsId;
                    $scope.remark=detailList[i].val;
                }else if(detailList[i].keyAssignments==3){
                    $scope.detailId3=detailList[i].detaillsId;
                    $scope.remark=detailList[i].val;
                }else if(detailList[i].keyAssignments==4){
                    $scope.detailId4=detailList[i].detaillsId;
                    $scope.remark=detailList[i].val;
                }
            }
        }
        $scope.processid=id;

    }
    //时间控件
    $scope.mychange=function(chaild,parent,check,parentId) {
        // var time = localStorage.getItem("firstTime");
        var time='';
        $scope.list.forEach(function(item,i){
            if(item.id==parentId){
                time=item.planTime;
            }else{
                item.twoStage.forEach(function(stage,inx){
                    if(stage.id==parentId){
                        time=stage.planTime;
                    }
                })
            }
        })
        if(time){
            laydate.render({
                elem: '.'+chaild
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , max:time
                , closeStop: '.'+parent //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                //,position: 'static'
                ,done:function(value){
                    if(check==1){
                        $scope.completeTime=value;
                    }else{
                        $scope.planTime=value;
                    }

                    $scope.$apply();
                }
            });
        }else{
            laydate.render({
                elem: '.'+chaild
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.'+parent //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                //,position: 'static'
                ,done:function(value){
                    if(check==1){
                        $scope.completeTime=value;
                    }else{
                        $scope.planTime=value;
                    }

                    $scope.$apply();
                }
            });
        }


    }
    //添加附件
    $scope.addannex=function(processid,files){
        var fd = new FormData();
        var file=files[0];
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
            var jsonString=[{size:$scope.data.size,fileName:$scope.data.fileName,filePath:$scope.data.filePath}]
            server.server().addAttachment({
                dataId:processid,
                userId:userId,
                jsonString:JSON.stringify(jsonString),
            },function(data){
                if(data.result===true){
                    alert(data.message,function(){
                        process();
                    })
                    $scope.$apply();

                }else{
                    alert(data.message)
                }
            },function(){
                alert('404请求失败')
            })
        }, function errorCallback(response) {
            alert(response);// 请求失败执行代码
        });
    }
    //查看附件function
    function watchList(id){
        server.server().watchAttachmentList({
            dataId:id,
        },function(data){
            if(data.result===true){
                $scope.fileList=data.data;
                $scope.$apply();

            }else{
                alert(data.message)
            }
        },function(){
            alert('404请求失败')
        })
    }
    //查看附件列表
    $scope.watchFile=function(flag,processid){
        $('.'+flag).dialog();
        watchList(processid);
        $scope.processid=processid;
    }
    //下载链接
    $scope.downloadFile=function(id){
        $scope.link=$scope.hostname+'attachment/fileDownload.do?id='+id;
    }
    //删除附件
    $scope.deleteFile=function(id){
        server.server().deleteAttachment({
            id:id,
        },function(data){
            if(data.result===true){
                alert(data.message,function(){
                    watchList($scope.processid);
                })
                $scope.$apply();

            }else{
                alert(data.message)
            }
        },function(){
            alert('404请求失败')
        })
    }
    $scope.check={
        peoplenameFlag:false,
    }
    //保存信息添加
    $scope.addInfoList=function(processid,selid,detailId1,detailId2,detailId3,detailId4){
        $('.saveDisabled').attr('disabled','disabled');
        if(!$scope.peoplename){
            $scope.check.peoplenameFlag=true
            $('.saveDisabled').removeAttr('disabled');
            return
        }
        var detailJson=[];
        if(detailId1){
            detailJson.push({id:detailId1,val:(selid||'')});
        };
        if($scope.completeTime!=''){
            detailJson.push({id:detailId2,val:($scope.completeTime||'')});
        };
        if($scope.remark!=''){
            detailJson.push({id:detailId3,val:($scope.remark||'')});
        };
        var type=0;
        if($scope.completeTime!=''){
            type=1;
        }
        server.server().addInfoData({
            id:processid,
            detailJson:JSON.stringify(detailJson),
            type:type
        },function(data){
            if(data.result===true){
                alert(data.message,function(){
                    process();
                    $('.addinfo').hide();
                    cancelData();
                    $('.saveDisabled').removeAttr('disabled');
                })
                $scope.$apply();

            }else{
                alert(data.message,function(){
                    cancelData();
                    $('.saveDisabled').removeAttr('disabled');
                })
            }
        },function(){
            alert(data.message,function(){
                cancelData();
                $('.saveDisabled').removeAttr('disabled');
            })
        })
    }
    //前置条件-完成
    $scope.complete=function(id,parentid){
        server.server().completeprocess({
            id:id,
        },function(data){
            if(data.result===true){
                alert(data.message,function(){
                    watchPreposeListData(parentid);
                })
                $scope.$apply();

            }else{
                alert(data.message)
            }
        },function(){
            alert('404请求失败')
        })
    }
    //模糊搜索ul显示
    $scope.ulshow=function(name){
        $('.ulshow').show(500);
        search();
    }
    //模糊搜索消失
    $scope.ulcancel=function(peoplename){
        if(!peoplename){
            $scope.check.peoplenameFlag=true;//提示负责人信息展示
        }else{
            $scope.check.peoplenameFlag=false;//提示负责人信息隐藏
        }
        $('.ulshow').hide(500);
        $scope.peoplename='';
    }
    //时间为空时信息提示
    $scope.timecancel=function(completeTime){
        if(!completeTime){
            $scope.check.completeTimeFlag=true;//提示完成时间信息展示
        }else{
            $scope.check.completeTimeFlag=false;//提示完成时间信息隐藏
        }
    }
    //备注为空时信息提示
    $scope.remarkcancel=function(remark){
        if(!remark){
            $scope.check.remarkFlag=true;//提示备注信息展示
        }else{
            $scope.check.remarkFlag=false;//提示备注信息隐藏
        }
    }
    //模糊搜索
    $scope.serachsomthing=function(name){
        search(name);
    }
    //选中搜索
    $scope.getname=function(id,name){
        $scope.peoplename=name;
        $scope.check.peoplenameFlag=false;//提示负责人信息隐藏
        $scope.selid=id;
    }

    function search(name){
        server.server().searchPeopleName({
            searchKeys:name
        }, function (data) {
            if (data.result === true) {
                $scope.searchlist=data.data;
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
    //删除
    $scope.delete=function(id){
        confirm('确定删除？',function(){
            server.server().deleteprocess({
               id:id
            }, function (data) {
                if (data.result === true) {
                   alert(data.message,function(){
                       process();
                   })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        })

    }
    //取消function
    function cancelData(){
        $scope.fileName='';
        $scope.remark='';
        $scope.completeTime='';
        $scope.peoplename='';
        $scope.processName='';
        $scope.planTime='';
        $scope.colors=[
            {
                key:1,//1负责人
                name:'负责人',
                status:true
            },
            {
                key:2,//2完成时间
                name:'完成时间',
                status:true
            },
            {
                key:3,//3备注
                name:'备注',
                status:true
            }
        ];
        $scope.processNameList=[{processName:''}];
        $scope.processName2='';
        $scope.flag=false;
        $scope.flag2=true;
    }
    //信息取消-数据清空
    $scope.cancel=function(){
        cancelData();

    }
    //查看前置
    $scope.watchPrepose=function(id,flag){
        $('.'+flag).dialog();
        watchPreposeListData(id);
        $scope.parentid=id;
    }
    //前置条件function
    function watchPreposeListData(id){
        server.server().watchPreposeList({//查看前置接口
            parentId:id
        }, function (data) {
            if (data.result === true) {
                $scope.watchList=data.data;
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
}])


