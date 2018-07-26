/**
 * Created by pc on 2017/10/24.
 */
angular.module('app').controller('surveyingInformationCtrl', ['$http', '$scope', 'server', '$state', 'dict', '$rootScope', function ($http, $scope, server, $state, dict, $rootScope) {

   // $scope.myurl = '/file-core/nqzf054lybr93wk.jpg';
    $scope.no = '/';
    $scope.projectId = $state.params.projectid;
    var roomId = $state.params.roomId;
    $scope.roomId = $state.params.roomId;
    $scope.hostname = server.server().imgHost;
    var createUser = server.server().userId;
    var userId=server.server().userId;
    $scope.attachments=[];
    //关注
    $scope.list = {
        roomId:$state.params.roomId,
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

    // 发起任务
    //input单选获取
    server.server().zjtaskinitOrderSignNodedo({
    },data=>{
        if(data.result){
            $scope.initOrder = data.data;
            $scope.$apply();
        }else{
            alert(data.message);
        }
    });
    //star时间筛选
    function runAsync1(inputval,boxval,flag,callback){
        laydate.render({
            elem: '.'+inputval
            , type: 'date'
            , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
            , format: 'yyyy-MM-dd' //可任意组合
            , show: true //直接显示
            , closeStop: '.'+boxval //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            , done: value=>{
                $scope.beginTime = value;
                if(flag){callback(value)}
            }
        });
    }
    //end时间筛选
    function runAsync2(inputval,boxval,stardata,callback){
        laydate.render({
            elem: '.'+inputval
            , type: 'date'
            , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
            , format: 'yyyy-MM-dd' //可任意组合
            , show: true //直接显示
            , closeStop: '.'+boxval //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            , done: value=>{
                callback(value)
            }
        });
    }
    $scope.regCreatetaskist = function(sub,list){
        $scope.add.parentOption=list.orderSignId;
        $scope.parentOption=list.name;
        $scope.add.childOption=sub.orderSignId;
        $scope.childOption=sub.name;
        ;$scope.registFlag = 1
        ;$scope.add.peopel = ''
        ;$scope.peopelArr =''
        ;$scope.personArr = ''
        ;$scope.add.person = ''
        ;$scope.add.date = ''
        ;$scope.add.things = ''
        ;choooseArr = []
        $('.addchildData1').val('');
        $('.h-liebiaoone').dialog();
    }

    //
    $scope.add={
        peopel:'', //peopel input 人
        person:'', //peopel input 人
        parentOption:'', //select parent
        childOption:'',    //select child
        date:'',       //选择时间
        things:''       //事件
    }  //名字
    $scope.peopelArr = ''; //peopel id数组
    $scope.personArr = ''; //peopel id数组
    $scope.dimArrFlag = false;  //模糊ul显示
    $scope.personarrFlag = false;  //模糊ul显示


    $scope.addflag={
        peopel:false,   //警告提示
        person:false,   //指派人
        select:false,
        things:false
    }

    // 模糊输入ajax
    function initAdddo (param){
        $scope.dimArr=[];
        var p = new Promise((resolve, reject) =>{
            server.server().zjtaskqueryRoomNamedo({
                param:param,
                projectId:$scope.projectId
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
    };



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
    };

    // 模糊输入
    $scope.addchange = function(val,flag){
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
    };
    //点击选择
    $scope.alertliAdd = function(ind,flag){
        !flag
            ?($scope.add.peopel = $scope.dimArr[ind].splitJointName
                ,$scope.peopelArr = $scope.dimArr[ind].id
        )
            :($scope.add.person = $scope.personarr[ind].realname
                ,$scope.personArr = $scope.personarr[ind].id
        )
    };

    //事件blur事件
    $scope.addsBlur=function(val){
        !val?$scope.addflag.things=true:$scope.addflag.things=false
    };

    // 时间选择
    $scope.adddate = function(child,parent){
        runAsync1(child,parent,2,function(val){
            $scope.add.date = val;
            BuyUseTime($scope.add.person,val)
            $scope.$apply();
        })
    };

    $scope.bodyDataArr = [
        {id:8,name:'08:00',flagClass:false,msg:'',clickClass:false}
        ,{id:9,name:'09:00',flagClass:false,msg:'',clickClass:false}
        ,{id:10,name:'10:00',flagClass:false,msg:'',clickClass:false}
        ,{id:11,name:'11:00',flagClass:false,msg:'',clickClass:false}
        ,{id:12,name:'12:00',flagClass:false,msg:'',clickClass:false}
        ,{id:13,name:'13:00',flagClass:false,msg:'',clickClass:false}
        ,{id:14,name:'14:00',flagClass:false,msg:'',clickClass:false}
        ,{id:15,name:'15:00',flagClass:false,msg:'',clickClass:false}
        ,{id:16,name:'16:00',flagClass:false,msg:'',clickClass:false}
        ,{id:17,name:'17:00',flagClass:false,msg:'',clickClass:false}
        ,{id:18,name:'18:00',flagClass:false,msg:'',clickClass:false}
        ,{id:19,name:'19:00',flagClass:false,msg:'',clickClass:false}
        ,{id:20,name:'20:00',flagClass:false,msg:'',clickClass:false}
    ]

    //点击时间添加任务
    let choooseArr = [];

    //任务发起查询占用时间
    function BuyUseTime(userId,val){
        $scope.threeshowArr=[];
        choooseArr = [];
        $scope.bodyDataArr.forEach((item,i)=>{
            $scope.bodyDataArr[i].clickClass=false;
        })
        server.server().zjtaskqueryUserInfoByUserIddo({
            userId:server.server().userId,
            time:val
        },data=>{
            if(data.result){
                $scope.taskquery=data.data;
                if($scope.taskquery){
                    $scope.yearmonthdata = dict.timeConverter3($scope.taskquery[0].startTime,1)

                    for(var i =0;i<$scope.taskquery.length;i++){
                        $scope.taskquery[i].startTime=dict.timeConverter3($scope.taskquery[i].startTime)
                        $scope.taskquery[i].endTime=dict.timeConverter3($scope.taskquery[i].endTime)
                        for(var Q = $scope.taskquery[i].startTime;Q<$scope.taskquery[i].endTime+1;Q++){
                            $scope.threeshowArr.push(Q)
                        }
                    };

                    for(var j = 0;j<$scope.bodyDataArr.length;j++){
                        for(var k = 0;k<$scope.threeshowArr.length;k++){
                            if($scope.bodyDataArr[j].id === $scope.threeshowArr[k]){
                                $scope.bodyDataArr[j].flagClass = true;
                            }
                        }
                    }
                }
                $scope.$apply();
            }else{
                alert(data.message)
            }

        })
    }

    //数组删除指定元素
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //sort排序
    function sortfunc(a,b)
    {
        return a - b;
    }



    $scope.datachoose=function(indx){
        if($scope.bodyDataArr[indx].flagClass===false){
            $scope.bodyDataArr[indx].clickClass=!$scope.bodyDataArr[indx].clickClass  //true
            if($scope.bodyDataArr[indx].clickClass===true){
                choooseArr.push(indx)
            }else{
                choooseArr.removeByValue(indx);
            }
            if(choooseArr.length>=2){
                choooseArr = choooseArr.sort(sortfunc);
                for(var i = choooseArr[0];i<choooseArr[choooseArr.length-1]+1;i++){
                    if($scope.bodyDataArr[i].flagClass===true){
                        $scope.bodyDataArr[indx].clickClass=false;
                        choooseArr.pop();
                        return;
                    }
                    $scope.bodyDataArr[i].clickClass=true;
                }
            }
        }
    }






    //发布
    $scope.addsave = function(indx,flag){
        if(flag===2){
            if(!$scope.add.person){$scope.addflag.person=true;return}else{$scope.addflag.person=false}
            if(!$scope.add.date){alert('请选择指派时间！');return}else{$scope.addflag.date=false}

            if(choooseArr.length<=0){
                alert('请选择可用时间段！')
                return;
            }else{
                $scope.startDate = $scope.add.date+' '+$scope.bodyDataArr[choooseArr[0]].name;
                $scope.endDate = $scope.add.date+' '+$scope.bodyDataArr[choooseArr[choooseArr.length-1]].name;
            }

            if(!$scope.add.things){$scope.addflag.things=true;return}else{$scope.addflag.things=false}


            server.server().zjtaskupdateTaskdo({
                toUser:$scope.add.person,	       //指派给
                startDate:$scope.startDate,	       //开始时间
                endDate:$scope.endDate,	       //结束时间
                eventDesc:$scope.add.things,	       //事件说明
                userId:$scope.personArr,	       //指派人id
                id:$scope.rows[indx].id	       //创建人id

            }, data => {
                data.result
                    ? (
                    $('.h-liebiaoone').fadeOut(200)
                        ,$scope.add.peopel = ''
                        ,$scope.peopelArr =''
                        ,$scope.add.childOption = ''
                        ,$scope.add.parentOption =''
                        ,$scope.personArr = ''
                        ,$scope.add.person = ''
                        ,$scope.add.date = ''
                        ,$scope.add.things = ''
                        ,choooseArr = []
                        ,alert('发布成功！',function(){
                         setStageListDo() ;
                            // EventListdo($scope.nodeId,$scope.type,'','','',$scope.conf.currentPage,'')
                        })
                        , $scope.$apply())
                    : alert(data.message)
            })
        }else{
            if(!$scope.add.peopel){$scope.addflag.peopel=true;return}else{$scope.addflag.peopel=false}
            if(!$scope.add.childOption){$scope.addflag.select=true;return}else{$scope.addflag.select=false}
            if(!$scope.add.person){$scope.addflag.person=true;return}else{$scope.addflag.person=false}
            if(!$scope.add.date){alert('请选择指派时间！');return}else{$scope.addflag.date=false}

            if(choooseArr.length<=0){
                alert('请选择可用时间段！')
                return;
            }else{
                $scope.startDate = $scope.add.date+' '+$scope.bodyDataArr[choooseArr[0]].name;
                $scope.endDate = $scope.add.date+' '+$scope.bodyDataArr[choooseArr[choooseArr.length-1]].name;
            }

            if(!$scope.add.things){$scope.addflag.things=true;return}else{$scope.addflag.things=false}

            server.server().zjtaskaddTask({
                roomId:$scope.peopelArr,	       //物业id	是
                processId:$scope.add.childOption,	       //签约阶段子id下
                toUser:$scope.add.person,	       //指派给
                startDate:$scope.startDate,	       //开始时间
                endDate:$scope.endDate,	       //结束时间
                eventDesc:$scope.add.things,	       //事件说明
                userId:$scope.personArr,	       //指派人id
                createUser:userId,	       //创建人id
                eventNode:$scope.add.parentOption	       //签约阶段父id 
                //	时间说明

            }, data => {
                data.result
                    ? (
                    $scope.add.peopel = ''
                        ,$scope.peopelArr =''
                        ,$scope.add.childOption = ''
                        ,$scope.add.parentOption =''
                        ,$scope.personArr = ''
                        ,$scope.add.person = ''
                        ,$scope.add.date = ''
                        ,$scope.add.things = ''
                        ,choooseArr = []
                        ,alert('发布成功！',function(){
                        // EventListdo($scope.nodeId,$scope.type,'','','',$scope.conf.currentPage,'');
                            setStageListDo()
                        })
                        ,$('.h-liebiaoone').fadeOut(200)

                        , $scope.$apply())
                    : alert(data.message)
            })
        }

    }

//完成时间
    $scope.showTime=function (item) {
        $('.hopbntshare2').dialog();
        $scope.submitTime.id=item.id;
        $scope.submitTime.accomplishTime = item.accomplishTime?dict.timeConverter3(item.accomplishTime,4):''
        $scope.timeflag = item.accomplishTime

    };
    $scope.showTimeSel=function () {
        laydate.render({
           
            elem: '.childData11'
            //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
            , format: 'yyyy-MM-dd' //可任意组合
            , show: true //直接显示
            , closeStop: '.parentData1' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            //,position: 'static'
            ,done:function(value){
                $scope.submitTime.accomplishTime=value;
            }
        });
    };
    $scope.submitTime=function (flag) {
        if(!flag){
            server.server().lgcSetDataUpdateAccomplishTime({
                roomId:$scope.roomId,
                id:$scope.submitTime.id,
                accomplishTime:$scope.submitTime.accomplishTime,
                cause:$scope.submitTime.textareaText||'',
                userId:createUser
            },function (data) {
                if(data.result){
                    setStageListDo();
                    $('.childData1').val('');
                    alert(data.message);
                }else {
                    alert(data.message);
                }
            })
        }else{
            server.server().zjpropertystageupdateTimedo({
                id:$scope.submitTime.id,
                accomplishTime:$scope.submitTime.accomplishTime
            },function (data) {
                if(data.result){
                    setStageListDo();
                    alert(data.message,function(){
                        $scope.submitTime.accomplishTime='';
                        $('.childData1').val('');
                    });
                    $scope.$apply();
                }else {
                    alert(data.message);
                }
            })
        }
        
    }

    //测绘信息 function()
    function surveyingInfo(){
        server.server().surveyingInformationById({
            roomId: $scope.roomId
        }, function (data) {
            if (data.result === true) {
                if(data.data){
                    $scope.surveyInfo = data.data;
                    $scope.singleList = data.data.singleList;
                    $scope.surveyList = data.data.surveyList;
                    $scope.housesImg = data.data.housesImg;
                    $scope.$apply();
                }

            } else {
                alert(data.message)
            }
        }, function () {
            alert('404请求失败')
        });
    }
    surveyingInfo();
    //右侧测绘进度
    setStageListDo();
    function setStageListDo() {
        server.server().surveyingList({
            roomId: $scope.roomId,
            type: 2
        }, function (data) {
            if (data.result === true) {
                $scope.surveyingList = data.data;
                $scope.surveyingList.forEach((item,i)=>{
                    if($scope.surveyingList[i].name=='签约'){
                        if($scope.surveyingList[i].sublevel && $scope.surveyingList[i].sublevel.length>0){
                            $scope.surveyingList[i].sublevel.forEach((item,j)=>{
                                if($scope.surveyingList[i].sublevel[j].name=='未签约'){
                                    $scope.surveyingList[i].sublevel[j].flag = true;
                                }else if($scope.surveyingList[i].sublevel[j].name=='已签约'){
                                    $scope.surveyingList[i].sublevel[j].flag = true;
                                }else{
                                    $scope.surveyingList[i].sublevel[j].flag = false;
                                }
                            })
                        }
                    }else{return false}
                })
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });
    }


    //非空判断
    $scope.saveflag = {
        basearea: false,
        areacount: false,
        level: false,
        nineabovearea: false,
        self: false,
        nrent: false
    }

    $scope.blurs = function (val, flag) {
        //基地面积
        if (flag == 'basearea') {
            !val ? $scope.saveflag.basearea = true : $scope.saveflag.basearea = false;
        }
        //房屋总面积
        if (flag == 'areacount') {
            !val ? $scope.saveflag.areacount = true : $scope.saveflag.areacount = false;
        }
        //层数
        if (flag == 'level') {
            !val ? $scope.saveflag.level = true : $scope.saveflag.level = false;
        }
        //9层以上面积
        if (flag == 'nineabovearea') {
            !val ? $scope.saveflag.nineabovearea = true : $scope.saveflag.nineabovearea = false;
        }
        //自住
        if (flag == 'self') {
            !val ? $scope.saveflag.self = true : $scope.saveflag.self = false;
        }
        //测绘未计内阳台
        // if(flag=='n.nrent'){
        //     !val?$scope.saveflag.n.nrent=true:$scope.saveflag.n.nrent=false;
        // }


    }

    

    //添加附件
    $scope.addannex=function(files,flag,idx){
        var fd = new FormData();
        var file=files[0];
        //$scope.filename = file.name;
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
            if(flag==99){//房屋图片
                $scope.housesImgAdd=$scope.data.filePath;
                $scope.housesName=$scope.data.fileName;
            }else if(flag==98){//附件
                $scope.attachments.push({filePath:$scope.data.filePath,fileName:$scope.data.fileName})
            }else{
               $scope.multilevelList[getIndex(idx)].arr[flag].imgUrl=$scope.data.filePath;
                // $scope.multilevelList[flag].imgUrlname=$scope.data.fileName;

            }
            $scope.size = $scope.data.size;
        }, function errorCallback(response) {
            alert(response);// 请求失败执行代码
        });
    }
    //删除附件
    $scope.deleteFile=function(i){
        $scope.attachments.splice(i,1);

    }
    //获得最外层的index
    function getIndex(i){
        for(var j=0;j<$scope.multilevelList.length;j++){
            if($scope.multilevelList[j].id==i){
               return j;
            }
        }
    }

    //添加测绘信息 初始化
    $scope.getsurveyinit = function () {
        server.server().surveyInit({
            roomId: $scope.roomId
        }, function (data) {
            if (data.result === true) {
                $scope.surveydata = data.data;
                $scope.multilevelList = $scope.surveydata.multilevelList;//多层数据
                $scope.saveObjs = [{basearea: '',areacount:'',level:'',surveyCode:'',surveyBuilding:'',buildingStructure:'',housingPurposes:''}]
                for (var i = 0; i < $scope.multilevelList.length; i++) {
                    $scope.multilevelList[i].dateclass=i;
                    $scope.multilevelList[i].myselecttype = '',
                        $scope.multilevelList[i].rentstatus = '',
                        $scope.multilevelList[i].marea = '',
                        $scope.multilevelList[i].mstatus = '',
                        $scope.multilevelList[i].imgUrl = '',
                        $scope.multilevelList[i].imgUrlname = '',
                        $scope.multilevelList[i].checkfalsetime = '',
                        $scope.multilevelList[i].surveyCode = '',

                        $scope.multilevelList[i].structure = '',
                        $scope.multilevelList[i].purpose = '',
                        $scope.multilevelList[i].arr=[{myselecttype:'',rentstatus:'',marea:'',mstatus:'',
                                                        imgUrl:'',imgUrlname:'',checkfalsetime:'',surveyCode : '',
                                                        isPicOr:'',isAreaOr:'',structure:'',purpose:''}];
                }
                $scope.notmultilevelList = $scope.surveydata.notSublevelList;//单层数据
                for (var i = 0; i < $scope.notmultilevelList.length; i++) {
                    $scope.notmultilevelList[i].nrent = '';
                }
                $scope.$apply();
                console.log($scope.saveObjs)
                $('.supperme').dialog(300);
            } else {
                alert(data.message);
            }
        });

    }
     var useobj = {basearea: '',areacount:'',level:'',surveyCode:'',surveyBuilding:'',buildingStructure:'',housingPurposes:''};
     
    // 加
    $scope.addsaveObjs=function(){
        if($scope.saveObjs.length>2){
            return;
        }
        $scope.saveObjs.push(Object.create(useobj))
    }
    // 减
    $scope.jiansaveObjs=function(){
        if($scope.saveObjs.length<2){
            return;
        }
        $scope.saveObjs.pop()
    }

   

    // 是否使用空地
    $scope.isBlankflag = false
    //新增保存测绘信息
    var singleJson = [];//单一测绘数据
    var chooseJson = [];//多选测绘数据
    // 新增保存
    $scope.savesurveydata = function () {
        $('.saveDisabled').attr('disabled','disabled');
        for (var i = 0; i < $scope.multilevelList.length; i++) {

            for(var j=0;j<$scope.multilevelList[i].arr.length;j++){
                if ($scope.multilevelList[i].arr[j].myselecttype != '') {
                    var chooseel = {
                        compensateFlag: '',
                        flag: '',
                        area: '',
                        rent: '',
                        rank: '',
                        imgUrl: '',
                        transgressTime: '',
                        surveyCode:'', //新增测绘栋号
                        structure:'', //临时建筑物结构
                        purpose:'' //临时建筑物用途
                    };
                    chooseel.compensateFlag = $scope.multilevelList[i].id;
                    chooseel.flag = $scope.multilevelList[i].arr[j].myselecttype;
                    chooseel.area = $scope.multilevelList[i].arr[j].marea;
                    chooseel.rank = $scope.multilevelList[i].arr[j].mstatus;
                    chooseel.rent = $scope.multilevelList[i].arr[j].rentstatus;
                    chooseel.imgUrl = $scope.multilevelList[i].arr[j].imgUrl;
                    chooseel.transgressTime = $scope.multilevelList[i].arr[j].checkfalsetime;
                    chooseel.surveyCode = $scope.multilevelList[i].arr[j].surveyCode;

                    chooseel.structure = $scope.multilevelList[i].arr[j].structure;
                    chooseel.purpose = $scope.multilevelList[i].arr[j].purpose;
                    chooseJson.push(chooseel);
                }
            }

        }
        //获取多选项的数组
        for (var i = 0; i < $scope.notmultilevelList.length; i++) {
            var single = {
                flag: '',
                val: ''
            }
            if ($scope.notmultilevelList[i].nrent != '') {
                single.flag = $scope.notmultilevelList[i].id;
                single.val = $scope.notmultilevelList[i].nrent?$scope.notmultilevelList[i].nrent:'';
                singleJson.push(single);
            }
        }//获取单选项的数组
        server.server().saveserveylist({
            roomId: $scope.roomId,

            areaOfBase: $scope.saveObjs[0].basearea,//基地面积
            grossArea: $scope.saveObjs[0].areacount,//房屋总面积
            numberOfPlies: $scope.saveObjs[0].level,//层数
            surveyCode:$scope.saveObjs[0].surveyCode,//测绘报告编号
            surveyBuilding:$scope.saveObjs[0].surveyBuilding,//测绘报告栋号
            buildingStructure:$scope.saveObjs[0].buildingStructure,//测绘报告编号
            housingPurposes:$scope.saveObjs[0].housingPurposes,//测绘报告编号

            areaOfBase1: $scope.saveObjs[1]?$scope.saveObjs[1].basearea:'',//基地面积
            grossArea1: $scope.saveObjs[1]?$scope.saveObjs[1].areacount:'',//房屋总面积
            numberOfPlies1: $scope.saveObjs[1]?$scope.saveObjs[1].level:'',//层数
            surveyCode1:$scope.saveObjs[1]?$scope.saveObjs[1].surveyCode:'',//测绘报告编号
            surveyBuilding1:$scope.saveObjs[1]?$scope.saveObjs[1].surveyBuilding:'',//测绘报告栋号
            buildingStructure1:$scope.saveObjs[1]?$scope.saveObjs[1].buildingStructure:'',//测绘报告编号
            housingPurposes1:$scope.saveObjs[1]?$scope.saveObjs[1].housingPurposes:'',//测绘报告编号

            areaOfBase2: $scope.saveObjs[2]?$scope.saveObjs[2].basearea:'',//基地面积
            grossArea2: $scope.saveObjs[2]?$scope.saveObjs[2].areacount:'',//房屋总面积
            numberOfPlies2: $scope.saveObjs[2]?$scope.saveObjs[2].level:'',//层数
            surveyCode2:$scope.saveObjs[2]?$scope.saveObjs[2].surveyCode:'',//测绘报告编号
            surveyBuilding2:$scope.saveObjs[2]?$scope.saveObjs[2].surveyBuilding:'',//测绘报告栋号
            buildingStructure2:$scope.saveObjs[2]?$scope.saveObjs[2].buildingStructure:'',//测绘报告编号
            housingPurposes2:$scope.saveObjs[2]?$scope.saveObjs[2].housingPurposes:'',//测绘报告编号

            housesImg: $scope.housesImgAdd,//房屋图片地址
            createUser: createUser,//用户id
            attachmentJson: JSON.stringify($scope.attachments),//附件数组
            singleJson: JSON.stringify(singleJson),
            chooseJson: JSON.stringify(chooseJson),
            isBlank:$scope.isBlankflag?1:0 //是否使用空地
        }, function (data) {
            if (data.result === true) {
                console.log(data.message);
                alert(data.message, function () {
                    surveyingInfo();
                    $('.supperme').hide();
                    chooseJson=[];
                    singleJson=[];
                    $('.saveDisabled').removeAttr('disabled');
                })
                $scope.$apply();
            } else {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                    chooseJson=[];
                    singleJson=[];
                });
            }
        }, function (err) {
            alert(err.message,function(){
                $('.saveDisabled').removeAttr('disabled');
                chooseJson=[];
                singleJson=[];
            });
        });

    }
    //修改初始化
    $scope.getupdateinit = function (id) {
        server.server().surveyupdateinit({
            id: id,
        }, function (data) {
            if (data.result === true) {
                
                $scope.notSublevelList = data.data.notSublevelList;//初始化单选项
                $scope.multilevelList = data.data.multilevelList;//初始化多选项
                $scope.dataMap = data.data.dataMap;//测绘数据主表数
                $scope.attachments=data.data.surveyAttachmentList;//附件初始化
                $scope.singleList = data.data.singleList;//修改单项初始化
                $scope.surveyList = data.data.surveyList;//修改多项初始化
                $scope.housesImgAdd= data.data.dataMap.housesImg//房屋图片
                $scope.code=data.data.code;
                $scope.address=data.data.address;

                $scope.isBlankflag = ($scope.dataMap.isBlank==1)?true:false//是否使用空地
                for (let i = 0; i < $scope.multilevelList.length; i++) {
                    $scope.multilevelList[i].dateclass = i;
                    //初始化arr
                    $scope.multilevelList[i].arr = [];
                    $scope.multilevelList[i].isPicOr=1;
                    $scope.multilevelList[i].isAreaOr=1;
                }
                $scope.saveObjs = [{//基础数据

                    basearea: $scope.dataMap.areaOfBase,
                    areacount: $scope.dataMap.grossArea,
                    level: $scope.dataMap.numberOfPlies,
                    surveyCode:$scope.dataMap.surveyCode,//测绘报告编号
                    surveyBuilding:$scope.dataMap.surveyBuilding,//测绘报告栋号
                    buildingStructure:$scope.dataMap.buildingStructure,//测绘报告编号
                    housingPurposes:$scope.dataMap.housingPurposes,//测绘报告编号
                },{

                    basearea: $scope.dataMap.areaOfBase1,
                    areacount: $scope.dataMap.grossArea1,
                    level: $scope.dataMap.numberOfPlies1,
                    surveyCode:$scope.dataMap.surveyCode1,//测绘报告编号
                    surveyBuilding:$scope.dataMap.surveyBuilding1,//测绘报告栋号
                    buildingStructure:$scope.dataMap.buildingStructure1,//测绘报告编号
                    housingPurposes:$scope.dataMap.housingPurposes1,//测绘报告编号
                },{
                    basearea: $scope.dataMap.areaOfBase2,
                    areacount: $scope.dataMap.grossArea2,
                    level: $scope.dataMap.numberOfPlies2,
                    surveyCode:$scope.dataMap.surveyCode2,//测绘报告编号
                    surveyBuilding:$scope.dataMap.surveyBuilding2,//测绘报告栋号
                    buildingStructure:$scope.dataMap.buildingStructure2,//测绘报告编号
                    housingPurposes:$scope.dataMap.housingPurposes2,//测绘报告编号
                    
                }]

                // 去除空对象
                for(let i = 0;i<$scope.saveObjs.length;i++){
                    let flag = 0,Key = 0;
                    for (let key in $scope.saveObjs[i]){
                        Key ++
                        if(!$scope.saveObjs[i][key]){
                            flag++
                        }
                    }
                    if(flag===Key){
                        $scope.saveObjs.splice(1,i);
                        i = 0;
                    }
                }
                if($scope.saveObjs.length<=0){
                    $scope.saveObjs.push(Object.create(useobj))
                }


                if($scope.singleList.length!=0){//单层数据
                    for (let i = 0; i < $scope.notSublevelList.length; i++) {
                        $scope.notSublevelList[i].nrent = '';
                        $scope.notSublevelList[i].dateclass = '';
                        for(let j = 0;j<$scope.singleList.length; j++){
                            if($scope.singleList[j].flag==$scope.notSublevelList[i].id){
                                $scope.notSublevelList[i].nrent = $scope.singleList[j].val;
                                $scope.notSublevelList[i].dateclass = i;
                               }
                        }
                    }
                }else{
                    for (var i = 0; i < $scope.notSublevelList.length; i++) {
                        $scope.notSublevelList[i].nrent = '';
                        $scope.notSublevelList[i].dateclass = '';
                    }
                }

                for (let k = 0; k < $scope.surveyList.length; k++) {//多层数据
                    for (let Q = 0; Q < $scope.multilevelList.length;Q++) {
                    if ($scope.multilevelList[Q].compensateName == $scope.surveyList[k].compensateName && $scope.surveyList[k].flag!='') {
                        $scope.multilevelList[Q].arr.push({
                            myselecttype:$scope.surveyList[k].flag,
                            rentstatus:$scope.surveyList[k].rent,
                            marea:$scope.surveyList[k].area,
                            mstatus:$scope.surveyList[k].rank,

                            structure :$scope.surveyList[k].structure,
                            purpose :$scope.surveyList[k].purpose ,

                            imgUrl:$scope.surveyList[k].imgUrl,
                            imgUrlname:'',
                            surveyCode:$scope.surveyList[k].surveyCode,
                            edittime:$scope.surveyList[k].transgressTime,
                            isPicOr:$scope.surveyList[k].imgUrl?2:1,
                            isAreaOr:$scope.surveyList[k].area?2:1
                        });
                        }

                    }
                }
                $scope.$apply();
                $('.update').dialog(300);
            } else {
                alert(data.message);
            }
        }, function (err) {
            alert(err.message);
        });
    }
    //保存测绘修改
    $scope.saveupdatesurvey = function () {
        $('.saveDisabled').attr('disabled','disabled');
        for (var i = 0; i < $scope.multilevelList.length; i++) {//获取多选项的数组

            for(var j=0;j<$scope.multilevelList[i].arr.length;j++){
                if ($scope.multilevelList[i].arr[j].myselecttype != '') {
                    var chooseel = {
                        compensateFlag: '',
                        flag: '',
                        area: '',
                        rent: '',
                        rank: '',
                        imgUrl: '',
                        transgressTime: '',
                        surveyCode:'' ,//新增测绘栋号
                        structure:'',
                        purpose :''
                    };
                    chooseel.compensateFlag = $scope.multilevelList[i].id;
                    chooseel.flag = $scope.multilevelList[i].arr[j].myselecttype;
                    chooseel.area = $scope.multilevelList[i].arr[j].marea;
                    chooseel.rank = $scope.multilevelList[i].arr[j].mstatus;
                    chooseel.rent = $scope.multilevelList[i].arr[j].rentstatus;

                    chooseel.structure = $scope.multilevelList[i].arr[j].structure;
                    chooseel.purpose = $scope.multilevelList[i].arr[j].purpose;

                    chooseel.imgUrl = $scope.multilevelList[i].arr[j].imgUrl;
                    chooseel.transgressTime = $scope.multilevelList[i].arr[j].edittime;
                    chooseel.surveyCode = $scope.multilevelList[i].arr[j].surveyCode;
                    chooseJson.push(chooseel);
                }
            }

        }

        for (var i = 0; i < $scope.notSublevelList.length; i++) {//获取单选项的数组
            var single = {
                flag: '',
                val: ''
            }
            if ($scope.notSublevelList[i].nrent) {
                single.flag = $scope.notSublevelList[i].id;
                single.val = $scope.notSublevelList[i].nrent;
                singleJson.push(single);
            }
        }
        server.server().saveupdatesurveylist({
            id: $scope.dataMap.id,
            roomId: $scope.roomId,

            areaOfBase: $scope.saveObjs[0].basearea,//基地面积
            grossArea: $scope.saveObjs[0].areacount,//房屋总面积
            numberOfPlies: $scope.saveObjs[0].level,//层数
            surveyCode:$scope.saveObjs[0].surveyCode,//测绘报告编号
            surveyBuilding:$scope.saveObjs[0].surveyBuilding,//测绘报告栋号
            buildingStructure:$scope.saveObjs[0].buildingStructure,//测绘报告编号
            housingPurposes:$scope.saveObjs[0].housingPurposes,//测绘报告编号

            areaOfBase1: $scope.saveObjs[1]?$scope.saveObjs[1].basearea:'',//基地面积
            grossArea1: $scope.saveObjs[1]?$scope.saveObjs[1].areacount:'',//房屋总面积
            numberOfPlies1: $scope.saveObjs[1]?$scope.saveObjs[1].level:'',//层数
            surveyCode1:$scope.saveObjs[1]?$scope.saveObjs[1].surveyCode:'',//测绘报告编号
            surveyBuilding1:$scope.saveObjs[1]?$scope.saveObjs[1].surveyBuilding:'',//测绘报告栋号
            buildingStructure1:$scope.saveObjs[1]?$scope.saveObjs[1].buildingStructure:'',//测绘报告编号
            housingPurposes1:$scope.saveObjs[1]?$scope.saveObjs[1].housingPurposes:'',//测绘报告编号

            areaOfBase2: $scope.saveObjs[2]?$scope.saveObjs[2].basearea:'',//基地面积
            grossArea2: $scope.saveObjs[2]?$scope.saveObjs[2].areacount:'',//房屋总面积
            numberOfPlies2: $scope.saveObjs[2]?$scope.saveObjs[2].level:'',//层数
            surveyCode2:$scope.saveObjs[2]?$scope.saveObjs[2].surveyCode:'',//测绘报告编号
            surveyBuilding2:$scope.saveObjs[2]?$scope.saveObjs[2].surveyBuilding:'',//测绘报告栋号
            buildingStructure2:$scope.saveObjs[2]?$scope.saveObjs[2].buildingStructure:'',//测绘报告编号
            housingPurposes2:$scope.saveObjs[2]?$scope.saveObjs[2].housingPurposes:'',//测绘报告编号


            
            housesImg: $scope.housesImgAdd,//房屋图片地址
            updateUser: createUser,//用户id
            attachmentJson: JSON.stringify($scope.attachments),//附件数组
            singleJson: JSON.stringify(singleJson),
            chooseJson: JSON.stringify(chooseJson),
            remarks:$scope.remarks?$scope.remarks:'',

            isBlank:$scope.isBlankflag?1:0 //是否使用空地
        }, function (data) {
            if (data.result === true) {
                console.log(data.message);
                alert(data.message, function () {
                    surveyingInfo();
                    $('.update').hide();
                    $('.editCause').hide();
                    chooseJson=[];
                    singleJson=[];
                    $('.saveDisabled').removeAttr('disabled');
                })
                $scope.$apply();
            } else {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                    chooseJson=[];
                    singleJson=[];
                });
            }
        }, function (err) {
            alert(err.message,function(){
                $('.saveDisabled').removeAttr('disabled');
                chooseJson=[];
                singleJson=[];
            });
        });
    }
    //原因取消
    $scope.causeCancel=function(){
        $scope.remarks='';
    }
    //取消
    $scope.cancel=function(){
        surveyingInfo();
        $('.saveDisabled').removeAttr('disabled');
    };
    //时间控件
    $scope.addTime=function (inputval,boxval,i,id) {
        $scope.multilevelList.forEach(function(items,i){//获得外层index
            if(items.id==id){
                $scope.idx=i;
            }
        })
        laydate.render({
            elem: '.'+inputval
            , type: 'date'
            , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
            , format: 'yyyy-MM-dd' //可任意组合
            , show: true //直接显示
            , closeStop: '.'+boxval //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            , done: value=>{
                    $scope.multilevelList[$scope.idx].arr[i].checkfalsetime=value;
                    console.log($scope.multilevelList[$scope.idx].arr[i].checkfalsetime);
                    $scope.multilevelList[$scope.idx].arr[i].edittime=value;

            }
        })
    }
    $scope.zjmIndex='';
    //通过子集来判断是否添加图片和清除数据
    $scope.picOrNor=function(item,typeId,id,index){
        $scope.multilevelList.forEach(function(items,i){//获得外层index
            if(items.id==id){
                $scope.idx=i;
            }
        })
        for(var key in item){
            if(item[key].id==typeId){
                $scope.multilevelList[$scope.idx].arr[index].isPicOr=item[key].isPicture;
                $scope.multilevelList[$scope.idx].arr[index].isAreaOr=item[key].isArea;
                //清除其余数据
                $scope.multilevelList[$scope.idx].arr[index].rentstatus='';
                $scope.multilevelList[$scope.idx].arr[index].marea='';
                $scope.multilevelList[$scope.idx].arr[index].mstatus='';
                $scope.multilevelList[$scope.idx].arr[index].imgUrl='';
                $scope.multilevelList[$scope.idx].arr[index].imgUrlname='';
                $scope.multilevelList[$scope.idx].arr[index].edittime='';
                
                $scope.multilevelList[$scope.idx].arr[index].structure='';
                $scope.multilevelList[$scope.idx].arr[index].purpose='';
                

            }
        }
        // for(var z=0;z<$scope.multilevelList[$scope.idx].arr.length;z++){
        //         if(z!=index&&typeId==$scope.multilevelList[$scope.idx].arr[z].myselecttype){
        //             alert('不能选择相同的类型');
        //             $scope.multilevelList[$scope.idx].arr[index].myselecttype='';
        //             return;
        //         }
        // }
        console.log($scope.multilevelList[$scope.idx].arr[index].isPicOr);
    }
    // $scope.isArea = '';
    // $scope.isstatus = '';
    $scope.changekey=function(indx,val){
        $scope.multilevelList[indx].detailsList.forEach(function(item,i){
            if($scope.multilevelList[indx].detailsList[i].id == val){
                $scope.isArea = $scope.multilevelList[indx].detailsList[i].isArea;
                $scope.isPictures = $scope.multilevelList[indx].detailsList[i].isPicture;
            }
        })
    }


    //增加层数
    $scope.addLevel=function(index){
        $scope.multilevelList[index].arr.push({rentstatus:'',marea:'',mstatus:'',imgUrl:'',imgUrlname:'',checkfalsetime:''});
    }
    //删除层数
    $scope.deleteArr=function(id,index){
        var mIdx='';
        $scope.multilevelList.forEach(function(items,i){//获得外层index
            if(items.id==id){
                mIdx=i;
            }
        })
        $scope.multilevelList[mIdx].arr.splice(index,1);
    }

}])
