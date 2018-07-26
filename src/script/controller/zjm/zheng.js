

angular.module('app').controller('examineCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
//选中导航
   
    $scope.projectId=$state.params.projectid;
    
    var userId = server.server().userId;  //用户id

    $scope.no = '/';

    $scope.clickflag = true;

    $scope.selectAll = true; //类型全部筛选
    $scope.isActive = true //7天一个月反选
    //页面切换
    $scope.bigTab=[
        {tab:true},
        {tab:false},
        {tab:false},
        {tab:false}
     ];
    //类型文字说明切换

    $scope.dayCount = '';//默认7天
    $scope.selected = []; //类型多选
    $scope.mode = '3';      //参与方式 123

    $scope.beginTime = ''; //开始时间
    $scope.endTime = '';    //结束时间

   
    $scope.PullUpShow=true;   //收起
    $scope.PullUpText='收起';
    //收起
    $scope.pullUp=function () {
        if($scope.PullUpShow){
            $scope.PullUpShow=false;
            $scope.PullUpText='展开';
        }else {
            $scope.PullUpShow=true;
            $scope.PullUpText='收起';
        }
    };
    //分页
    $scope.conf = {
        total : 0,  //共多少页
        currentPage : ($rootScope.paramsVal1 && $rootScope.paramstype)?$rootScope.paramsVal1.pageNo:1,  //默认第一页
        itemPageLimit : 10, //一页多少条
        isSelectPage : false,
        isLinkPage : false
    }

    // ajax传值=
    $scope.param={
        userId:userId,	            //当前用户的id	是
        projectId:$scope.projectId,
        type:$scope.selected.join(',')||'',	            //类型	id
        mode:$scope.mode||'',	            //筛选条件是我审批	否	默认值1 2
        dateOne:$scope.beginTime||'',	            //筛选条件第一个时间	否
        dateTwo:$scope.endTime||'',	            //筛选条件第二个时间	否
        other:$scope.dayCount||'',//近七天或者近一个月	否	1：近7天2：近一个月
        pageNo: $scope.conf.currentPage || 1,
        pageSize: $scope.conf.itemPageLimit|| 10,
        searchKeys:$scope.searchKeys
    }



    //查询出物业名字和物业个数
    function titleajax(){
        new Promise((resolve,reject)=>{
            server.server().projectnamesel({
                projectId: $scope.projectId
            }, function (data) {
                if (data.result === true) {
                    $scope.projectname = data.data.projectName;
                    $scope.number=data.data.number;
                    $scope.$apply();
                    resolve(data.data)
                } else {
                    alert(data.message)
                }
            })
        })

        return Promise
    }

    //类型筛选列表 type 传id
    function initinput(type){
        new Promise((resolve,reject)=>{
            server.server().approvalformConditions({
                type:type||1
            }, (data) =>{
                if (data.result) {
                    $scope.dataCheckbox=data.data.nodeTypes;
                    $scope.dataCheckbox.forEach((item,i)=>{
                        $scope.dataCheckbox[i].state = false;
                    })
                    resolve(data.data)
                    $scope.$apply();
                } else {
                    alert(data.message)
                }
            })
        })
        return Promise
    }

    Promise
        .all([titleajax(), initinput(1)])
        .then(results=>results,err=>err);


    
    //分页
    $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys' , function(news){
        $scope.param.searchKeys=$scope.searchKeys;
        console.log($scope.param)
        if($rootScope.paramsVal1 && $rootScope.paramstype){
            $scope.param = $rootScope.paramsVal1;
            
            $scope.bigTab=[
                {tab:false},
                {tab:false},
                {tab:false},
                {tab:false}
            ];
            $scope.bigTab[Number($rootScope.paramstype)-1].tab = true;
            if($scope.bigTab[0].tab){serv($scope.param);$rootScope.paramsVal1 = '';}
            if($scope.bigTab[1].tab){servfalse($scope.param);$rootScope.paramsVal1 = '';}
            if($scope.bigTab[2].tab){servthree($scope.param);$rootScope.paramsVal1 = '';}
            if($scope.bigTab[3].tab){servfour($scope.param);$rootScope.paramsVal1 = '';}
        }else{
            $scope.param.pageNo = $scope.conf.currentPage;
            if($scope.bigTab[0].tab){serv($scope.param)}
            if($scope.bigTab[1].tab){servfalse($scope.param)}
            if($scope.bigTab[2].tab){servthree($scope.param)}
            if($scope.bigTab[3].tab){servfour($scope.param)}
        }

    })

    




    //第一个列表
    function serv(params) {
        $scope.firstSelectAll = false; //全选
        $scope.allzhengfalg = true;  //审批按钮
        $scope.examineName = '审批列表';
        $scope.examineLength =0;
        $scope.conf.counts = 0;
        $scope.pageflag = false;
        server.server().approvallist(params, function (data) {
            if (data.result) {
                // 定义一个数组
                if(data.data.rows){
                    let m = 0;
                    $scope.propertys = data.data.rows;
                    $scope.examineLength = data.data.total||0;
                    $scope.propertys.forEach(function(item,i){
                        $scope.propertys[i].firstChildstate = false;
                        if($scope.propertys[i].is_done!==1){
                            m++;
                        }
                    })
                    $scope.propertys.length===m
                        ?$scope.firstParentState = true
                        :$scope.firstParentState = false
                    //共多少页
                    $scope.pageflag = true;
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    $scope.conf.counts = data.data.total;
                    
                    $scope.$broadcast("categoryLoaded");
                    $scope.$apply()
                }
            } else {
                alert(data.message)
            }
        })
    }
    //总的
    $scope.firstParentSelectionAll=function(check,arr){
        console.log(check)
        if(check){
            arr.forEach(function(item,i){
                if(arr[i].is_done=='1'){
                    arr[i].firstChildstate = true;
                }
            })
        }else{
            var child=0;
            arr.forEach(function(item,i){
                if(arr[i].is_done=='1'){
                    if(arr[i].firstChildstate===false){
                        child = 1;
                    }
                }
            });
            // if(child===1){
            //     $scope.firstSelectAll = true;
            // }

        }
    }
    //小组的
    $scope.firstchildSelection=function(val,indx,arr){
        if(val){
            var parent=0;
            arr.forEach(function(item,i){
                if(arr[i].is_done=='1'){
                    if(arr[i].firstChildstate===false){
                        parent = 1;
                    }
                }
            })
            if(parent===0){
                $scope.firstSelectAll = true;
            }else{
                $scope.firstSelectAll = false;
            }
        }else{
            $scope.firstSelectAll = false;
        }
        // else{
        //     var parent=0;
        //     arr.forEach(function(item,i){
        //         if(arr[i].is_done=='1'){
        //             if(arr[i].firstChildstate===false){
        //                 parent = 1;
        //             }
        //         }
        //     })
        //     if(parent===1){
        //         arr[indx].firstChildstate = true;
        //         $scope.firstSelectAll = false;
        //     }
        // }
    }

    //一键审批
    $scope.Allexamine=function(){

        if($scope.bigTab[0].tab){
            choose($scope.propertys,0)
        }else if($scope.bigTab[1].tab){
            choose($scope.waterRows,1)
        }else if($scope.bigTab[2].tab){
            choose($scope.threeList,2)
        }else if($scope.bigTab[3].tab) {
            choose($scope.fourList, 3)
        }

    }

    function choose(arr,flag){
        $scope.approveId = [];
        if($scope.firstSelectAll){
            arr.forEach(function(item,i){
                if(arr[i].is_done=='1'){
                    $scope.approveId.push(arr[i].id)
                }
            })
        }else{
            arr.forEach(function(item,i){
                if(arr[i].firstChildstate){
                    $scope.approveId.push(arr[i].id)
                }
            });
            if($scope.approveId.length<=0){
                alert('请选择审批列表')
                return;
            }
        }
        if($scope.clickflag){
            examineAjax($scope.approveId,flag)
        }
    }

    function examineAjax(approveId,flag){
        $scope.clickflag = false;
        dict.timeouts($scope.clickflag,3000,function(clickflag){
            $scope.clickflag = clickflag
        })

        // 支付审批
        if(flag===1){
            server.server().zjapprovalformfincialThroghdo({
                approvalId:approveId.join(',')||'',	    //审批数据的id	是
                userId:userId,	        //当前的审批用户的id	是
                remakers:'',	    //审批的备注信息	是
                type:1,
                fincialIds:''
            }, function (data) {
                if (data.result) {
                    // $scope.approveId=true;
                    alert(data.message,()=>{
                        servfalse($scope.param)
                    })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            });
        }else{
            server.server().zjapprovalformthroghdo({
                approvalFormId:approveId.join(',')||'',	    //审批数据的id	是
                currentUser:userId,	        //当前的审批用户的id	是
                examineRemarks:''	    //审批的备注信息	是
            }, function (data) {
                if (data.result) {
                    // $scope.approveId=true;
                    alert(data.message,()=>{
                        if(flag===0){
                            serv($scope.param)
                        }else if(flag===2){
                            servthree($scope.param)
                        }else if(flag===3){
                            servfour($scope.param)
                        }
                    })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            });
        }
        
    }


    //2222财务支付 佣金方案审批列表
    function servfalse(params) {
        $scope.firstSelectAll = false; //全选
        $scope.allzhengfalg = false;  //审批按钮
        $scope.examineName = '支付审批';
        $scope.examineLength = 0;
        $scope.conf.counts = 0;
        $scope.pageflag = false;
        server.server().zjapprovalformfincialColsListdo(params, function (data) {
            if (data.result) {
                // 定义一个数组
                if(data.data.rows){
                    $scope.waterRows = data.data.rows;
                        $scope.examineLength = data.data.total||0;
                        let m = 0;
                        $scope.waterRows.forEach((itemm,i)=>{
                            $scope.waterRows[i].examineSeris = '第'+($scope.waterRows[i].examineSeris)+'阶段';
                            $scope.waterRows[i].firstChildstate = false;
                            if($scope.waterRows[i].is_done!==1){
                                m++;
                            }
                        })
                    $scope.waterRows.length===m
                        ?$scope.firstParentState = true
                        :$scope.firstParentState = false;
                    //共多少页
                    $scope.pageflag = true;
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    $scope.conf.counts = data.data.total;
                    $scope.$broadcast("categoryLoaded");
                    $scope.$apply()
                }
            } else {
                alert(data.message)
            }
        })
    }

    //3333规则跳转
    function servthree(params) {
        $scope.firstSelectAll = false; //全选
        $scope.allzhengfalg = true;  //审批按钮
        $scope.examineName = '规则审批';
        $scope.examineLength = 0;
        $scope.conf.counts = 0;
        $scope.pageflag = false;
        server.server().zjapprovalformfindRulesListdo(params, function (data) {
            if (data.result) {
                // 定义一个数组
                if(data.data.rows){
                    $scope.threeList = data.data.rows;
                    let m = 0;
                    $scope.examineLength = data.data.total||0;
                    $scope.threeList.forEach((itemm,i)=>{
                        $scope.threeList[i].examineSeris = '第'+($scope.threeList[i].examineSeris)+'阶段';
                        $scope.threeList[i].firstChildstate = false;
                        if($scope.threeList[i].is_done!==1){
                            m++;
                        }
                    })
                    $scope.threeList.length===m
                        ?$scope.firstParentState = true
                        :$scope.firstParentState = false;
                    //共多少页
                    $scope.pageflag = true;
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    $scope.conf.counts = data.data.total;
                    $scope.$broadcast("categoryLoaded");
                    $scope.$apply()
                }
            } else {
                alert(data.message)
            }
        })
    }
    //4444规则跳转
    function servfour(params) {
        $scope.firstSelectAll = false; //全选
        $scope.allzhengfalg = true;  //审批按钮
        $scope.examineName = '项目审核';
        $scope.examineLength = 0;
        $scope.conf.counts = 0;
        $scope.pageflag = false;
        server.server().zjapprovalformfindProjectdo(params, function (data) {
            if (data.result) {
                // 定义一个数组
                if(data.data.rows){
                    let m = 0;
                    $scope.fourList = data.data.rows;
                    $scope.examineLength = data.data.total||0;
                    $scope.fourList.forEach((itemm,i)=>{
                        $scope.fourList[i].examineSeris = '第'+($scope.fourList[i].examineSeris)+'阶段';
                        $scope.fourList[i].firstChildstate = false;
                        if($scope.fourList[i].is_done!==1){
                            m++;
                        }
                    })
                    $scope.fourList.length===m
                        ?$scope.firstParentState = true
                        :$scope.firstParentState = false;
                    //共多少页
                    $scope.pageflag = true;
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    $scope.conf.counts = data.data.total;
                   
                    $scope.$broadcast("categoryLoaded");
                    $scope.$apply()
                }
            } else {
                alert(data.message)
            }
        })
    }

    //类型个选
    $scope.updateSelection = function (eve, id, state) {
        var checkbox = eve.target;
        var checked = checkbox.checked;
        if (checked) {
            $scope.selected.push(id);
        } else {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
        }
        //子元素一个都没选，就选则全部                        //选中单个后，取消全选，
        $scope.selected.length === 0 ? $scope.selectAll = true : $scope.selectAll = false;

        $scope.param.type=$scope.selected.join(',');
        if($scope.bigTab[0].tab){serv($scope.param)}
        if($scope.bigTab[1].tab){servfalse($scope.param)}
        if($scope.bigTab[2].tab){servthree($scope.param)}
        if($scope.bigTab[3].tab){servfour($scope.param)}
    }

    //全选
    $scope.checkobxAll = function (m, n) {
        //取消全选，如果子元素都求没有选则，就不能取消全选
        if (m === false) {
            if ($scope.selected.length === 0) {
                $scope.selectAll = true;
            }
        }
        //全选后数组空，子元素取消选则
        if (m === true) {
            $scope.selected = [];
            for (var i = 0; i < $scope.dataCheckbox.length; i++) {
                $scope.dataCheckbox[i].state = false;
            }
        }
        $scope.param.type=$scope.selected.join(',');
        if($scope.bigTab[0].tab){serv($scope.param)}
        if($scope.bigTab[1].tab){servfalse($scope.param)}
        if($scope.bigTab[2].tab){servthree($scope.param)}
        if($scope.bigTab[3].tab){servfour($scope.param)}
    }

    //radios
    $scope.radios=function(val){
        $scope.param.mode = val;
        if($scope.bigTab[0].tab){serv($scope.param)}
        if($scope.bigTab[1].tab){servfalse($scope.param)}
        if($scope.bigTab[2].tab){servthree($scope.param)}
        if($scope.bigTab[3].tab){servfour($scope.param)}
    }

    //7天 一个月筛选
    $scope.isActive = false;
    $scope.isActive2 = false;
    $scope.monthData=function(val){
        $('.childData1').val('');
        $('.childData2').val('');
        val==1
                ?($scope.isActive = !$scope.isActive
                    ,$scope.isActive
                        ?($scope.isActive2 = false,$scope.dayCount=1)
                        :$scope.dayCount = ''
                )
                :($scope.isActive2 = !$scope.isActive2
                    ,$scope.isActive2
                        ?($scope.isActive = false,$scope.dayCount=2)
                        :$scope.dayCount = ''
                )
        $scope.param.other=$scope.dayCount;
        $scope.param.dateOne = ''
        ;$scope.param.dateTwo = ''
        if($scope.bigTab[0].tab){serv($scope.param)}
        if($scope.bigTab[1].tab){servfalse($scope.param)}
        if($scope.bigTab[2].tab){servthree($scope.param)}
        if($scope.bigTab[3].tab){servfour($scope.param)}
    }

    //star时间筛选
    function runAsync1(inputval,boxval,flag,callback){
        laydate.render({
            elem: '.'+inputval
            , type: 'date'
            // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
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
            // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
            , format: 'yyyy-MM-dd' //可任意组合
            , show: true //直接显示
            , closeStop: '.'+boxval //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            , done: value=>{
                callback(value)
            }
        });
    }

    // end时间调接口筛选
    $scope.alertData=function(child,parent,flag){
        if(flag===1){
            runAsync1(child,parent)
        }else{
            !$scope.beginTime
                ?(alert('请选择开始时间'))
                :runAsync2(child,parent,$scope.beginTime,value=>{
                    if(value){
                            ;$scope.beginTime = $scope.beginTime.toString()
                            ;$scope.endTime = value.toString()
                            ;$scope.param.dateOne = $scope.beginTime
                            ;$scope.param.dateTwo = $scope.endTime
                            ;$scope.param.other = ''

                            ;if($scope.bigTab[0].tab){serv($scope.param)}
                            ;if($scope.bigTab[1].tab){servfalse($scope.param)}
                            ;if($scope.bigTab[2].tab){servthree($scope.param)}
                            ;if($scope.bigTab[3].tab){servfour($scope.param)}
                    }else{
                        alert('请选择结束时间')
                    }
                })
        }
    }

    //审批列表
    $scope.wholeApproval=function(){
        $scope.selectAll = true; //类型全部
        $scope.selected = []; //多选类型id
        $scope.mode = 3;      //单选
        $scope.dayCount = '';//默认7天
        $scope.beginTime = ''; //开始时间
        $scope.endTime = '';    //结束时间
        $scope.conf.currentPage = 1;//分页
        $scope.bigTab=[
            {tab:true},
            {tab:false},
            {tab:false},
            {tab:false}
        ];
        serv($scope.param)
        initinput(1)
    }
    //支付待审批waterApprovalthree
    $scope.waterApproval=function(){
        $scope.selectAll = true; //类型全部
        $scope.selected = []; //多选类型id
        $scope.mode = 3;      //单选
        $scope.dayCount = '';//默认7天
        $scope.beginTime = ''; //开始时间
        $scope.endTime = '';    //结束时间
        $scope.conf.currentPage = 1;//分页
        $scope.bigTab=[
            {tab:false},
            {tab:true},
            {tab:false},
            {tab:false}
        ];
        servfalse($scope.param)
        initinput(2)
    }
    //规则审批
    $scope.waterApprovalthree=function(){
        $scope.selectAll = true; //类型全部
        $scope.selected = []; //多选类型id
        $scope.mode = 3;      //单选
        $scope.dayCount = '';//默认7天
        $scope.beginTime = ''; //开始时间
        $scope.endTime = '';    //结束时间
        $scope.conf.currentPage = 1;//分页
        $scope.bigTab=[
            {tab:false},
            {tab:false},
            {tab:true},
            {tab:false}
        ];
        servthree($scope.param)
        initinput(3)
    }

    $scope.waterApprovalfour=function(){
        $scope.selectAll = true; //类型全部
        $scope.selected = []; //多选类型id
        $scope.mode = 3;      //单选
        $scope.dayCount = '';//默认7天
        $scope.beginTime = ''; //开始时间
        $scope.endTime = '';    //结束时间
        $scope.conf.currentPage = 1;//分页
        $scope.bigTab=[
            {tab:false},
            {tab:false},
            {tab:false},
            {tab:true}
        ];
        servfour($scope.param)
        initinput(4)
    }

    /*address:"河北省石家庄市井陉矿区432"
    coontment:"财务结算规则新建审批"
    createtime:1514187377000
    examineSeris:"第2阶段"
    examineStatus:"审核中"
    id:"0514530bf1d14a5a9c327258d1b683cc"
    is_done:0
    name:"财务结算设置审核"
    projectName:"康康"
    subjectId:"4d819f55eeb9485582951c46c985bf80"
    type:700

    address:"542"
    category:"集中厂房"
    commerceArea:0
    coontment:"测绘数据添加"
    grossArea:4544
    holderName:"543"
    houseArea:"0"
    id:"337a265f24344cafa06f5fca4a1a9f8b"
    interimArea:0
    is_done:0
    name:"测绘数据审核"
    placeOrigin:"45"
    propertyId:"87d8244d1dc148acb934cd02f9ea97b2"
    rank:1
    splitJointName:"1栋1座1层"
    status:"审核中"
    type:600
    violateArea:0*/

    // address:"内蒙古自治区乌海市海勃湾区21"
    // coontment:"项目删除审批"
    // createtime:1514171181000
    // examineSeris:"第2阶段"
    // examineStatus:"审核中"
    // id:"53f6660ae1ab49fe968776a7f3fa2c57"
    // is_done:0
    // name:"项目新建审核"
    // projectName:"5555"
    // subjectId:"4a1e7b6204d0458fbf684bebf761f165"
    // type:100

    //审批列表跳转
    $scope.typeLocation =function(indx,flag){
        // $rootScope.paramsVal();
        $rootScope.paramsVal1 = $scope.param;
        $rootScope.paramstype = flag
        // var storage=window.localStorage;
        //     storage.setItem("b",usename);
        // return;
        if(flag=='2'){  //支付审批   //压金
            let appid = $scope.waterRows[indx].id;
            let number = $scope.waterRows[indx].type;
            let flags = $scope.waterRows[indx].is_done;
            var status = $scope.waterRows[indx].statusValue;
            var pactId = $scope.waterRows[indx].pactId;
            var updateStatus = $scope.waterRows[indx].updateStatus;
            $state.go('commissionPayment',{projectid:$scope.projectId,roomId:'',approveId:appid,number:number,flag:flags,updateStatus:updateStatus})
        }else{
            if(flag=='3'){
                var appid = $scope.threeList[indx].id;
                var rommId = $scope.threeList[indx].subjectId;
                var number = $scope.threeList[indx].type;
                var flags = $scope.threeList[indx].is_done;
                var status = $scope.threeList[indx].statusValue;
                var pactId = $scope.threeList[indx].pactId;
                var updateStatus = $scope.threeList[indx].updateStatus;
            }else if(flag=='4'){
                var appid = $scope.fourList[indx].id;
                var rommId = $scope.fourList[indx].propertyId;
                var number = $scope.fourList[indx].type;
                var flags = $scope.fourList[indx].is_done;
                var status = $scope.fourList[indx].statusValue;
                var pactId = $scope.fourList[indx].pactId;
                var updateStatus = $scope.fourList[indx].updateStatus;
            }
            else{
                var appid = $scope.propertys[indx].id;
                var rommId = $scope.propertys[indx].propertyId;
                var number = $scope.propertys[indx].type;
                var flags = $scope.propertys[indx].is_done;
                var status = $scope.propertys[indx].statusValue;
                var pactId = $scope.propertys[indx].pactId;
                var updateStatus = $scope.propertys[indx].updateStatus;
            }
            switch(number){
                case 100:
                    //项目
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 200:
                    // 拆迁补偿规则
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 300:
                    // 签约佣金规则
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 400:
                    // 综合业务佣金规则
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 500:
                    // 违建佣金规则
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                    // 测绘信息
                case 600:
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 700:
                    // 财务结算设置
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 800:
                    // 补偿方案
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 900:
                    // 收款人信息变更
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 1000:
                    //收款信息
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 1100:
                    // 合同审批
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 1200:
                    //合同模板审批
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 1400:
                    // 佣金信息审批(查违)
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 1600:
                    // 拆迁补偿规则 一级删除(总删)
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    break
                case 1700:
                    // 删除物业信息
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                break
                default:
                    // 拆迁补偿规则
                    $state.go('surveyingMapping',{projectid:$scope.projectId,roomId:rommId,approveId:appid,number:number,flag:flags,status:status,pactId:pactId,updateStatus:updateStatus})
                    
                //     case 1400:
                //         $state.go('查违信息审批(添加)',{projectid:$scope.projectId,roomId:$scope.propertys[indx].id})
                //         break
            }
        }






    }


}])
    .controller('examineExaminationCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        $scope.approvalId=$state.params.approvalId;
        $scope.param={
            approvalId:$scope.approvalId,
            projectId:$scope.projectId
        };
        server.server().approvalformDetail($scope.param, function (data) {
            if (data.result === true) {
                $scope.approval=data.data;
                console.log($scope.approval.roomMsg.address);
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });




    }])
    //财务管理
    .controller('financeCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        //选中导航
        
        var userId=server.server().userId;
        $scope.projectId=$state.params.projectid;
        $scope.hostName=server.server().imgHost;
        //获取财务管理搜索条件
        $scope.myscrol=true;
        $scope.scrolldiv=function(){
            $scope.myscrol=!$scope.myscrol;
        }
        // 补偿款项目id
        server.server().searchCriterialist({
            projectId:$scope.projectId,
        }, function (data) {
            if (data.result === true) {
                $scope.criterialist=data.data;
                for (var i = 0; i < $scope.criterialist.length; i++) {
                    $scope.criterialist[i].state = false;
                }
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });

        //设置收/付款状态数组，并且组成数组
        $scope.paylist=[
            {
                id:'0',
                name:'未支付',
                state:false
            },
            {
                id:'1',
                name:'已支付',
                state:false
            }
        ]
        //判断补偿项目是否被选中，并且组成数组

        // var sel=[], check=[];
        // var Regx = /^[0-9]*$/;
        

        // 补偿款项目：全部
        $scope.selectall = true;
        $scope.payselectall = true;
        $scope.selected = [];
        $scope.payselected = [];
        //单选
        $scope.updateSelection = function(indexs,val,flag,arr){

            
            if(flag==1){
                $scope.selected=[]
                $scope.selectall = false;
            }else{
                $scope.payselected=[]
                $scope.payselectall = false;
            }
            if(val){
                let m = 0;
                arr.forEach(function(item,index){
                    if(arr[index].state){
                        m++;
                    }
                })
                if(m==arr.length){
                    if(flag==1){
                        $scope.selectall = true;
                    }else{
                        $scope.payselected = true;
                    }
                    
                }
            }else{
                let n = 0;
                arr.forEach(function(item,index){
                    if(!arr[index].state){
                        n++;
                    }
                })
                if(n==arr.length){
                    arr[indexs].state = true;
                }
            }
            // 请求接口
            if(flag==1&&!$scope.selectall){
                arr.forEach(function(item,index){
                    if(arr[index].state){
                            $scope.selected.push(arr[index].id)
                    }
                })
            }
            if(flag==2&&!!$scope.payselected){
                arr.forEach(function(item,index){
                    if(arr[index].state){
                            $scope.payselected.push(arr[index].id)
                    }
                })
            }



            $scope.selected=$scope.selected.toString();
            $scope.payselected=$scope.payselected.toString();
            console.log($scope.paylist)

            financeinit($scope.selected,$scope.payselected,$scope.starttime,$scope.endtime,$scope.type,$scope.exporttype)
        }

        //全选
        $scope.checktall = function(val,flag,arr){
            $scope.selected='';
            if(val){
                arr.forEach(function(item,index){
                    item.state = false;
                })
            }else{
                if(flag==1){
                    $scope.selectall = true;
                }else{
                    $scope.payselected = true;
                }
            }
            if(flag==1){
                $scope.selected='';
            }else{
                $scope.payselected = '';
            }

            financeinit($scope.selected,$scope.payselected,$scope.starttime,$scope.endtime,$scope.type,$scope.exporttype)
        }

        //时间控件
        $scope.mychange=function(val,sel,check,endtime,exporttype) {
            laydate.render({
                elem: '.test1'
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.test2' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    $scope.starttime=val;
                    financeinit(sel,check,$scope.starttime,endtime,$scope.type,exporttype)
                }

            });

        }
        //时间控件 至
        $scope.mychange2=function(val,sel,check,starttime,exporttype){
            laydate.render({
                elem: '.test3'
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                ,format: 'yyyy-MM-dd' //可任意组合
                ,show: true //直接显示
                ,closeStop: '.test4' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    $scope.endtime=val;
                    financeinit(sel,check,starttime,$scope.endtime,$scope.type,exporttype)
                }
            });
        }
        $scope.flag=false;
        $scope.flag2=false;
        $scope.type='';
        //选择七天
        $scope.seven=function($event,selected,payselected,starttime,endtime,exporttype){
            if($scope.type==1){
                $scope.type=''
            }else{
                $scope.type=1
            }
            $scope.flag=!$scope.flag;
            $scope.flag2=false;
            //$event.target.addClass('.visited');
            // $scope.type='1';
            financeinit(selected,payselected,starttime,endtime,$scope.type,exporttype)
        }
        //选择一个月
        $scope.month=function($event,selected,payselected,starttime,endtime,exporttype){
            if($scope.type==2){
                $scope.type=''
            }else{
                $scope.type=2
            }
            $scope.flag=false;
            $scope.flag2=!$scope.flag2;
            // $scope.type='2'
            financeinit(selected,payselected,starttime,endtime,$scope.type,exporttype)
        }

        //分页
        $scope.no = '/';
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+ppnameinput', function (news) {
            financeinit($scope.selected,$scope.payselected,$scope.starttime,$scope.endtime,$scope.type,$scope.exporttype);
        })
        function financeinit(selected,payselected,starttime,endtime,type,exporttype){
            //console.log(selected,payselected)
            server.server().criterialist({
                projectId:$scope.projectId,
                pageNo: $scope.conf.currentPage,
                pageSize: $scope.conf.itemPageLimit,
                searchKeys:$scope.ppnameinput?$scope.ppnameinput:'',
                financeId:selected?selected:'',
                paymentStatus:payselected?payselected:'',
                beginTime:starttime?starttime:'',
                endTime:endtime?endtime:'',
                type:type?type:'',
                exportType:exporttype,
                paymentType:1
            }, function (data) {
                if (data.result === true) {
                    $scope.list = data.data.rows;

                    for(var i=0;i<$scope.list.length;i++){
                        if($scope.list[i].paymentStatus==0){
                            $scope.list[i].payment='未支付';
                        }else if($scope.list[i].paymentStatus==1){
                            $scope.list[i].payment='已支付';
                        }else if($scope.list[i].paymentStatus==2){
                            $scope.list[i].payment='截留';
                        }else if($scope.list[i].paymentStatus==3){
                            $scope.list[i].payment='未收款';
                        }else if($scope.list[i].paymentStatus==3){
                            $scope.list[i].payment='已收款';
                        }
                    }
                    // console.log($scope.rows);

                    //多少页
                    $scope.conf.total = data.data.pageCount;

                    // $scope.conf.total = data.data.total/data.data.pageSize;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");
                } else {
                    alert(data.message);
                }
            })
        }

        //批量操作
        var batch=[];
        $scope.batchselect=function($event,id){
            $scope.batchChecked=false;

        }
        //批量支付 全选
        $scope.batchAll=function($event){
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                for(var i=0;i<$scope.list.length;i++){
                    $scope.list[i].checked=true;
                }
            }else{
                for(var i=0;i<$scope.list.length;i++){
                    $scope.list[i].checked=false;
                }
            }

        }
        //批量申请支付操作
        $scope.payapply=function(){
            $('.saveDisabled').attr('disabled','disabled');
            for(var i=0;i<$scope.list.length;i++){
                if($scope.list[i].checked==true&&$scope.list[i].examineStatus==0||$scope.list[i].examineStatus==2){
                    batch.push($scope.list[i].id);
                }
            }
            server.server().payapplylist({
                paymentId:batch.toString(),
                userId:userId
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        financeinit();
                        $scope.batchChecked=false;
                        batch=[];
                        $('.saveDisabled').removeAttr('disabled');
                    });

                    $scope.$apply();
                } else {
                    alert(data.message,function(){
                        $('.saveDisabled').removeAttr('disabled');
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                });
            });
        }
        //导出所有
        $scope.exporttype='';
        $scope.export=function(selected,payselected,starttime,endtime,type){
            $scope.exporttype='1';
            // financeinit(selected,payselected,starttime,endtime,type,$scope.exporttype);
            $scope.exporttypeUrl=$scope.hostName+'payment/queryFinanceList.do?'+'projectId='+$scope.projectId+'&pageNo='+$scope.conf.currentPage+'&pageSize='+$scope.conf.itemPageLimit+'&searchKeys='+($scope.ppnameinput?$scope.ppnameinput:'')+'&financeId='+(selected?selected:'')+'&paymentStatus='+(payselected?payselected:'')+'&beginTime='+(starttime?starttime:'')+'&endTime='+(endtime?endtime:'')+'&type='+(type?type:'')+'&exportType='+$scope.exporttype+'&paymentType=1';
            $scope.exporttype='';

        }
        //申请单个支付
        $scope.paySingle=function(id){
            server.server().payapplylist({
                paymentId:id,
                userId:userId
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        financeinit()
                    });
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
    }])
    //延迟支付补偿
    .controller('delayfinanceCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        //选中导航
        let timed=setInterval(function(){
            if($('.l-nav>li').length>0)
            {
                $('.l-nav>li').eq(7).addClass('cur');
                clearInterval(timed)
            }
        },10)
        var userId=server.server().userId;
        $scope.projectId=$state.params.projectid;
        $scope.hostName=server.server().imgHost;
        //获取财务管理搜索条件
        $scope.myscrol=true;
        $scope.scrolldiv=function(){
            $scope.myscrol=!$scope.myscrol;
        }
        server.server().searchCriterialist({
            projectId:$scope.projectId,
        }, function (data) {
            if (data.result === true) {
                $scope.criterialist=data.data;
                for (var i = 0; i < $scope.criterialist.length; i++) {
                    $scope.criterialist[i].state = false;
                }
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });

        //设置收/付款状态数组，并且组成数组
        $scope.paylist=[
            {
                id:0,
                name:'未支付',
                state:false
            },
            {
                id:1,
                name:'已支付',
                state:false
            }
            // {
            //     id:2,
            //     name:'截留',
            //     state:false
            // }
        ]
        //判断补偿项目是否被选中，并且组成数组

        var sel=[], check=[];
        var Regx = /^[0-9]*$/;
        $scope.selected='';
        $scope.payselected='';
        // 单选
        $scope.updateSelection=function($event,id,starttime,endtime,type,exporttype){

            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                if(Regx.test(id)){
                    check.push(id);
                    $scope.payselected=check.toString();

                }else{
                    sel.push(id);
                    $scope.selected=sel.toString();

                }
            }else{
                if(Regx.test(id)){
                    var indx = check.indexOf(id);
                    check.splice(indx,1);
                    $scope.payselected=check.toString();

                }else{
                    var idx = sel.indexOf(id);
                    sel.splice(idx,1);
                    $scope.selected=sel.toString();

                }
            }
            $scope.selected.length === 0 ? $scope.selectall = true : $scope.selectall = false;
            $scope.payselected.length === 0 ? $scope.payselectall = true : $scope.payselectall = false;
            financeinit($scope.selected,$scope.payselected,starttime,endtime,type,exporttype)
        }




        //全选
        $scope.selectall=true;
        $scope.payselectall=true;

        $scope.checktall=function(m,n,data,starttime,endtime,type,exporttype){
            console.log(data);
            //取消全选，如果子元素都求没有选则，就不能取消全选
            if (m === false) {
                if ($scope.selected.length=== 0 ) {
                    $scope.selectall = true;

                }
                if($scope.payselected.length===0){
                    $scope.payselectall=true;
                }
            }
            //全选后数组空，子元素取消选则
            if (m === true) {
                //$scope.selected=[];
                if(n=='selectall'){
                    sel.length=0;
                    $scope.selected='';
                    for (var i = 0; i < $scope.criterialist.length; i++) {
                        $scope.criterialist[i].state= false;
                    }
                    financeinit(sel,data,starttime,endtime,type,exporttype);

                }
                if(n=='payselectall'){
                    check.length=0;
                    $scope.payselected='';
                    for (var i = 0; i < $scope.paylist.length; i++) {
                        $scope.paylist[i].state= false;
                    }
                    financeinit(data,check,starttime,endtime,type,exporttype);
                }
            }

        }

        //时间控件
        $scope.mychange=function(val,sel,check,endtime,exporttype) {
            laydate.render({
                elem: '.test1'
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.test2' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    $scope.starttime=val;
                    financeinit(sel,check,$scope.starttime,endtime,$scope.type,exporttype)
                }

            });

        }
        //时间控件 至
        $scope.mychange2=function(val,sel,check,starttime,exporttype){
            laydate.render({
                elem: '.test3'
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                ,format: 'yyyy-MM-dd' //可任意组合
                ,show: true //直接显示
                ,closeStop: '.test4' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    $scope.endtime=val;
                    financeinit(sel,check,starttime,$scope.endtime,$scope.type,exporttype)
                }
            });
        }
        $scope.flag=false;
        $scope.flag2=false;
        $scope.type='';
        //选择七天
        $scope.seven=function($event,selected,payselected,starttime,endtime,exporttype){
            if($scope.type==1){
                $scope.type=''
            }else {
                $scope.type=1
            }
            $scope.flag=!$scope.flag;
            $scope.flag2=false;
            //$event.target.addClass('.visited');
            // $scope.type='1';
            financeinit(selected,payselected,starttime,endtime,$scope.type,exporttype)
        }
        //选择一个月
        $scope.month=function($event,selected,payselected,starttime,endtime,exporttype){
            if($scope.type==2){
                $scope.type=''
            }else {
                $scope.type=2
            }
            $scope.flag=false;
            $scope.flag2=!$scope.flag2;
            // $scope.type='2'
            financeinit(selected,payselected,starttime,endtime,$scope.type,exporttype)
        }

        //分页
        $scope.no = '/';
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+ppnameinput', function (news) {
            financeinit($scope.selected,$scope.payselected,$scope.starttime,$scope.endtime,$scope.type,$scope.exporttype);
        })
        function financeinit(selected,payselected,starttime,endtime,type,exporttype){
            //console.log(selected,payselected)
            server.server().criterialist({
                projectId:$scope.projectId,
                pageNo: $scope.conf.currentPage,
                pageSize: $scope.conf.itemPageLimit,
                searchKeys:$scope.ppnameinput?$scope.ppnameinput:'',
                financeId:selected?selected:'',
                paymentStatus:payselected?payselected:'',
                beginTime:starttime?starttime:'',
                endTime:endtime?endtime:'',
                type:type?type:'',
                exportType:exporttype,
                paymentType:2
            }, function (data) {
                if (data.result === true) {
                    $scope.list = data.data.rows;

                    for(var i=0;i<$scope.list.length;i++){
                        if($scope.list[i].paymentStatus==0){
                            $scope.list[i].payment='未支付';
                        }else if($scope.list[i].paymentStatus==1){
                            $scope.list[i].payment='已支付';
                        }else if($scope.list[i].paymentStatus==2){
                            $scope.list[i].payment='截留';
                        }else if($scope.list[i].paymentStatus==3){
                            $scope.list[i].payment='未收款';
                        }else if($scope.list[i].paymentStatus==3){
                            $scope.list[i].payment='已收款';
                        }
                    }
                    // console.log($scope.rows);

                    //多少页
                    $scope.conf.total = data.data.pageCount;

                    // $scope.conf.total = data.data.total/data.data.pageSize;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");
                } else {
                    alert(data.message);
                }
            })
        }

        //批量操作
        var batch=[];
        $scope.batchselect=function($event,id){
            $scope.batchChecked=false;
        }
        //批量支付 全选
        $scope.batchAll=function($event){
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                for(var i=0;i<$scope.list.length;i++){
                    $scope.list[i].checked=true;
                }
            }else{
                for(var i=0;i<$scope.list.length;i++){
                    $scope.list[i].checked=false;
                }
            }

        }
        //批量申请支付操作
        $scope.payapply=function(){
            $('.saveDisabled').removeAttr('disabled');
            for(var i=0;i<$scope.list.length;i++){
                if($scope.list[i].checked==true&&$scope.list[i].examineStatus==0||$scope.list[i].examineStatus==2){
                    batch.push($scope.list[i].id);
                }
            }
            server.server().payapplylist({
                paymentId:batch.toString(),
                userId:userId
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        financeinit();
                        $scope.batchChecked=false;
                        batch=[];
                        $('.saveDisabled').removeAttr('disabled');
                    });

                    $scope.$apply();
                } else {
                    alert(data.message,function(){
                        $('.saveDisabled').removeAttr('disabled');
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                });
            });
        }
        //导出所有
        $scope.exporttype='';
        $scope.export=function(selected,payselected,starttime,endtime,type){
            $scope.exporttype='1';
            // financeinit(selected,payselected,starttime,endtime,type,$scope.exporttype);
            $scope.exporttypeUrl=$scope.hostName+'payment/queryFinanceList.do?'+'projectId='+$scope.projectId+'&pageNo='+$scope.conf.currentPage+'&pageSize='+$scope.conf.itemPageLimit+'&searchKeys='+($scope.ppnameinput?$scope.ppnameinput:'')+'&financeId='+(selected?selected:'')+'&paymentStatus='+(payselected?payselected:'')+'&beginTime='+(starttime?starttime:'')+'&endTime='+(endtime?endtime:'')+'&type='+(type?type:'')+'&exportType='+$scope.exporttype+'&paymentType=2';
            $scope.exporttype='';

        }
        //申请单个支付
        $scope.paySingle=function(id){
            server.server().payapplylist({
                paymentId:id,
                userId:userId
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        financeinit()
                    });
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            });
        }
    }])
    //佣金赔偿
    .controller('commissionfinanceCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var userId=server.server().userId;
        //获取host
        $scope.hostName=server.server().imgHost;
        $scope.projectId=$state.params.projectid;
        $scope.myscrol=true;
        $scope.scrolldiv=function(){
            $scope.myscrol=!$scope.myscrol;
        }
        //设置收/付款状态数组，并且组成数组
        $scope.paylist=[
            {
                id:0,
                name:'未支付',
                state:false
            },
            {
                id:1,
                name:'已支付',
                state:false
            }
        ]
        //佣金类型
        $scope.commissiontype=[
            {
                id:1,
                name:'签约佣金',
                state:false
            },
            {
                id:2,
                name:'违建佣金',
                state:false
            },
            {
                id:3,
                name:'综合业务佣金',
                state:false
            }
            ]
        //判断补偿项目是否被选中，并且组成数组

        var sel=[], check=[];
        var Regx = /^[0-9]*$/;
        $scope.selected='';
        $scope.payselected='';
        // 单选
        $scope.updateSelection=function($event,id,starttime,endtime,type,exporttype){

            var checkbox = $event.target;
            console.log(checkbox);
            var name=checkbox.name;
            console.log(name);
            var checked = checkbox.checked;
            if(checked){
                if(name=='pay'){
                    check.push(id);
                    $scope.payselected=check.toString();

                }else if(name=='commission'){
                    sel.push(id);
                    $scope.selected=sel.toString();

                }
            }else{
                if(name=='pay'){
                    var indx = check.indexOf(id);
                    check.splice(indx,1);
                    $scope.payselected=check.toString();

                }else if(name=='commission'){
                    var idx = sel.indexOf(id);
                    sel.splice(idx,1);
                    $scope.selected=sel.toString();

                }
            }
            $scope.selected.length === 0 ? $scope.selectall = true : $scope.selectall = false;
            $scope.payselected.length === 0 ? $scope.payselectall = true : $scope.payselectall = false;
            commissioninit($scope.selected,$scope.payselected,starttime,endtime,type,exporttype)
        }




        //全选
        $scope.selectall=true;
        $scope.payselectall=true;

        $scope.checktall=function(m,n,data,starttime,endtime,type,exporttype){
            console.log(data);
            //取消全选，如果子元素都求没有选则，就不能取消全选
            if (m === false) {
                if ($scope.selected.length=== 0 ) {
                    $scope.selectall = true;

                }
                if($scope.payselected.length===0){
                    $scope.payselectall=true;
                }
            }
            //全选后数组空，子元素取消选则
            if (m === true) {
                //$scope.selected=[];
                if(n=='selectall'){
                    sel.length=0;
                    $scope.selected='';
                    for (var i = 0; i < $scope.commissiontype.length; i++) {
                        $scope.commissiontype[i].state= false;
                    }
                    commissioninit(sel,data,starttime,endtime,type,exporttype);

                }
                if(n=='payselectall'){
                    check.length=0;
                    $scope.payselected='';
                    for (var i = 0; i < $scope.paylist.length; i++) {
                        $scope.paylist[i].state= false;
                    }
                    commissioninit(data,check,starttime,endtime,type,exporttype);
                }
            }

        }
        //时间控件
        $scope.mychange=function(val,sel,check,endtime,exporttype) {
            laydate.render({
                elem: '.test1'
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.test2' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    $scope.starttime=val;
                    commissioninit(sel,check,$scope.starttime,endtime,$scope.type,exporttype)
                }

            });

        }
        //时间控件 至
        $scope.mychange2=function(val,sel,check,starttime,exporttype){
            laydate.render({
                elem: '.test3'
                //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                ,format: 'yyyy-MM-dd' //可任意组合
                ,show: true //直接显示
                ,closeStop: '.test4' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    $scope.endtime=val;
                    commissioninit(sel,check,starttime,$scope.endtime,$scope.type,exporttype)
                }
            });
        }
        //批量操作勾选
        var batch=[];
        $scope.batchselect=function($event,id){
            $scope.batchChecked=false;
        }
        //批量支付 全选
        $scope.batchAll=function($event){
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                for(var i=0;i<$scope.list.length;i++){
                    $scope.list[i].checked=true;
                }
            }else{
                for(var i=0;i<$scope.list.length;i++){
                    $scope.list[i].checked=false;
                }
            }

        }
        //批量申请操作
        $scope.commissionapply=function(){
            $('.saveDisabled').attr('disabled','disabled');
            for(var i=0;i<$scope.list.length;i++){
                if($scope.list[i].checked==true&&$scope.list[i].examineStatus==0||$scope.list[i].examineStatus==2){
                    batch.push($scope.list[i].id);
                }
            }
            server.server().commissionapplylist({
                commisionId:batch.toString(),
                userId:userId
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        $scope.batchChecked=false;
                        commissioninit();
                        batch=[];
                        $('.saveDisabled').removeAttr('disabled');
                    })
                    $scope.$apply();
                } else {
                    alert(data.message,function(){
                        $('.saveDisabled').removeAttr('disabled');
                    });
                }
            }, function (err) {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                });
            });
        }

        //点击七天
        $scope.flag=false;
        $scope.flag2=false;
        $scope.type='';
        $scope.seven=function($event,selected,payselected,starttime,endtime,exporttype){
            $scope.flag=!$scope.flag;
            if($scope.flag==true){
                $scope.type=1
            }else{
                $scope.type=''
            }
            $scope.flag2=false;

            commissioninit(selected,payselected,starttime,endtime,$scope.type,exporttype);

        }
        //点击一个月
        $scope.month=function($event,selected,payselected,starttime,endtime,exporttype){

            $scope.flag=false;
            $scope.flag2=!$scope.flag2;
            if($scope.flag2==true){
                $scope.type=2
            }else{
                $scope.type=''
            }
            commissioninit(selected,payselected,starttime,endtime,$scope.type,exporttype);
        }
        //分页
        $scope.no = '/';
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+ppnameinput', function () {
            commissioninit($scope.selected,$scope.payselected,$scope.starttime,$scope.endtime,$scope.type,$scope.exporttype);

        })
        // $scope.list='';
        //封装成函数，以便各个调用，顺便将接口调用放进去，可以实时根据筛选的条件来筛选出结果
        function commissioninit(selected,payselected,starttime,endtime,type,exporttype){
            //console.log(selected,payselected)
            server.server().commissionlist({
                projectId:$scope.projectId,
                pageNo: $scope.conf.currentPage,
                pageSize: $scope.conf.itemPageLimit,
                searchKeys:$scope.ppnameinput?$scope.ppnameinput:'',//搜索条件
                status:selected?selected:'',//佣金类型
                paymentStatus:payselected?payselected:'',//付款状态
                type:type?type:'',//1最近7天  2最近一个月
                beginTime:starttime?starttime:'',
                endTime:endtime?endtime:'',
                exportType:exporttype,//是否导出
            }, function (data) {
                if (data.result === true) {
                    $scope.list = data.data.rows;
                    //判断支付类型给自定义payment赋值
                    for(var i=0;i<$scope.list.length;i++) {
                        if ($scope.list[i].paymentStatus == 0) {
                            $scope.list[i].payment = '未支付';
                        } else if ($scope.list[i].paymentStatus == 1) {
                            $scope.list[i].payment = '已支付';
                        } else if ($scope.list[i].paymentStatus == 2) {
                            $scope.list[i].payment = '截留';
                        } else if ($scope.list[i].paymentStatus == 3) {
                            $scope.list[i].payment = '未收款';
                        } else if ($scope.list[i].paymentStatus == 3) {
                            $scope.list[i].payment = '已收款';
                        }
                    }
                        //判断佣金类型，给自定义comtype赋值
                        for (var i = 0; i < $scope.list.length; i++) {
                            if ($scope.list[i].type == 1) {
                                $scope.list[i].comtype = '签约佣金';
                            } else if ($scope.list[i].type == 2) {
                                $scope.list[i].comtype = '违建佣金';
                            } else if ($scope.list[i].type == 3) {
                                $scope.list[i].comtype = '综合业务佣金';
                            }
                        }
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

        //导出所有
        $scope.exporttype='';
        $scope.export=function(selected,payselected,starttime,endtime,type){
            $scope.exporttype='1';
            // commissioninit(selected,payselected,type,$scope.exporttype);
            $scope.exporttypeUrl=$scope.hostName+'signedcommission/financeCommision.do?'+'projectId='+$scope.projectId+'&pageNo='+$scope.conf.currentPage+'&pageSize='+$scope.conf.itemPageLimit+'&searchKeys='+($scope.ppnameinput?$scope.ppnameinput:'')+'&status='+(selected?selected:'')+'&paymentStatus='+(payselected?payselected:'')+'&beginTime='+(starttime?starttime:'')+'&endTime='+(endtime?endtime:'')+'&type='+(type?type:'')+'&exportType='+$scope.exporttype;
            $scope.exporttype='';
        }


    }])
    //财务管理-财务支付
    .controller('payfinanceCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var userId=server.server().userId;
        $scope.projectId=$state.params.projectid;
        $scope.myscrol=true;
        $scope.scrolldiv=function(){
            $scope.myscrol=!$scope.myscrol;
        }
        //分页
        $scope.no = '/';
        payfinance();
        function payfinance(){
            server.server().payfinancelist({
                projectId:$scope.projectId
            },function(data){
                if(data.result===true){
                    $scope.statisticslist = data.data;
                    //判断物业补偿类型，给自定义payfinancetype赋值
                    for (var i = 0; i < $scope.statisticslist.length; i++) {
                        if ($scope.statisticslist[i].type == 1) {
                            $scope.statisticslist[i].payfinancetype = '物业补偿';
                        } else if ($scope.statisticslist[i].type == 2) {
                            $scope.statisticslist[i].payfinancetype = '安置补助补偿';
                        } else if ($scope.statisticslist[i].type == 3) {
                            $scope.statisticslist[i].payfinancetype = '延期支付补偿';
                        } else if ($scope.statisticslist[i].type == 4) {
                            $scope.statisticslist[i].payfinancetype = '佣金';
                        }
                    }
                    //判断支付类型给自定义payment赋值
                    for(var i=0;i<$scope.statisticslist.length;i++) {
                        if ($scope.statisticslist[i].paymentStatus == 0) {
                            $scope.statisticslist[i].payment = '未支付';
                        } else if ($scope.statisticslist[i].paymentStatus == 1) {
                            $scope.statisticslist[i].payment = '已支付';
                        } else if ($scope.statisticslist[i].paymentStatus == 2) {
                            $scope.statisticslist[i].payment = '截留';
                        } else if ($scope.statisticslist[i].paymentStatus == 3) {
                            $scope.statisticslist[i].payment = '未收款';
                        } else if ($scope.statisticslist[i].paymentStatus == 3) {
                            $scope.statisticslist[i].payment = '已收款';
                        }
                    }
                    $scope.$apply();

                }else{
                    alert(data.message)
                }
            },function(err){

            })
        }

        //点击之后显示支付列表
        $scope.showPayList=function(){
            $scope.payListFlag=true;
        }

    }])
    .controller('paylistCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){

        $scope.projectId=$state.params.projectid;
        $scope.downloadUrl=server.server().imgHost;
        var userId=server.server().userId;
        $scope.type=$state.params.type;
        $scope.no='/';
        $scope.myscrol=true;
        $scope.batchChecked=false;//批量申请的全选按钮
        $scope.scrolldiv=function(){
            $scope.myscrol=!$scope.myscrol;
        }
        //设置收/付款状态数组，并且组成数组
        $scope.paylist=[
            {
                id:0,
                name:'未支付',
                state:false
            },
            {
                id:1,
                name:'已支付',
                state:false
            }
        ]
        //判断补偿项目是否被选中，并且组成数组

        var check=[];
        $scope.payselected='';
        // 单选
        $scope.updateSelection=function($event,id,exporttype){

            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                    check.push(id);
                    $scope.payselected=check.toString();
            }else{
                    var indx = check.indexOf(id);
                    check.splice(indx,1);
                    $scope.payselected=check.toString();
            }
            $scope.payselected.length === 0 ? $scope.payselectall = true : $scope.payselectall = false;
            if($scope.type==4){
                paycommissionlist($scope.payselected,exporttype);
            }else{
                paylist($scope.payselected,exporttype);
            }

        }

        // 导出的type
        $scope.exportType=0;
        $scope.export=function(payselected){
            $scope.exporttype=1;
            if($scope.type==4){
                $scope.exporttypeUrl=$scope.downloadUrl+'payment/commisionPaymentList.do?'+'projectId='+$scope.projectId+'&pageNo='+$scope.conf.currentPage+'&pageSize='+$scope.conf.itemPageLimit+'&status='+(payselected?payselected:'')+'&type='+($scope.type?$scope.type:'')+'&exportType='+$scope.exporttype;
            }else{
                $scope.exporttypeUrl=$scope.downloadUrl+'payment/paymentList.do?'+'projectId='+$scope.projectId+'&pageNo='+$scope.conf.currentPage+'&pageSize='+$scope.conf.itemPageLimit+'&status='+(payselected?payselected:'')+'&type='+($scope.type?$scope.type:'')+'&exportType='+$scope.exporttype;
            }
            $scope.exporttype=0;
        }

        //全选
        $scope.payselectall=true;

        $scope.checktall=function(m,n,exporttype){
            //取消全选，如果子元素都求没有选则，就不能取消全选
            if (m === false) {
                if($scope.payselected.length===0){
                    $scope.payselectall=true;
                }
            }
            //全选后数组空，子元素取消选则
            if (m === true) {
                if(n=='payselectall'){
                    check.length=0;
                    $scope.payselected='';
                    for (var i = 0; i < $scope.paylist.length; i++) {
                        $scope.paylist[i].state= false;
                    }
                    if($scope.type==4){
                        paycommissionlist($scope.payselected,exporttype);
                    }else{
                        paylist($scope.payselected,exporttype);
                    }

                }
            }

        }
        //头部
        if($scope.type!=4) {
            server.server().payheadlist({
                projectId: $scope.projectId,
                type: $scope.type
            }, function (data) {
                if (data.result === true) {
                    $scope.headlist = data.data;
                    //判断物业补偿类型，给自定义payfinancetype赋值
                    if ($scope.headlist != null) {
                        for (var i = 0; i < $scope.headlist.length; i++) {
                            if ($scope.headlist[i].type == 1) {
                                $scope.headlist[i].payfinancetype = '物业补偿';
                            } else if ($scope.headlist[i].type == 2) {
                                $scope.headlist[i].payfinancetype = '安置补助补偿';
                            } else if ($scope.headlist[i].type == 3) {
                                $scope.headlist[i].payfinancetype = '延期支付补偿';
                            } else if ($scope.headlist[i].type == 4) {
                                $scope.headlist[i].payfinancetype = '佣金';
                            }
                        }
                        //判断支付类型给自定义payment赋值
                        for (var i = 0; i < $scope.headlist.length; i++) {
                            if ($scope.headlist[i].paymentStatus == 0) {
                                $scope.headlist[i].payment = '未支付';
                            } else if ($scope.headlist[i].paymentStatus == 1) {
                                $scope.headlist[i].payment = '已支付';
                            } else if ($scope.headlist[i].paymentStatus == 2) {
                                $scope.headlist[i].payment = '截留';
                            } else if ($scope.headlist[i].paymentStatus == 3) {
                                $scope.headlist[i].payment = '未收款';
                            } else if ($scope.headlist[i].paymentStatus == 3) {
                                $scope.headlist[i].payment = '已收款';
                            }
                        }
                    }

                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }else{
            //支付列表-佣金头部
            server.server().paycommissionheadlist({
                projectId:$scope.projectId,
            }, function (data) {
                if (data.result === true) {
                    $scope.headcommissionlist=data.data;
                    //判断物业补偿类型，给自定义payfinancetype赋值
                    if($scope.headcommissionlist!=null){
                        for (var i = 0; i < $scope.headcommissionlist.length; i++) {
                            if ($scope.headcommissionlist[i].type == 1) {
                                $scope.headcommissionlist[i].payfinancetype = '物业补偿';
                            } else if ($scope.headcommissionlist[i].type == 2) {
                                $scope.headcommissionlist[i].payfinancetype = '安置补助补偿';
                            } else if ($scope.headcommissionlist[i].type == 3) {
                                $scope.headcommissionlist[i].payfinancetype = '延期支付补偿';
                            } else if ($scope.headcommissionlist[i].type == 4) {
                                $scope.headcommissionlist[i].payfinancetype = '佣金';
                            }
                        }
                        //判断支付类型给自定义payment赋值
                        for(var i=0;i<$scope.headcommissionlist.length;i++) {
                            if ($scope.headcommissionlist[i].paymentStatus == 0) {
                                $scope.headcommissionlist[i].payment = '未支付';
                            } else if ($scope.headcommissionlist[i].paymentStatus == 1) {
                                $scope.headcommissionlist[i].payment = '已支付';
                            } else if ($scope.headcommissionlist[i].paymentStatus == 2) {
                                $scope.headcommissionlist[i].payment = '截留';
                            } else if ($scope.headcommissionlist[i].paymentStatus == 3) {
                                $scope.headcommissionlist[i].payment = '未收款';
                            } else if ($scope.headcommissionlist[i].paymentStatus == 3) {
                                $scope.headcommissionlist[i].payment = '已收款';
                            }
                        }
                    }

                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        //分页
        $scope.no = '/';
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit', function () {
            if($scope.type==4){
                paycommissionlist($scope.payselected,$scope.exportType)
            }else{
                paylist($scope.payselected,$scope.exportType);
            }


        })
        //支付列表-除佣金外的
        function paylist(status,exportType){
            server.server().paydatalist({
                projectId:$scope.projectId,
                type:$scope.type,
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit,
                status:status,
                exportType:exportType
            }, function (data) {
                if (data.result === true) {
                    $scope.list=data.data.rows;
                    //判断支付类型给自定义payment赋值
                    for(var i=0;i<$scope.list.length;i++) {
                        $scope.list[i].paySatus=false;
                        if ($scope.list[i].paymentStatus == 0) {
                            $scope.list[i].payment = '未支付';
                        } else if ($scope.list[i].paymentStatus == 1) {
                            $scope.list[i].payment = '已支付';
                        }
                    }
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
            }, function (err) {

            });
        }
        //支付列表-佣金
        function paycommissionlist(status,exportType){
            server.server().paycommissiondatalist({
                projectId:$scope.projectId,
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit,
                status:status,
                exportType
            }, function (data) {
                if (data.result === true) {
                    $scope.commissionlist=data.data.rows;
                    //判断支付类型给自定义payment赋值
                    for(var i=0;i<$scope.commissionlist.length;i++) {
                        $scope.commissionlist[i].paySatus=false;

                        if ($scope.commissionlist[i].paymentStatus == 0) {
                            $scope.commissionlist[i].payment = '未支付';
                        } else if ($scope.commissionlist[i].paymentStatus == 1) {
                            $scope.commissionlist[i].payment = '已支付';
                        }
                    }
                    //判断佣金类型，给自定义comtype赋值
                    for (var i = 0; i < $scope.commissionlist.length; i++) {
                        if ($scope.commissionlist[i].type == 1) {
                            $scope.commissionlist[i].comtype = '签约佣金';
                        } else if ($scope.commissionlist[i].type == 2) {
                            $scope.commissionlist[i].comtype = '违建佣金';
                        } else if ($scope.commissionlist[i].type == 3) {
                            $scope.commissionlist[i].comtype = '综合业务佣金';
                        }
                    }
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
            }, function (err) {

            });
        }
        //佣金支付function
        function comSinglePay(id) {
            server.server().paymoneynow({
                id:id
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        paycommissionlist();
                        $scope.batchChecked=false;
                        $('.saveDisabled').removeAttr('disabled');
                    })
                    $scope.$apply();

                } else {
                    alert(data.message, function () {
                        $('.saveDisabled').removeAttr('disabled');
                    });
                }
            }, function (err) {
                alert(data.message, function () {
                    $('.saveDisabled').removeAttr('disabled');
                });
            });
        }
        //除佣金外的支付function
        function exceptPay(id){
            server.server().paynow({
                id:id
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        paylist();
                        $scope.batchChecked=false;
                        $('.saveDisabled').removeAttr('disabled');
                    })
                    $scope.$apply();

                } else {
                    alert(data.message, function () {
                        $('.saveDisabled').removeAttr('disabled');
                    });
                }
            }, function (err) {
                alert(data.message, function () {
                    $('.saveDisabled').removeAttr('disabled');
                });
            });
        }
        //支付-佣金
        $scope.paymoney=function(id){
            comSinglePay(id);
        }
        //支付-除佣金外
        $scope.pay=function(id){
            exceptPay(id);
        }
        //单选其中的某一个，会将全选勾选取消
        $scope.batchselect=function(){
            $scope.batchChecked=false;
        }
        //批量支付 全选
        $scope.batchAll=function($event,type){
            var checkbox = $event.target;
            var checked = checkbox.checked;

            if(type!=4){
                if(checked){
                    for(var i=0;i<$scope.list.length;i++){
                        $scope.list[i].paySatus=true;

                    }
                }else{
                    for(var i=0;i<$scope.list.length;i++){
                        $scope.list[i].paySatus=false;
                    }
                }
            }else{
                if(checked){
                    for(var i=0;i<$scope.commissionlist.length;i++){
                        $scope.commissionlist[i].paySatus=true;
                    }
                }else{
                    for(var i=0;i<$scope.commissionlist.length;i++){
                        $scope.commissionlist[i].paySatus=false;
                    }
                }
            }


        }
        //支付申请-所有
        $scope.payAll=function(commissionlist,list){
            $('.saveDisabled').attr('disabled','disabled');
            if($scope.type==4){
                //佣金
                var arr=[];
                commissionlist.forEach(function(item,idx){
                    if(item.paySatus==true&&item.paymentStatus==0){
                        arr.push(item.id);
                    }
                })
                comSinglePay(arr.toString());
            }else{
                //出佣金外
                var arr=[];
                list.forEach(function(item,idx){
                    if(item.paySatus==true&&item.paymentStatus==0){
                        arr.push(item.id);
                    }
                })
                exceptPay(arr.toString());
            }
        }
    }])
    //财务结算
    .controller('financialsettlementCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        var userId=server.server().userId;

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

        //获取财务结算列表
        function settlementListData(){
            server.server().settlementlist({
                projectId:$scope.projectId
            }, function (data) {
                if (data.result === true) {
                    $scope.settlementlist=data.data;
                    
                    for(var i=0;i<$scope.settlementlist.length;i++){
                        if($scope.settlementlist[i].type==1){
                            $scope.settlementlist[i].typement='物业补偿类';
                        }else if($scope.settlementlist[i].type==2){
                            $scope.settlementlist[i].typement='安置补助类';
                        }else if($scope.settlementlist[i].type==3){
                            $scope.settlementlist[i].typement='延期支付类';
                        }
                        for(var j = 0;j<$scope.settlementlist[i].detailList.length;j++){
                            $scope.settlementlist[i].detailList[j].type = $scope.settlementlist[i].type
                        }

                    }

                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        settlementListData();

        //新增项目信息
        $scope.addnewproject=function(flag){
            $('.'+flag).dialog();
        }
        //物业补偿弹窗
        $scope.compensationDialog=function(flag){
            $('.'+flag).dialog();
            contactInit(1,1);
        }
        //延期支付类
        $scope.delayDialog=function(flag){
            $('.'+flag).dialog();
            contactInit(3,1);
        }
        //安置补助类
        $scope.helpDialog=function(flag){
            $('.'+flag).dialog();
            contactInit(2,1);
        }
        //关联补偿内容
        function contactInit(type,status,flag,callback){
            server.server().contactcommission({
                projectId:$scope.projectId,
                type:type,
                status:status
            }, function (data) {
                if (data.result === true) {
                    console.log(data.data);
                    $scope.newcontactlist = data.data;//新增
                    $scope.contactlist = data.data;//修改
                    $scope.newcontactlist.forEach(function (item, i) {
                        $scope.newcontactlist[i].state = false;
                    });
                    $scope.contactlist.forEach(function(item,i){
                        $scope.contactlist[i].state = false;
                    });
                    if(flag){
                        callback($scope.contactlist)
                    }
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        //节点父级
        server.server().paynodeparent({
        }, function (data) {
            if (data.result === true) {
                $scope.nodelist=data.data;
                $scope.$apply();

            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        $scope.getid=function(id,i,flag,stageFlag){
            //节点子集
            server.server().paynodeson({
                parentId:id
            }, function (data) {
                if (data.result === true) {
                    if(flag=='new'&&stageFlag==1){
                        $scope.newdetailJson[i].stagelist2=data.data;
                    }else if(flag=='new'){
                        $scope.newdetailJson[i].stagelist=data.data;
                    }
                    if(flag=='update'&&stageFlag==2){
                        $scope.detailJson[i].stagelist2=data.data;
                    }else if(flag=='update'){
                        $scope.detailJson[i].stagelist=data.data;
                    }
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        $scope.statusoption = [{status:1,val:'完成前'},{status:0,val:'完成后'}]

        //物业补偿类 点击按钮添加规则
        $scope.flag=false;//控制按钮本身
        $scope.show=function(flag){
            if(flag==1){
                $scope.newdetailJson.push({isProtocol:1,status:1,ruleIdOne:'',ruleIdTwo:'',scale:'',paymentBasis:'',ruleTwoData:'',paymentMode:1,childType:1,nodeOneId:'',nodeTwoId:'',stagelist:'',stagelist2:'',amount:''})
                if($scope.newdetailJson.length>=3){
                    $scope.flag=true;//控制按钮本身
                }else{
                    $scope.flag=false;//控制按钮本身
                }
            }else {
                $scope.detailJson.push({isProtocol:1,ruleIdOne:'',ruleIdTwo:'',scale:'',paymentBasis:'',ruleTwoData:'',paymentMode:1,childType:1,nodeOneId:'',nodeTwoId:'',stagelist:'',stagelist2:'',amount:''})
                if($scope.detailJson.length>=3){
                    $scope.flag=true;//控制按钮本身
                }else{
                    $scope.flag=false;//控制按钮本身
                }
            }


        }
        $scope.contactJson=[];
       // 新增的数组初始化
        $scope.newdetailJson=[{isProtocol:1,status:1,ruleIdOne:'',ruleIdTwo:'',scale:'',paymentBasis:'',ruleTwoData:'',paymentMode:1,childType:1,nodeOneId:'',nodeTwoId:'',stagelist:'',stagelist2:'',amount:''}];

        //修改的数组初始化
        $scope.detailJson=[];
        //判断补偿项目是否被选中，并且组成数组
        var sel=[];//临时数组存放被选中的ID
        $scope.contactJson=[];//最终需要保存的数组
        $scope.isMonth=true;
        $scope.isHelp=true;
        //物业补偿类 新增
        $scope.addcommission=function(type){
            $('.saveDisabled').attr('disabled','disabled');
            var arr=[]
            for(var i=0;i<$scope.contactlist.length;i++) {
                if ($scope.contactlist[i].state == true) {
                    arr.push({
                        compensateProjectId: $scope.contactlist[i].compensateProjectId,
                        typeId: $scope.contactlist[i].compensationId
                    });
                }
            }
            var newDetailList=[];
            for(var j=0;j<$scope.newdetailJson.length;j++) {
                newDetailList.push({isProtocol:$scope.newdetailJson[j].isProtocol
                    ,ruleIdOne:$scope.newdetailJson[j].ruleIdOne
                    ,ruleIdTwo:$scope.newdetailJson[j].ruleIdTwo?$scope.newdetailJson[j].ruleIdTwo:''
                    ,scale:$scope.newdetailJson[j].scale
                    ,paymentBasis:$scope.newdetailJson[j].paymentBasis
                    ,ruleTwoData:$scope.newdetailJson[j].ruleTwoData
                    ,paymentMode:$scope.newdetailJson[j].paymentMode
                    ,childType:$scope.newdetailJson[j].childType
                    ,nodeOneId:$scope.newdetailJson[j].nodeOneId
                    ,nodeTwoId:$scope.newdetailJson[j].nodeTwoId?$scope.newdetailJson[j].nodeTwoId:''
                    ,amount:$scope.newdetailJson[j].amount
                    ,status:$scope.newdetailJson[j].status})
            }
            //调取新增接口
            if(type==1){//补偿类型:1：物业补偿类
                server.server().addnewcommission({
                    projectId:$scope.projectId,
                    type:type,
                    name:$scope.newprojectname,
                    userId:userId,
                    contactJson:JSON.stringify(arr),
                    detailJson:JSON.stringify(newDetailList),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            $('.addnew').hide();
                            $('.addcompensation').hide();
                            $('.saveDisabled').removeAttr('disabled');
                            clearData();
                            settlementListData();
                            $scope.$apply();
                        })

                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            clearData();
                            settlementListData();
                            $('.saveDisabled').removeAttr('disabled');
                            $scope.$apply();
                        });
                    }
                }, function (err) {
                    alert(data.message,function(){
                        clearData();
                        settlementListData();
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    });
                });
            }else if(type==2){//补偿类型:2：安置补助类
                $scope.newdetailJson[0].isProtocol='';
                server.server().addnewcommission({
                    projectId:$scope.projectId,
                    type:type,
                    name:$scope.newprojectname,
                    userId:userId,
                    contactJson:JSON.stringify(arr),
                    detailJson:JSON.stringify(newDetailList),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            settlementListData();
                            $('.addnew').hide();
                            $('.addhelp').hide();
                            $('.saveDisabled').removeAttr('disabled');
                            clearData();
                            $scope.$apply();
                        });

                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            clearData();
                            settlementListData();
                            $('.saveDisabled').removeAttr('disabled');
                            $scope.$apply();
                        });
                    }
                }, function (err) {
                    alert(data.message,function(){
                        clearData();
                        settlementListData();
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    });
                });
            }else if(type==3){//补偿类型:3：延期支付类
                server.server().addnewcommission({
                    projectId:$scope.projectId,
                    type:type,
                    name:$scope.newprojectname,
                    userId:userId,
                    contactJson:JSON.stringify(arr),
                    detailJson:JSON.stringify(newDetailList),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            settlementListData();
                            $('.addnew').hide();
                            $('.adddelay').hide();
                            $('.saveDisabled').removeAttr('disabled');
                            clearData();
                            $scope.$apply();
                        });

                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            clearData();
                            settlementListData();
                            $('.saveDisabled').removeAttr('disabled');
                            $scope.$apply();
                        });
                    }
                }, function (err) {
                    alert(data.message,function(){
                        clearData();
                        settlementListData();
                        $('.saveDisabled').removeAttr('disabled');
                        $scope.$apply();
                    });
                });
            }

        }
        //取消function
        function clearData(){
            $scope.contactJson.length = 0;
            $scope.newdetailJson = [{isProtocol:1,ruleIdOne:'',ruleIdTwo:'',scale:'',paymentBasis:'',ruleTwoData:'',paymentMode:1,childType:1,nodeOneId:'',nodeTwoId:'',stagelist:'',stagelist2:''}];
            //清空关联内容选项
            $scope.newcontactlist.forEach(function (item, i) {
                $scope.newcontactlist[i].state = false;
            });
            //清空名字
            $scope.newprojectname = '';
            //清空置换物业类型的规则
            $scope.detailJson = [];
            //清空关联内容选项
            $scope.newcontactlist.forEach(function (item, i) {
                $scope.newcontactlist[i].state = false;
            });
            $scope.flag=false;//按钮本身
            $('.saveDisabled').removeAttr('disabled');//清除按钮无法点击
        }
        //取消
        $scope.cancel=function(){
            clearData();
        }
        // 修改的弹窗
        $scope.opendilog=function(type,id){
            console.log(id);
            if(type==1){
                setTimeout(function(){$('.updatecompensation').dialog()},300);
            }else if(type==2){
                setTimeout(function(){$('.updatehelp').dialog()},300);

            }else if(type==3){

                setTimeout(function(){$('.updatedelay').dialog()},300);
            }
            contactInit(type,2,true,function(contactlist){
                //修改初始化数据接口调用
                server.server().updatenewcommission({
                    id:id
                }, function (data) {
                    if (data.result == true) {

                        $scope.content=data.data.content;//关联内容
                        $scope.detail=data.data.detail;//规则详情
                        $scope.settlement=data.data.settlement;
                        $scope.projectname=$scope.settlement.name;//项目名称设置默认值
                        //循环遍历设置被选中的checkbox
                        for(var i=0;i<contactlist.length;i++){
                            for(var j=0;j<$scope.content.length;j++){
                                if(contactlist[i].compensateProjectId==$scope.content[j].compensateProjectId && contactlist[i].compensationId==$scope.content[j].typeId) {
                                    contactlist[i].state = true;
                                }
                            }
                        }

                        for(var i=0;i<$scope.detail.length;i++){
                            $scope.detailJson.push({isProtocol:'',status:'',ruleIdOne:'',ruleIdTwo:'',scale:'',paymentBasis:'',ruleTwoData:'',paymentMode:'',childType:'',nodeOneId:'',stagelist:'',stagelist2:'',nodeTwoId:'',amount:''});

                            $scope.detailJson[i]={isProtocol:$scope.detail[i].isProtocol,status:$scope.detail[i].status,ruleIdOne:$scope.detail[i].ruleIdOne,ruleIdTwo:$scope.detail[i].ruleIdTwo,scale:$scope.detail[i].scale,paymentBasis:$scope.detail[i].paymentBasis,ruleTwoData:$scope.detail[i].ruleTwoData,paymentMode:$scope.detail[i].paymentMode,childType:$scope.detail[i].childType,nodeOneId:$scope.detail[i].nodeOneId,amount:$scope.detail[i].amount,stagelist:'',stagelist2:'',nodeTwoId:$scope.detail[i].nodeTwoId};
                            if($scope.detail[i].ruleIdTwo!=''){
                                //ruleIdTwo初始化
                                payNodeFn($scope.detailJson[i].ruleIdOne,i,1)
                            }
                            if($scope.detail[i].nodeTwoId!=''){
                                payNodeFn($scope.detailJson[i].nodeOneId,i,2)
                            }
                        }
                        if($scope.detail.length==3){
                            $scope.flag=true;
                        }
                        console.log($scope.detailJson);
                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            if(type==1){
                                $('.updatecompensation').hide();
                            }else if(type==2){
                                $('.updatehelp').hide();
                            }else if(type==3){
                                $('.updatedelay').hide();
                            }
                        });
                    }
                }, function (err) {

                });
            })

        }

        function payNodeFn(id,j,flag){
            server.server().paynodeson({
                parentId:id
            }, function(list){
                if (list.result === true) {
                    if(flag==1){
                        $scope.detailJson[j].stagelist=list.data;
                    }else{
                        $scope.detailJson[j].stagelist2=list.data;
                    }

                    $scope.$apply();
                }else {
                    alert(list.message);
                }
            }, function (err) {

            });
        }
        //修改保存
        $scope.updatesavecommission=function(type){
            $('.saveDisabled').attr('disabled','disabled');
            var arr=[]
            for(var i=0;i<$scope.contactlist.length;i++) {
                if ($scope.contactlist[i].state == true) {
                    arr.push({
                        compensateProjectId: $scope.contactlist[i].compensateProjectId,
                        typeId: $scope.contactlist[i].compensationId
                    });
                }
            }
            var detailList=[];
            for(var j=0;j<$scope.detailJson.length;j++) {
                detailList.push({isProtocol:$scope.detailJson[j].isProtocol
                    ,ruleIdOne:$scope.detailJson[j].ruleIdOne
                    ,ruleIdTwo:$scope.detailJson[j].ruleIdTwo?$scope.detailJson[j].ruleIdTwo:''
                    ,scale:$scope.detailJson[j].scale
                    ,paymentBasis:$scope.detailJson[j].paymentBasis
                    ,ruleTwoData:$scope.detailJson[j].ruleTwoData
                    ,paymentMode:$scope.detailJson[j].paymentMode
                    ,childType:$scope.detailJson[j].childType
                    ,nodeOneId:$scope.detailJson[j].nodeOneId
                    ,nodeTwoId:$scope.detailJson[j].nodeTwoId?$scope.detailJson[j].nodeTwoId:''
                    ,amount:$scope.detailJson[j].amount
                    ,status:$scope.detailJson[j].status
                });
            }
            //调取新增接口
            if(type==1){//补偿类型:1：物业补偿类
                server.server().updatesavenewcommission({
                    id:$scope.settlement.id,
                    projectId:$scope.projectId,
                    type:type,
                    name:$scope.projectname,
                    userId:userId,
                    contactJson:JSON.stringify(arr),
                    detailJson:JSON.stringify(detailList),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            $('.updatecompensation').hide();
                            $('.saveDisabled').removeAttr('disabled');
                            clearData();
                            settlementListData();
                        });

                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            $('.saveDisabled').removeAttr('disabled');
                        });
                    }
                }, function (err) {
                    alert(data.message,function(){
                        $('.saveDisabled').removeAttr('disabled');
                    });
                });
            }else if(type==2){//补偿类型:2：安置补助类
                server.server().updatesavenewcommission({
                    id:$scope.settlement.id,
                    projectId:$scope.projectId,
                    type:type,
                    name:$scope.projectname,
                    userId:userId,
                    contactJson:JSON.stringify(arr),
                    detailJson:JSON.stringify(detailList),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            $('.updatehelp').hide();
                            $('.saveDisabled').removeAttr('disabled');
                            clearData();
                            settlementListData();
                        });

                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            $('.saveDisabled').removeAttr('disabled');
                        });

                    }
                }, function (err) {

                });
            }else if(type==3){//补偿类型:3：延期支付类
                server.server().updatesavenewcommission({
                    id:$scope.settlement.id,
                    projectId:$scope.projectId,
                    type:type,
                    name:$scope.projectname,
                    userId:userId,
                    contactJson:JSON.stringify(arr),
                    detailJson:JSON.stringify(detailList),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function() {
                            $('.updatedelay').hide();
                            $('.saveDisabled').removeAttr('disabled');
                            clearData();
                            settlementListData();
                        });
                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            $('.saveDisabled').removeAttr('disabled');
                        });
                    }
                }, function (err) {
                    alert(data.message,function(){
                        $('.saveDisabled').removeAttr('disabled');
                    });
                });
            }

        }
        //删除财务结算
        $scope.deleteFinance=function(name,id){
            confirm('确认删除'+name+'?',function(){
                server.server().deleteFinanceSet({
                    id :id,
                    userId:userId
                }, function (data) {
                    if (data.result === true) {
                       alert(data.message,function(){
                           window.locaion.reload();
                       })
                        $scope.$apply();

                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            });
        }
        //删除规则
        $scope.deleteProcess=function(flag,idx){
            if(flag==0){//代表新增
                $scope.newdetailJson.splice(idx,1);
                console.log($scope.newdetailJson);
                if($scope.newdetailJson.length<3){
                    $scope.flag=false;//控制按钮本身
                }
            }else{
                $scope.detailJson.splice(idx,1);
                console.log($scope.detailJson);
                if($scope.detailJson.length<3){
                    $scope.flag=false;//控制按钮本身
                }
            }


        }

    }])
    //基础数据-签约阶段
    .controller('databasicSignCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;
        //签约阶段列表
        function datasignlist(){
            server.server().datasignList({
            }, function (data) {
                if (data.result === true) {
                    $scope.datalist=data.data;
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        datasignlist();
        //签约阶段-子阶段添加窗口，传值ID和name
        $scope.add=function(id,name,flag){
            $('.'+flag).dialog();
            $scope.parentId=id;
            $scope.name=name;
        }
        //签约阶段子阶段添加
        $scope.signsave=function(sonname){
            server.server().signsave({
                name:sonname,
                parentId:$scope.parentId,
                createUser:createUser,
                isFinishedTime:$scope.isFinishedTime?1:0,
                isReleaseTask:$scope.isReleaseTask?1:0,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.isFinishedTime=false;
                    $scope.isReleaseTask=false;
                    $scope.sonsignname='';
                    datasignlist();
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        //签约阶段-父级修改初始化
        $scope.edit=function(id,flag){
            $('.'+flag).dialog();
            $scope.editid=id;
            init(id);

        }

        //签约阶段-父级节点编辑修改
        $scope.signeditparent=function(id){
            var isFinished=$scope.isFinishedTime?1:0;
            var isRelease=$scope.isReleaseTask?1:0;
            var updateUser=createUser;
            editParentSave(id,$scope.parenteditsignname,updateUser,isFinished,isRelease);
        }
        //签约阶段-子级节点编辑修改
        $scope.signeditsave=function(id){
            var isFinished=$scope.isFinishedTime?1:0;
            var isRelease=$scope.isReleaseTask?1:0;
            var updateUser=createUser;
            editsave($scope.sonid,$scope.parenteditsignname,id,updateUser,isFinished,isRelease);
         }
         //签约阶段-子集阶段修改初始化
        $scope.editson=function(id,parentname,sonid,flag){
            $('.'+flag).dialog();
            $scope.editid=id;
            $scope.sonid=sonid;
            $scope.parentname=parentname;
            init(sonid);
        }
        //删除子阶段
        $scope.delete=function(id){
            confirm('确定删除?',function(){
                deleteson(id);
            })
        }
        //初始化function
        function init(id){
            server.server().signeditinit({
                id:id
            }, function (data) {
                if (data.result === true) {
                    $scope.parenteditsignname=data.data.name;
                    $scope.isFinishedTime=data.data.isFinishedTime==1?true:false;
                    $scope.isReleaseTask=data.data.isReleaseTask==1?true:false;
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //父级保存修改function
        function editParentSave(id,name,updateUser,isFinishedTime,isReleaseTask){
            server.server().signEditParentSave({
                id:id,
                name:name,
                updateUser:updateUser,
                isFinishedTime:isFinishedTime,
                isReleaseTask:isReleaseTask,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.isFinishedTime=false;
                    $scope.isReleaseTask=false;
                    datasignlist();
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //子级保存修改function
        function editsave(id,name,parentId,updateUser,isFinishedTime,isReleaseTask){
            server.server().signeditsave({
                id:id,
                name:name,
                parentId:parentId,
                updateUser:updateUser,
                isFinishedTime:isFinishedTime,
                isReleaseTask:isReleaseTask,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.isFinishedTime=false;
                    $scope.isReleaseTask=false;
                    datasignlist();
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //子阶段删除
        function deleteson(id){
            server.server().signdelete({
                id:id,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    datasignlist();
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

    }])
    //基础数据-审核流程设置
    .controller('databasicprocessCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;

        //审核流程列表function
        function processlist(){
            server.server().processdatalist({
            }, function (data) {
                if (data.result === true) {
                   $scope.processlist=data.data;
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        processlist();
        //编辑窗口
        $scope.editprocess=function(flag,id,name){
            $('.'+flag).dialog();
            $scope.processName=name;
            $scope.nodetypeId=id;
            processinit(id);

        }
        $scope.newJson=[];
        //审核流程编辑初始化function
        function processinit(id){
            server.server().processdatainit({
                userId:createUser,
                nodeTypeId:id
            }, function (data) {
                if (data.result === true) {
                    $scope.nodes=data.data.nodes;
                    //如果节点的长度为0的时候，初始化新的数据
                    if($scope.nodes.length==0){
                        $scope.newJson.push({type:1,id:''
                            ,exminusers:[{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''}]});
                    }else {
                        for(var i=0;i<$scope.nodes.length;i++){
                            $scope.newJson.push({type:$scope.nodes[i].type,id:$scope.nodes[i].id,
                                exminusers:[{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''}]})
                                for (var j = 0; j < $scope.nodes[i].exminList.length; j++) {
                                    $scope.newJson[i].exminusers[j]= {
                                        id: $scope.nodes[i].exminList[j].id,
                                        exminUserId: $scope.nodes[i].exminList[j].user_id,
                                        username: $scope.nodes[i].exminList[j].realname
                                    }
                                }
                            }
                        console.log($scope.newJson);
                    }
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //初始化text
        $scope.text='';
        //模糊搜索框显示
        $scope.ulshow=function(id,textname,idx,userindx){
            var jieleft=$('.dialog-jie').scrollLeft();
            var jietop=$('.dialog-jie').scrollTop();
            var dialogleft=$('.dialog-cont').offset().left;
            var dialogtop=$('.dialog-cont').offset().top;
            var textleft=$('.'+textname+idx).offset().left;
            var texttop=$('.'+textname+idx).offset().top;
            $('.ulshow').show();
            $('.ulshow').css({"left":textleft-dialogleft+jieleft-15+'px',"top":texttop-dialogtop+jietop-38+'px'});
            search('');
            $scope.text=textname;
            $scope.idx=idx;//节点的index
            $scope.newJson[$scope.idx].id=id;//节点Id
            $scope.userindx=userindx;   //userid的index
            // $scope.id=id?id:'';//节点Id
        }
        //模糊搜索框消失
        $scope.ulcancel=function(idx,userindx){
           $('.ulshow').hide(500);
            // $scope.newJson[idx].exminusers[userindx]={id:'',exminUserId:'',username:''};//清除数据
        }
        //模糊搜索框搜索
        function search(name){
            server.server().searchlist({
                searchKeys:name
            }, function (data) {
                if (data.result === true) {
                    $scope.searchnamelist=data.data.rows;
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //搜索
        $scope.serachsomthing=function(name){
            search(name);
        }
        var arr=[];
        //获得名字，保存到input上，再添加到json中
        $scope.getname=function(id,name){
            $('.'+$scope.text+$scope.idx).val(name);
            console.log($scope.newJson);
            $scope.newJson[$scope.idx].exminusers[$scope.userindx].username=name;
            $scope.newJson[$scope.idx].exminusers[$scope.userindx].exminUserId=id;
            console.log($scope.newJson);

        }
        //删除名字的时候触发事件
        $scope.clearData=function(){
            if(!$('.'+$scope.text+$scope.idx).val()){
                $scope.newJson[$scope.idx].exminusers[$scope.userindx].exminUserId='';
                console.log($scope.newJson);
            }
        }
        //点击添加新的节点
        $scope.pushNewProcess=function(){
            $scope.newJson.push({type:1,id:''
                ,exminusers:[{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''},{id:'',exminUserId:'',username:''}]});
            console.log($scope.newJson);
        }
        //修改保存
        $scope.updatesave=function(){
          //调更新的接口
                server.server().updatasavedata({
                    userId:createUser,
                    nodetypeId:$scope.nodetypeId,
                    saveJson:JSON.stringify($scope.newJson),
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            // processinit($scope.nodetypeId);
                            $('.updateprocess').hide();
                            $scope.newJson=[];
                        })
                        $scope.$apply();

                    } else {
                        alert(data.message,function(){
                            // processinit($scope.nodetypeId);
                            $scope.newJson=[];
                        })
                        $scope.$apply();
                    }
                }, function (err) {

                });
            }
        //保存取消
        $scope.cancelsave=function(){
            processlist();
            $scope.newJson=[];
        }
        //删除节点
        $scope.deleteProcess=function(nodetypeId,id){
            if(id){
                confirm('确定删除节点？',function(){
                    server.server().deleteProcessData({
                        ids:id
                    }, function (data) {
                        if (data.result === true) {
                            alert(data.message,function(){
                                processinit(nodetypeId);
                                $scope.newJson=[];
                            })
                            $scope.$apply();

                        } else {
                            alert(data.message,function(){
                                processinit(nodetypeId);
                                $scope.newJson=[];
                            })
                            $scope.$apply();
                        }
                    }, function (err) {

                    });
                })
            }else{
                $scope.newJson.pop();
                console.log($scope.newJson);
            }


        }

    }])
    .controller('propertydeleteCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){

        $scope.projectId=$state.params.projectid;
    }])
    .controller('propertylinkCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){

        $scope.projectId=$state.params.projectid;
    }])

    .controller('propertyrebuildCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){

        $scope.projectId=$state.params.projectid;
    }])


    //数据统计-签约
    .controller('datalistCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        
        $scope.projectId=$state.params.projectid;
        $scope.imgHost=server.server().imgHost;
        $scope.host = server.server().host;
        $scope.starttime='';
        $scope.endtime='';

        //时间控件
        $scope.mychange=function(txt1,txt2,flag) {
            laydate.render({
                elem: '.'+txt1
                // ,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.'+txt2 //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    if(flag==0){
                        $scope.starttime=val;
                        signData()
                    }else if(flag==1){
                        $scope.endtime=val;
                        signData()
                    }
                }

            });
        }
        //分页配置
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit' , function(news){
            signData()
        })

        //最新接口之--签约进度列表
        function signData(){
            server.server().zjcountqueryCountDatado({
                projectId:$scope.projectId,
                exportType:0,
                // 1 初步沟通 2 测绘  3签约  4 移交 5拆除 6 还建
                type:3,
                startTime:$scope.starttime||'',
                endTime:$scope.endtime||'',
                schemaId:$scope.scheId||'',//项目对应的层级结构的类型id
                pageNo:$scope.conf.currentPage||1,
                pageSize:$scope.conf.itemPageLimit||10
            }, function (data) {
                if (data.result === true) {
                    var valueArr=[],zhuxinArrkey=[],zhuxinArrval = [];
                    $scope.valueArr2=[];$scope.concat = [];
                    $scope.columnar=data.data.columnar;//左侧柱形

                    $scope.signCountList=data.data.page.rows;//右侧列表
                    //多少页
                    $scope.conf.total = Math.ceil(data.data.page.total/data.data.page.pageSize);
                    //共有多少条数据
                    $scope.conf.counts = data.data.page.total;

                    $scope.$broadcast("categoryLoaded");

                    $scope.leftarr=data.data.countMap;//左侧扇形
                    if($scope.leftarr){
                        $scope.leftarr.forEach(function(item,index){
                            valueArr[index]={
                                name:$scope.leftarr[index].name,
                                value:$scope.leftarr[index].scale
                            }
                        })
                        
                    }
                    // if($scope.columnar){
                    //     $scope.columnar.forEach(function(item,index){
                    //         zhuxinArrkey.push($scope.columnar[index].name)
                    //         zhuxinArrval.push($scope.columnar[index].number)
                    //         $scope.valueArr2[index]={
                    //             name:$scope.columnar[index].name,
                    //             value:$scope.columnar[index].number
                    //         }
                    //     })
                    // }
                    // console.log($scope.valueArr2)
                    if($scope.leftarr && $scope.columnar){
                        $scope.leftarr.forEach(function(item,index){
                            
                            $scope.concat[index]={
                                name1:$scope.leftarr[index].name+'比率',
                                value1:$scope.leftarr[index].scale+'%',
                                name2:$scope.columnar[index].name+'栋数',
                                value2:$scope.columnar[index].number+'栋',
                            }
                        })
                    }
                    ecarh(valueArr)
                    // ecarh2(zhuxinArrkey,zhuxinArrval)
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        roomtype().then((data)=>{
            // areas(data)
        })
        areas()

        let datas = {
            "result": true,
            "message": null,
            "data": {
                "month5": 5, //5月
                "month1": 1, //1月
                "value1": 532.33, //一月面积
                "month2": 2, //二月
                "month3": 3, //二月
                "value2": 617.29, //二月面积
                "value5": 401.15 //五月面积
            }
        }
        let zhuxinArrkey = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        let zhuxinArrval = [0,0,0,0,0,0,0,0,0,0,0,0]
        $scope.donglist = []
        function areas(id) {
            server.server().zjcountquerySignCountdo({
                projectId:$scope.projectId,
                schemaId:id
            }, function (data) {
                if (data.result === true) {
                    var areasdata = data.data.numberMap
                    $scope.allarea = data.data.areaMap.area
                    for(let key in areasdata){
                        if(key==='value1'){
                            zhuxinArrval[0] = areasdata[key]
                        }else if(key==='value2'){
                            zhuxinArrval[1] = areasdata[key]
                        }else if(key==='value3'){
                            zhuxinArrval[2] = areasdata[key]
                        }else if(key==='value4'){
                            zhuxinArrval[3] = areasdata[key]
                        }else if(key==='value5'){
                            zhuxinArrval[4] = areasdata[key]
                        }else if(key==='value6'){
                            zhuxinArrval[5] = areasdata[key]
                        }else if(key==='value7'){
                            zhuxinArrval[6] = areasdata[key]
                        }else if(key==='value8'){
                            zhuxinArrval[7] = areasdata[key]
                        }else if(key==='value9'){
                            zhuxinArrval[8] = areasdata[key]
                        }else if(key==='value10'){
                            zhuxinArrval[9] = areasdata[key]
                        }else if(key==='value11'){
                            zhuxinArrval[10] = areasdata[key]
                        }else if(key==='value12'){
                            zhuxinArrval[11] = areasdata[key]
                        }
                            
                    }
                    for(var j = 0;j<zhuxinArrval.length;j++){
                        $scope.donglist[j]={
                            key:zhuxinArrkey[j],
                            val:zhuxinArrval[j]
                        }
                    }
                    ecarh2(zhuxinArrkey,zhuxinArrval)
                    $scope.$apply()
    
                } else {
                    alert(data.message);
                }
            }, function (err) {
    
            });
        }
         // 饼图
         function ecarh(valueArr){
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data:valueArr
                    }
                ]
            });
            $scope.salesControlArr=valueArr;
        }
        //树状图
        function ecarh2(zhuxinArrkey,zhuxinArrval){
            var myChart = echarts.init(document.getElementById('main2'));
            myChart.setOption({
                xAxis: {
                    data: zhuxinArrkey
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 200,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                tooltip: {},
                series : [
                    {
                        name: '访问来源',
                        type: 'bar',
                        data:zhuxinArrval
                    }
                ]
            });
            // $scope.followCountArr=[
            //     {value:valueArr[0]?valueArr[0]:0, name:'一月'},
            //     {value:valueArr[1]?valueArr[1]:0, name:'二月'},
            //     {value:valueArr[2]?valueArr[2]:0, name:'三月'},
            //     {value:valueArr[3]?valueArr[3]:0, name:'四月'},
            //     {value:valueArr[4]?valueArr[4]:0, name:'五月'},
            //     {value:valueArr[5]?valueArr[5]:0, name:'六月'},
            //     {value:valueArr[6]?valueArr[6]:0, name:'七月'},
            //     {value:valueArr[7]?valueArr[7]:0, name:'八月'},
            //     {value:valueArr[8]?valueArr[8]:0, name:'九月'},
            //     {value:valueArr[9]?valueArr[9]:0, name:'十月'},
            //     {value:valueArr[10]?valueArr[10]:0, name:'十一月'},
            //     {value:valueArr[11]?valueArr[11]:0, name:'十二月'}
            // ]

        }
                // 1 初步沟通 2 测绘  3签约  4 移交 5拆除 6 还建

        // 导出
        $scope.exportLink=$scope.host+'count/queryCountData.do?projectId='+
                        $scope.projectId+'&startTime='+($scope.starttime||'')+'&endTime='
                        +($scope.endtime||'')+'&type=3'+'&exportType=1'+
                        '&schemaId='+($scope.scheId||'')+'&pageNo='+$scope.conf.currentPage+
                        '&pageSize='+$scope.conf.itemPageLimit;
                        console.log("kl"+$scope.exportLink)

        //物业范围
        function roomtype () {
            return new Promise((resolve,reject)=>{
                server.server().zjcountfindRoomTypesdo({
                    projectId:$scope.projectId
                }, function (data) {
                    if (data.result === true) {
                        $scope.propertyList=data.data.types;
                        resolve($scope.propertyList[0].id)
                        $scope.$apply($scope.propertyList)
                    } else {
                        alert(data.message);
                    }
                });
            })
        }
        // 下拉选择
        $scope.changeData = function(val,flag){
            //测绘进度列表
            if(flag==1){
                signData()
                areas($scope.scheId)
            }
        }





        
    }])
    //数据统计-财务
    .controller('dataFinanceCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        $scope.imgHost=server.server().imgHost;
        $scope.host=server.server().host;

        //物业范围
        server.server().zjcountfindRoomTypesdo({
            projectId:$scope.projectId
        }, function (data) {
            if (data.result === true) {
                $scope.propertyList=data.data.types;
                $scope.$apply($scope.propertyList)
            } else {
                alert(data.message);
            }
        });
        // 下拉选择
        $scope.changeData = function(val,flag){
            //测绘进度列表
            if(flag==1){
                otherHousePropertyData()
            }
        }

        //时间控件
        $scope.mychange=function(txt1,txt2,flag) {
            laydate.render({
                elem: '.'+txt1
                // ,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.'+txt2 //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    if(flag==0){
                        $scope.starttime=val;
                        otherHousePropertyData($scope.starttime,$scope.endtime,$scope.scheId)
                    }else if(flag==1){
                        $scope.endtime=val;
                        otherHousePropertyData($scope.starttime,$scope.endtime,$scope.scheId)
                    }else if(flag==2){
                        $scope.followStartTime=val;
                        otherSquareMeterData($scope.followStartTime,$scope.followEndTime,$scope.scheId2)
                    }else if(flag==3){
                        $scope.followEndTime=val;
                        otherSquareMeterData($scope.followStartTime,$scope.followEndTime,$scope.scheId2)
                    }else if(flag==4){
                        $scope.noSignStartTime=val;
                        otherHousePropertyData($scope.noSignStartTime,$scope.noSignEndTime)
                    }else if(flag==5){
                        $scope.noSignEndTime=val;
                        otherHousePropertyData($scope.noSignStartTime,$scope.noSignEndTime)
                    }
                }

            });
        }



        // 饼图
        function ecarh(valueArr){
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data:valueArr
                    }
                ]
            });
            $scope.salesControlArr=valueArr;
        }



        otherHousePropertyData()
        //测绘进度列表
        function otherHousePropertyData(starttime,endtime){
            var valueArr=[]
            server.server().financeDataList({
                projectId:$scope.projectId,
                startTime:starttime||'',
                endTime:endtime||'',
                exportType:0,
                schId:$scope.scheId||''
            }, function (data) {
                if (data.result === true) {
                    // 右边列表
                    $scope.rightarr = data.data.signCountList;
                    // 左则图
                    $scope.leftarr = data.data.countMap;
                    if($scope.leftarr){
                        $scope.leftarr.forEach(function(item,index){
                            valueArr[index]={
                                name:$scope.leftarr[index].name,
                                value:$scope.leftarr[index].percentage
                            }
                        })
                        
                    }
                    ecarh(valueArr);
                    
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        // 导出1
        $scope.exportLink=$scope.host+'count/queryFincialDataList.do?projectId='+
                        $scope.projectId+'&startTime='+($scope.starttime||'')+'&endTime='
                        +($scope.endtime||'')+'&schId='+($scope.scheId||'')+'&exportType=1';
        
        



    }])
    //数据统计-其他
    .controller('dataOtherCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        $scope.imgHost=server.server().imgHost;
        $scope.starttime='';
        $scope.endtime='';
        $scope.followStartTime='';
        $scope.followEndTime='';
        $scope.noSignStartTime='';
        $scope.noSignEndTime='';
        //时间控件
        $scope.mychange=function(txt1,txt2,flag) {
            laydate.render({
                elem: '.'+txt1
                // ,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.'+txt2 //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    if(flag==0){
                        $scope.starttime=val;
                        otherHousePropertyData($scope.starttime,$scope.endtime,$scope.scheId)
                    }else if(flag==1){
                        $scope.endtime=val;
                        otherHousePropertyData($scope.starttime,$scope.endtime,$scope.scheId)
                    }else if(flag==2){
                        $scope.followStartTime=val;
                        otherSquareMeterData($scope.followStartTime,$scope.followEndTime,$scope.scheId2)
                    }else if(flag==3){
                        $scope.followEndTime=val;
                        otherSquareMeterData($scope.followStartTime,$scope.followEndTime,$scope.scheId2)
                    }else if(flag==4){
                        $scope.noSignStartTime=val;
                        otherHousePropertyData($scope.noSignStartTime,$scope.noSignEndTime)
                    }else if(flag==5){
                        $scope.noSignEndTime=val;
                        otherHousePropertyData($scope.noSignStartTime,$scope.noSignEndTime)
                    }
                }

            });
        }
        server.server().zjroomsearchForConditiondo({
            projectId:$scope.projectId,
        }, function (data) {
            if (data.result === true) {
                $scope.propertyList=data.data;//物业范围
                $scope.$apply()

            } else {
                alert(data.message);
            }
        });
        $scope.changeData=function(flag){
            if(flag==1){
                otherHousePropertyData($scope.starttime,$scope.endtime,$scope.scheId);
            }else if(flag==2){
                otherSquareMeterData($scope.followStartTime,$scope.followEndTime,$scope.scheId2);
                console.log($scope.scheId2)
            }

        }
        //房产证列表
        function otherHousePropertyData(starttime,endtime,scheId){
            server.server().otherHousePropertyDataList({
                projectId:$scope.projectId,
                startTime:starttime,
                endTime:endtime,
                exportType:0,
                schemaId:scheId||''
            }, function (data) {
                if (data.result === true) {
                    $scope.otherHouseCountMap=data.data.fanShaped;//左侧图表
                    $scope.otherHouseCountList=data.data.roomList;//右侧列表
                    var valueArr=[],nameArr=[];
                        valueArr=[{name:'有房产证数量',value:$scope.otherHouseCountMap.haveCount},
                        {name:'无房产证数量',value:$scope.otherHouseCountMap.notHaveCount}];

                    ecarh(valueArr);
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        otherHousePropertyData('','',$scope.scheId||'');
        $scope.exportLink='count/otherHousePropertyCount.do?projectId='+$scope.projectId+'&startTime='+$scope.starttime+'&endTime='+$scope.endtime+'&exportType=1'+($scope.scheId?'&schemaId='+$scope.scheId:'');
        console.log($scope.exportLink)
        //圆饼图
        function ecarh(valueArr){
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data:valueArr
                    }
                ]
            });
            $scope.salesControlArr=$scope.otherHouseCountMap;
        }
        $scope.exportFollowLink='count/otherSquareMeter.do?projectId='+$scope.projectId+'&startTime='+$scope.followStartTime+'&endTime='+$scope.followEndTime+'&exportType=1'+($scope.scheId2?'&schemaId='+$scope.scheId2:'');
        console.log($scope.imgHost+$scope.exportFollowLink)
        otherSquareMeterData('','','')
        //480
        function otherSquareMeterData(starttime,endtime,scheId2){
            server.server().otherSquareMeterDataList({
                projectId:$scope.projectId,
                startTime:starttime,
                endTime:endtime,
                exportType:0,
                schemaId:scheId2||''
            }, function (data) {
                if (data.result === true) {
                    $scope.otherSquareCountMap=data.data.fanShaped;//左侧图表
                    $scope.otherSquareCountList=data.data.squareMeterList;//右侧列表
                    var valueArr=[],nameArr=[];
                    valueArr=[{name:'小于480百分比',value:$scope.otherSquareCountMap.lessThanPercentage},{name:'大于480百分比',value:$scope.otherSquareCountMap.greaterThanPercentage}];
                    ecarh2(valueArr);
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        // $scope.exportFollowLink='count/otherSquareMeter.do?projectId='+$scope.projectId+'&startTime='+$scope.followStartTime+'&endTime='+$scope.followEndTime+'&exportType=1'+'&schemaId='+$scope.scheId2;
        //圆饼图
        function ecarh2(valueArr){
            var myChart = echarts.init(document.getElementById('main2'));
            myChart.setOption({
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data:valueArr
                    }
                ]
            });
            $scope.otherSquareArr=valueArr;

        }
    }])
    //数据统计-测绘
    .controller('dataSurveyCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        $scope.imgHost=server.server().imgHost;
        $scope.host = server.server().host;
        $scope.starttime='';
        $scope.endtime='';

        //时间控件
        $scope.mychange=function(txt1,txt2,flag) {
            laydate.render({
                elem: '.'+txt1
                // ,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.'+txt2 //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    if(flag==0){
                        $scope.starttime=val;
                        signData()
                    }else if(flag==1){
                        $scope.endtime=val;
                        signData()
                    }
                }

            });
        }
        //分页配置
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit' , function(news){
            signData()
        })

        //最新接口之--签约进度列表
        function signData(){
            server.server().zjcountqueryCountDatado({
                projectId:$scope.projectId,
                exportType:0,
                // 1 初步沟通 2 测绘  3签约  4 移交 5拆除 6 还建
                type:2,
                startTime:$scope.starttime||'',
                endTime:$scope.endtime||'',
                schemaId:$scope.scheId||'',//项目对应的层级结构的类型id
                pageNo:$scope.conf.currentPage||1,
                pageSize:$scope.conf.itemPageLimit||10
            }, function (data) {
                if (data.result === true) {
                    console.log(data.data)
                    var valueArr=[],zhuxinArrkey=[],zhuxinArrval = [];
                    $scope.valueArr2 = [];
                    $scope.concat = [];
                    $scope.columnar=data.data.columnar;//左侧柱形

                    $scope.signCountList=data.data.page.rows;//右侧列表
                    //多少页
                    $scope.conf.total = Math.ceil(data.data.page.total/data.data.page.pageSize);
                    //共有多少条数据
                    $scope.conf.counts = data.data.page.total;

                    $scope.$broadcast("categoryLoaded");

                    $scope.leftarr=data.data.countMap;//左侧扇形
                    if($scope.leftarr){
                        $scope.leftarr.forEach(function(item,index){
                            valueArr[index]={
                                name:$scope.leftarr[index].name,
                                value:$scope.leftarr[index].scale
                            }
                        })
                    }
                    // if($scope.columnar){
                    //     $scope.columnar.forEach(function(item,index){
                    //         zhuxinArrkey.push($scope.columnar[index].name)
                    //         zhuxinArrval.push($scope.columnar[index].number)
                    //         $scope.valueArr2[index]={
                    //             name:$scope.columnar[index].name,
                    //             value:$scope.columnar[index].number
                    //         }
                    //     })


                        
                    // }

                    if($scope.leftarr && $scope.columnar){
                        $scope.leftarr.forEach(function(item,index){
                            
                            $scope.concat[index]={
                                name1:$scope.leftarr[index].name+'比率',
                                value1:$scope.leftarr[index].scale+'%',
                                name2:$scope.columnar[index].name+'栋数',
                                value2:$scope.columnar[index].number+'栋',
                            }
                        })
                    }
                    
                    ecarh(valueArr)
                    // ecarh2(zhuxinArrkey,zhuxinArrval)
                    // console.log(zhuxinArrkey,zhuxinArrval)
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        roomtype().then((data)=>{
            // areas(data)
        })
        areas()
        let datas = {
            "result": true,
            "message": null,
            "data": {
                "month5": 5, //5月
                "month1": 1, //1月
                "value1": 532.33, //一月面积
                "month2": 2, //二月
                "month3": 3, //二月
                "value2": 617.29, //二月面积
                "value5": 401.15 //五月面积
            }
        }
        let zhuxinArrkey = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        let zhuxinArrval = [0,0,0,0,0,0,0,0,0,0,0,0]
        $scope.donglist = []
        function areas(id) {
            server.server().zjcountquerySurveryAreado({
                projectId:$scope.projectId,
                schemaId:id
            }, function (data) {
                if (data.result === true) {
                    var areasdata = data.data.numberMap
                    $scope.allarea = data.data.areaMap.area
                    console.log(areasdata)
                    for(let key in areasdata){
                        if(key==='value1'){
                            zhuxinArrval[0] = areasdata[key]
                        }else if(key==='value2'){
                            zhuxinArrval[1] = areasdata[key]
                        }else if(key==='value3'){
                            zhuxinArrval[2] = areasdata[key]
                        }else if(key==='value4'){
                            zhuxinArrval[3] = areasdata[key]
                        }else if(key==='value5'){
                            zhuxinArrval[4] = areasdata[key]
                        }else if(key==='value6'){
                            zhuxinArrval[5] = areasdata[key]
                        }else if(key==='value7'){
                            zhuxinArrval[6] = areasdata[key]
                        }else if(key==='value8'){
                            zhuxinArrval[7] = areasdata[key]
                        }else if(key==='value9'){
                            zhuxinArrval[8] = areasdata[key]
                        }else if(key==='value10'){
                            zhuxinArrval[9] = areasdata[key]
                        }else if(key==='value11'){
                            zhuxinArrval[10] = areasdata[key]
                        }else if(key==='value12'){
                            zhuxinArrval[11] = areasdata[key]
                        }
                            
                    }
                    for(var j = 0;j<zhuxinArrval.length;j++){
                        $scope.donglist[j]={
                            key:zhuxinArrkey[j],
                            val:zhuxinArrval[j]
                        }
                    }
                    ecarh2(zhuxinArrkey,zhuxinArrval)
                    $scope.$apply()
    
                } else {
                    alert(data.message);
                }
            }, function (err) {
    
            });
        }
        

         // 饼图
         function ecarh(valueArr){
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data:valueArr
                    }
                ]
            });
            $scope.salesControlArr=valueArr;
        }
        //树状图
        function ecarh2(zhuxinArrkey,zhuxinArrval){
            var myChart = echarts.init(document.getElementById('main2'));
            myChart.setOption({
                xAxis: {
                    data: zhuxinArrkey
                },
                tooltip: {},
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 200,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                series : [
                    {
                        name: '访问来源',
                        type: 'bar',
                        data:zhuxinArrval
                    }
                ]
            });
            // $scope.followCountArr=[
            //     {value:valueArr[0]?valueArr[0]:0, name:'一月'},
            //     {value:valueArr[1]?valueArr[1]:0, name:'二月'},
            //     {value:valueArr[2]?valueArr[2]:0, name:'三月'},
            //     {value:valueArr[3]?valueArr[3]:0, name:'四月'},
            //     {value:valueArr[4]?valueArr[4]:0, name:'五月'},
            //     {value:valueArr[5]?valueArr[5]:0, name:'六月'},
            //     {value:valueArr[6]?valueArr[6]:0, name:'七月'},
            //     {value:valueArr[7]?valueArr[7]:0, name:'八月'},
            //     {value:valueArr[8]?valueArr[8]:0, name:'九月'},
            //     {value:valueArr[9]?valueArr[9]:0, name:'十月'},
            //     {value:valueArr[10]?valueArr[10]:0, name:'十一月'},
            //     {value:valueArr[11]?valueArr[11]:0, name:'十二月'}
            // ]

        }


        
                // 1 初步沟通 2 测绘  3签约  4 移交 5拆除 6 还建

        // 导出
        $scope.exportLink=$scope.host+'count/queryCountData.do?projectId='+
                        $scope.projectId+'&startTime='+($scope.starttime||'')+'&endTime='
                        +($scope.endtime||'')+'&type=3'+'&exportType=1'+
                        '&schemaId='+($scope.scheId||'')+'&pageNo='+$scope.conf.currentPage+
                        '&pageSize='+$scope.conf.itemPageLimit;
                        console.log($scope.exportLink)

        //物业范围
        function roomtype () {
            return new Promise((resolve,reject)=>{
                server.server().zjcountfindRoomTypesdo({
                    projectId:$scope.projectId
                }, function (data) {
                    if (data.result === true) {
                        $scope.propertyList=data.data.types;
                        resolve($scope.propertyList[0].id)
                        $scope.$apply($scope.propertyList)
                    } else {
                        alert(data.message);
                    }
                });
            })
        }
        
        // 下拉选择
        $scope.changeData = function(val,flag){
            //测绘进度列表
            if(flag==1){
                signData()
                areas($scope.scheId)
            }
        }





    }])
    //数据统计-移交
    .controller('wuyeyijiaoCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        $scope.imgHost=server.server().imgHost;
        $scope.host = server.server().host;
        $scope.starttime='';
        $scope.endtime='';

        //时间控件
        $scope.mychange=function(txt1,txt2,flag) {
            laydate.render({
                elem: '.'+txt1
                // ,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
                , format: 'yyyy-MM-dd' //可任意组合
                , show: true //直接显示
                , closeStop: '.'+txt2 //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
                , done:function(val){
                    if(flag==0){
                        $scope.starttime=val;
                        signData()
                    }else if(flag==1){
                        $scope.endtime=val;
                        signData()
                    }
                }

            });
        }
        //分页配置
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit' , function(news){
            signData()
        })

        //最新接口之--签约进度列表
        function signData(){
            server.server().zjcountqueryCountDatado({
                projectId:$scope.projectId,
                exportType:0,
                // 1 初步沟通 2 测绘  3签约  4 移交 5拆除 6 还建
                type:4,
                startTime:$scope.starttime||'',
                endTime:$scope.endtime||'',
                schemaId:$scope.scheId||'',//项目对应的层级结构的类型id
                pageNo:$scope.conf.currentPage||1,
                pageSize:$scope.conf.itemPageLimit||10
            }, function (data) {
                if (data.result === true) {
                    console.log(data.data)
                    var valueArr=[],zhuxinArrkey=[],zhuxinArrval = [];$scope.concat = [];$scope.valueArr2 = [];
                    $scope.columnar=data.data.columnar;//左侧柱形

                    $scope.signCountList=data.data.page.rows;//右侧列表
                    //多少页
                    $scope.conf.total = Math.ceil(data.data.page.total/data.data.page.pageSize);
                    //共有多少条数据
                    $scope.conf.counts = data.data.page.total;

                    $scope.$broadcast("categoryLoaded");

                    $scope.leftarr=data.data.countMap;//左侧扇形
                    if($scope.leftarr){
                        $scope.leftarr.forEach(function(item,index){
                            valueArr[index]={
                                name:$scope.leftarr[index].name,
                                value:$scope.leftarr[index].scale
                            }
                        })
                        
                    }
                    if($scope.leftarr && $scope.columnar){
                        $scope.leftarr.forEach(function(item,index){
                            
                            $scope.concat[index]={
                                name1:$scope.leftarr[index].name+'比率',
                                value1:$scope.leftarr[index].scale+'%',
                                name2:$scope.columnar[index].name+'栋数',
                                value2:$scope.columnar[index].number+'栋',
                            }
                        })
                    }
                    // if($scope.columnar){
                    //     $scope.columnar.forEach(function(item,index){
                    //         zhuxinArrkey.push($scope.columnar[index].name)
                    //         zhuxinArrval.push($scope.columnar[index].number)
                    //         $scope.valueArr2[index]={
                    //             name:$scope.columnar[index].name,
                    //             value:$scope.columnar[index].number
                    //         }
                    //     })
                    // }
                    ecarh(valueArr)
                    // ecarh2(zhuxinArrkey,zhuxinArrval)
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        roomtype().then((data)=>{
            
        })
        areas()

        let datas = {
            "result": true,
            "message": null,
            "data": {
                "month5": 5, //5月
                "month1": 1, //1月
                "value1": 532.33, //一月面积
                "month2": 2, //二月
                "month3": 3, //二月
                "value2": 617.29, //二月面积
                "value5": 401.15 //五月面积
            }
        }
        let zhuxinArrkey = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        let zhuxinArrval = [0,0,0,0,0,0,0,0,0,0,0,0]
        $scope.donglist = []
        function areas(id) {
            server.server().zjcountqueryTransferCountdo({
                projectId:$scope.projectId,
                schemaId:id
            }, function (data) {
                if (data.result === true) {
                    // var areasdata = data.data
                    var areasdata = data.data.numberMap
                    $scope.allarea = data.data.areaMap.area
                    for(let key in areasdata){
                        if(key==='value1'){
                            zhuxinArrval[0] = areasdata[key]
                        }else if(key==='value2'){
                            zhuxinArrval[1] = areasdata[key]
                        }else if(key==='value3'){
                            zhuxinArrval[2] = areasdata[key]
                        }else if(key==='value4'){
                            zhuxinArrval[3] = areasdata[key]
                        }else if(key==='value5'){
                            zhuxinArrval[4] = areasdata[key]
                        }else if(key==='value6'){
                            zhuxinArrval[5] = areasdata[key]
                        }else if(key==='value7'){
                            zhuxinArrval[6] = areasdata[key]
                        }else if(key==='value8'){
                            zhuxinArrval[7] = areasdata[key]
                        }else if(key==='value9'){
                            zhuxinArrval[8] = areasdata[key]
                        }else if(key==='value10'){
                            zhuxinArrval[9] = areasdata[key]
                        }else if(key==='value11'){
                            zhuxinArrval[10] = areasdata[key]
                        }else if(key==='value12'){
                            zhuxinArrval[11] = areasdata[key]
                        }
                            
                    }
                    for(var j = 0;j<zhuxinArrval.length;j++){
                        $scope.donglist[j]={
                            key:zhuxinArrkey[j],
                            val:zhuxinArrval[j]
                        }
                    }
                    ecarh2(zhuxinArrkey,zhuxinArrval)
                    $scope.$apply()
    
                } else {
                    alert(data.message);
                }
            }, function (err) {
    
            });
        }

         // 饼图
         function ecarh(valueArr){
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data:valueArr
                    }
                ]
            });
            $scope.salesControlArr=valueArr;
        }
        //树状图
        function ecarh2(zhuxinArrkey,zhuxinArrval){
            var myChart = echarts.init(document.getElementById('main2'));
            myChart.setOption({
                xAxis: {
                    data: zhuxinArrkey
                },
                tooltip: {},
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 200,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                series : [
                    {
                        name: '访问来源',
                        type: 'bar',
                        data:zhuxinArrval
                    }
                ]
            });
            // $scope.followCountArr=[
            //     {value:valueArr[0]?valueArr[0]:0, name:'一月'},
            //     {value:valueArr[1]?valueArr[1]:0, name:'二月'},
            //     {value:valueArr[2]?valueArr[2]:0, name:'三月'},
            //     {value:valueArr[3]?valueArr[3]:0, name:'四月'},
            //     {value:valueArr[4]?valueArr[4]:0, name:'五月'},
            //     {value:valueArr[5]?valueArr[5]:0, name:'六月'},
            //     {value:valueArr[6]?valueArr[6]:0, name:'七月'},
            //     {value:valueArr[7]?valueArr[7]:0, name:'八月'},
            //     {value:valueArr[8]?valueArr[8]:0, name:'九月'},
            //     {value:valueArr[9]?valueArr[9]:0, name:'十月'},
            //     {value:valueArr[10]?valueArr[10]:0, name:'十一月'},
            //     {value:valueArr[11]?valueArr[11]:0, name:'十二月'}
            // ]

        }
                // 1 初步沟通 2 测绘  3签约  4 移交 5拆除 6 还建

        // 导出
        $scope.exportLink=$scope.host+'count/queryCountData.do?projectId='+
                        $scope.projectId+'&startTime='+($scope.starttime||'')+'&endTime='
                        +($scope.endtime||'')+'&type=3'+'&exportType=1'+
                        '&schemaId='+($scope.scheId||'')+'&pageNo='+$scope.conf.currentPage+
                        '&pageSize='+$scope.conf.itemPageLimit;

        //物业范围
        function roomtype () {
            return new Promise((resolve,reject)=>{
                server.server().zjcountfindRoomTypesdo({
                    projectId:$scope.projectId
                }, function (data) {
                    if (data.result === true) {
                        $scope.propertyList=data.data.types;
                        resolve($scope.propertyList[0].id)
                        $scope.$apply($scope.propertyList)
                    } else {
                        alert(data.message);
                    }
                });
            })
        }
        // 下拉选择
        $scope.changeData = function(val,flag){
            //测绘进度列表
            if(flag==1){
                signData()
                areas($scope.scheId)
            }
        }





    }])
    //数据统计-自定义报表
    .controller('dataFileCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.projectId=$state.params.projectid;
        $scope.imgHost=server.server().imgHost;
        $scope.host = server.server().host;
        $scope.arrs=[{name:'还建类型统计'},{name:'补偿项目条件'},{name:'补偿类型条件'},{name:'签约阶段条件'}]
        // 盒子
        function box(arr){
            if(!arr || arr.length<=0){
                return;
            }
            for(var i = 0;i<arr.length;i++){
                arr[i].status = false;
            }
            return arr
        }
        
        function list(){
            server.server().zjcountquerySearchCriteriado({
            }, function (data) {
                if (data.result) {
                    // /还建类型统计
                    $scope.rebuildTypeList = data.data.rebuildTypeList
                    box($scope.rebuildTypeList)
                    // 补偿项目条件
                    $scope.compensateProjectList = data.data.compensateProjectList
                    box($scope.compensateProjectList)
                    // 补偿类型条件(这个比较高级有父子级)
                    $scope.compensateTypeList = data.data.compensateTypeList
                    box($scope.compensateTypeList)
                    // 签约阶段条件
                    $scope.orderSignList = data.data.orderSignList
                    box($scope.orderSignList)
                    
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            });
        }
        list();
        

        



        // projectId	项目id	是	
        // signId	签约阶段id	否	多个逗号分割
        // compensateProjecId	补偿项目id	否	多个逗号分割

        // compensateTypeId	补偿类型父级id	否	多个逗号分割
        // compensateTypeSublevelId	补偿类型子级id	否	多个逗号分割
        
        // 导出

        $scope.extend = function(){

            $scope.compensateProjecId = [];
            $scope.signId = [];
            $scope.zhanshimeiyou = [];  //暂时没有

            $scope.compensateTypeId = [];
            $scope.compensateTypeSublevelId = [];

            // 高级货
            if($scope.compensateTypeList && $scope.compensateTypeList.length>=0){
                for(var i = 0;i<$scope.compensateTypeList.length;i++){
                   if( $scope.compensateTypeList[i].status){
                       if($scope.compensateTypeList[i].parentId){
                        $scope.compensateTypeSublevelId.push($scope.compensateTypeList[i].id)
                       }else{
                        $scope.compensateTypeId.push($scope.compensateTypeList[i].id)
                       }
                    
                   }
                }
            }



            if($scope.compensateProjectList && $scope.compensateProjectList.length>=0){
                for(var i = 0;i<$scope.compensateProjectList.length;i++){
                   if( $scope.compensateProjectList[i].status){
                    $scope.compensateProjecId.push($scope.compensateProjectList[i].id)
                   }
                }
            }

            if($scope.orderSignList && $scope.orderSignList.length>=0){
                for(var i = 0;i<$scope.orderSignList.length;i++){
                   if( $scope.orderSignList[i].status){
                    $scope.signId.push($scope.orderSignList[i].id)
                   }
                }
            }

            if($scope.rebuildTypeList && $scope.rebuildTypeList.length>=0){
                for(var i = 0;i<$scope.rebuildTypeList.length;i++){
                   if( $scope.rebuildTypeList[i].status){
                    $scope.zhanshimeiyou.push($scope.rebuildTypeList[i].id)
                   }
                }
            }

            if($scope.compensateProjecId.length==0&&$scope.signId.length==0&&$scope.zhanshimeiyou.length==0&&
                $scope.compensateTypeId.length==0&&$scope.compensateTypeSublevelId.length==0){
                    alert('您未勾选任何条件！');
                    return;
                }
               
                        
            $scope.link = $scope.host+'count/createReportForms.do?projectId='+$scope.projectId
                        +'&signId='+($scope.signId.toString()||'')
                        +'&compensateProjecId='+($scope.compensateProjecId.toString()||'')
                        +'&compensateTypeId='+($scope.compensateTypeId.toString()||'')
                        +'&compensateTypeSublevelId='+($scope.compensateTypeSublevelId.toString()||'');
                        console.log($scope.link)
            window.open($scope.link)
        }
       




    }])
    //知识库-首页内容修改
    .controller('knowledgeCtrl', ['$http', '$scope','server', '$state','dict','$rootScope','$sce',function($http, $scope,server,$state,dict,$rootScope,$sce){
        //取消function
        function cancel(){
            //战略目标
            $scope.targetname='';
            $scope.targetlink='';
            $scope.targetcontent='';
            $scope.fileName = '';
            $scope.filePath = '';
            //战略定位
            $scope.positionname='';
            $scope.positionlink='';
            $scope.positioncontent='';
            //开发理念
            $scope.thoughtname='';
            $scope.thoughtlink='';
            $scope.thoughtcontent='';
            //客户热线
            $scope.telephone='';
        }
        $scope.clearData=function(){
            cancel();
            $scope.goalsort=0;
            $scope.synopsis='';
            $scope.positionsort=0;
            $scope.thoughtsort=0;
        }


        server.server().zjcolumnqueryColumndo({
        }, function (data) {
            if (data.result) {
                $scope.indexwordarr = data.data;
                $scope.indexwordarr.forEach(function(item,index){
                    // "columnNo": 2, // 1品牌介绍  2品牌简介 3 品牌荣誉 4 代表项目
                    if(item.columnNo==1){
                        $scope.brandintroduced = item.name
                    }
                    if(item.columnNo==2){
                        $scope.brandintrodjian = item.name
                    }
                    if(item.columnNo==3){
                        $scope.brandintrodyu = item.name
                    }
                    if(item.columnNo==4){
                        $scope.brandintrodxiangmu = item.name
                    }
                })
            }
        }, function (err) {

        });


       
        $scope.hostname=server.server().imgHost;
        var createUser=server.server().userId;
        //排序列表
        // $scope.sortlist=[{
        //     sort:0,
        //     name:'--请选择--'
        // },{
        //     sort:1,
        //     name:'置顶1'
        // },{
        //     sort:2,
        //     name:'置顶2'
        // },{
        //     sort:3,
        //     name:'置顶3'
        // }];
        // $scope.editlist=[{
        //     sort:1,
        //     name:'置顶1'
        // },{
        //     sort:2,
        //     name:'置顶2'
        // },{
        //     sort:3,
        //     name:'置顶3'
        // }]

        //排序默认值
        //$scope.sort=0;
        $scope.thoughtsort=0;
        $scope.goalsort=0;
        $scope.positionsort=0;
        $scope.synopsis = '';

        //配置富文本
        $scope.config = {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [
                [
                    'anchor', //锚点
                    'undo', //撤销
                    'redo', //重做
                    'bold', //加粗
                    'indent', //首行缩进
                    'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    'superscript', //上标
                    'formatmatch', //格式刷
                    'source', //源代码
                    'blockquote', //引用
                    'pasteplain', //纯文本粘贴模式
                    'selectall', //全选
                    'print', //打印
                    'preview', //预览
                    'horizontal', //分隔线
                    'removeformat', //清除格式
                    'time', //时间
                    'date', //日期
                    'unlink', //取消链接
                    'insertrow', //前插入行
                    'insertcol', //前插入列
                    'mergeright', //右合并单元格
                    'mergedown', //下合并单元格
                    'deleterow', //删除行
                    'deletecol', //删除列
                    'splittorows', //拆分成行
                    'splittocols', //拆分成列
                    'splittocells', //完全拆分单元格
                    'deletecaption', //删除表格标题
                    'inserttitle', //插入标题
                    'mergecells', //合并多个单元格
                    'deletetable', //删除表格
                    'cleardoc', //清空文档
                    'insertparagraphbeforetable', //"表格前插入行"
                    'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'simpleupload', //单图上传
                    // 'insertimage', //多图上传
                    'edittable', //表格属性
                    'edittd', //单元格属性
                    'link', //超链接
                    'emotion', //表情
                    'spechars', //特殊字符
                    'searchreplace', //查询替换
                    'map', //Baidu地图
                    'gmap', //Google地图
                    'insertvideo', //视频
                    'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    'directionalityltr', //从左向右输入
                    'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    'pagebreak', //分页
                    'insertframe', //插入Iframe
                    'imagenone', //默认
                    'imageleft', //左浮动
                    'imageright', //右浮动
                    'attachment', //附件
                    'imagecenter', //居中
                    'wordimage', //图片转存
                    'lineheight', //行间距
                    'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    'autotypeset', //自动排版
                    'webapp', //百度应用
                    'touppercase', //字母大写
                    'tolowercase', //字母小写
                    'background', //背景
                    'template', //模板
                    'scrawl', //涂鸦
                    'music', //音乐
                    'inserttable', //插入表格
                    'drafts', // 从草稿箱加载
                    'charts', // 图表
                ]
            ],
            
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            initialFrameWidth: '100%',
            initialFrameHeight: 200,


        };
        $scope.hopruletab=function(val){
            $scope.positionname = '';
            $scope.positionlink = '';
            $scope.positioncontent = '';
            $scope.filePath = '';
            $scope.synopsis = '';
            $scope.fileName = '';
        }


        //添加附件
        $scope.addannex=function(files){
            console.log(files)
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
                console.log($scope.data);
                $scope.fileName = $scope.data.fileName;
                $scope.filePath = $scope.data.filePath;
                $scope.size = $scope.data.size;
            }, function errorCallback(response) {
                alert(response);// 请求失败执行代码
            });
        }
        // 添加function
        function add(status,url,title,content,imgUrl,fileName,sort){
            server.server().addthoughtdata({
                createUser:createUser,
                status:status,
                url:url,
                title:title,
                content:content,
                imgUrl:imgUrl,
                fileName:fileName,
                synopsis:sort||''
            }, function (data) {
                if (data.result === true) {
                    console.log(data);
                    alert(data.message,function(){
                        if(status==1){
                            thought();
                        }else if(status==2){
                            goal();
                        }else if(status==3){
                            position();
                        }
                        $('.dialog').hide();
                    });
                    //共多少页
                    $scope.$apply()

            } else {
                alert(data.message);
            }
        }, function (err) {

            });
        }
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+title', function (news) {
           // initindexlist();
        })
        //查询开发理念
        function thought(){
            server.server().thoughtlist({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit
            }, function (data) {
                if (data.result === true) {
                    $scope.thoughtlist=data.data.rows;
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        };
        thought();
        //查询战略目标
        function goal(){
            server.server().goallist({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit
            }, function (data) {
                if (data.result === true) {
                    $scope.goallist=data.data.rows;
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        };
        goal();
        //查询战略定位
        function position(){
            server.server().positionlist({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit
            }, function (data) {
                if (data.result === true) {
                    $scope.positionlist=data.data.rows;
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        };
        position();
        //查询客户热线
        function tel(){
            server.server().tellist({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit
            }, function (data) {
                if (data.result === true) {
                    $scope.tellist=data.data.rows;
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        tel()
        //添加开发理念
        $scope.addthought=function(type,content){
            add(type,$scope.thoughtlink,$scope.thoughtname,content,'','',$scope.thoughtsort);

        }
        //添加战略目标
        $scope.targetsave=function(type,content,imgUrl,filename){
            add(type,$scope.targetlink,$scope.targetname,content,imgUrl,filename,$scope.goalsort);

        }
        //添加战略定位
        $scope.positionsave=function(type,content,imgUrl,filename){
            add(type,$scope.positionlink,$scope.positionname,content,imgUrl,filename,$scope.synopsis)
        }
        //添加客户热线
        $scope.addtelsave=function(type){
            server.server().addCustomerServiceHotline({
                createUser:createUser,
                status:type,
                mobile:$scope.telephone
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        tel();
                        $scope.telephone='';
                    })
                    //共多少页
                    $scope.$apply()

                } else {
                    alert(data.message);
                    $scope.telephone='';
                }
            }, function (err) {

            });
        }
        // function pansort(sort){
        //     if(sort==1){
        //         return '置顶1';
        //     }else if(sort==2){
        //         return '置顶2';
        //     }else if(sort==3){
        //         return '置顶3';
        //     }else return'空';
        // }
        //查看function
        function watch(id,status,basePath,imgUrl){
            server.server().watchdata({
                id:id
            }, function (data) {
                if (data.result === true) {
                    // $scope.watchlist=data.data;
                    if(status==1){
                        $scope.watchthoughtname=data.data.title;
                        $scope.watchthoughtlink=data.data.url;
                        $scope.wahtchthoughtcontent=data.data.content;
                        $scope.watchthoughtsort=data.data.sort;
                    }else if(status==2){
                        $scope.watchtargetname=data.data.title;
                        $scope.watchtargetlink=data.data.url;
                        $scope.watchtargetcontent=data.data.content;
                        $scope.watchgoalsort=data.data.sort;
                        $scope.watchtargeturl=data.data.basePath+data.data.imgUrl;
                    }else if(status==3){
                        $scope.watchpositionname=data.data.title;
                        $scope.watchpositionlink=data.data.url;
                        $scope.watchpositioncontent=data.data.content;
                        $scope.watchpositionsort=data.data.synopsis;
                        $scope.synopsis=data.data.synopsis;
                        $scope.watchpositionurl=data.data.basePath+data.data.imgUrl;
                    }else if(status==4){
                        $scope.watchtelephone=data.data.mobile;
                    }

                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        /*查看开发理论*/
        $scope.watchthought=function(id,flag){
            $('.'+flag).dialog();
            watch(id,1,'','');

        }
        // 查看战略目标
        $scope.watchtarget=function(id,flag,basePath,imgUrl){
            $('.'+flag).dialog();
            watch(id,2,basePath,imgUrl);
        }
        // 查看战略定位
        $scope.watchposition=function(id,flag,basePath,imgUrl){
            $('.'+flag).dialog();
            watch(id,3,basePath,imgUrl);
        }
        //查看客户热线
        $scope.watchtel=function(id,flag){
            $('.'+flag).dialog();
            watch(id,4,'','');
        }
        //编辑开发理念
        $scope.editthought=function(id,title,url,content,sort,flag){
            $scope.editthoughtname=title;
            $scope.editthoughtlink=url;
            $scope.editthoughtcontent=content;
            // if(sort!=1&&sort!=2&&sort!=3){
            //     $scope.editlist.push({'sort':sort,'name':sort});
            //     $scope.editthoughtsort=sort;
            // }else{
            //     $scope.editthoughtsort=sort;
            // }
            $scope.editthoughtsort=sort;
            $('.'+flag).dialog();
            $scope.thoughtid=id;
        }
        //编辑战略目标
        $scope.edittarget=function(id,title,url,content,sort,fileName,imgUrl,flag){
            $scope.edittargetname=title;
            $scope.edittargetlink=url;
            $scope.edittargetcontent=content;
            $scope.edittargeturl=imgUrl;
            $scope.edittargetFileName=fileName;
            // if(sort!=1&&sort!=2&&sort!=3){
            //     $scope.editlist.push({'sort':sort,'name':sort});
            //     $scope.editgoalsort=sort;
            // }else{
            //     $scope.editgoalsort=sort;
            // }
            $scope.editgoalsort=sort;
            $('.'+flag).dialog();
            $scope.targetid=id;
        }
        //编辑战略定位
        $scope.editposition=function(id,title,url,content,synopsis,fileName,imgUrl,flag){
            $scope.editpositionname=title;
            $scope.editpositionlink=url;
            $scope.editpositioncontent=content;
            $scope.editpositionurl=imgUrl;
            $scope.editpositionFileName=fileName;
            $scope.synopsis=synopsis;
            // if(sort!=1&&sort!=2&&sort!=3){
            //     $scope.editlist.push({'sort':sort,'name':sort});
            //     $scope.editpositionsort=sort;
            // }else{
            //     $scope.editpositionsort=sort;
            // }
            $('.'+flag).dialog();
            $scope.positionid=id;
        }
        //编辑客户热线
        $scope.edittel=function(id,tel,flag){
            $scope.edittelephone=tel;
            $('.'+flag).dialog();
            $scope.telid=id;
        }
        //编辑保存function
        function editsave(status,telephone,url,title,content,id,imgUrl,fileName,sort){
            server.server().editsavedata({
                updateUser:createUser,
                status:status,
                mobile:telephone,
                url:url,
                title:title,
                content:content,
                id:id,
                imgUrl:imgUrl,
                fileName:fileName,
                synopsis:sort||''
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        if(status==1){
                            thought();
                        }else if(status==2){
                            goal();
                            $scope.filePath='';
                            $scope.filename='';
                        }else if(status==3){
                            position();
                            $scope.filePath='';
                            $scope.filename='';
                        }else if(status==4){
                            tel();
                        }
                        if(sort!=1&&sort!=2&&sort!=3){
                            $scope.editlist.splice($scope.editlist.indexOf(sort),1);
                        }else{
                            $scope.editlist=[{
                                sort:1,
                                name:'置顶1'
                            },{
                                sort:2,
                                name:'置顶2'
                            },{
                                sort:3,
                                name:'置顶3'
                            }]
                        };
                    })
                    //共多少页
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        };
        //编辑开发理念保存
        $scope.editthoughtsave=function(){
            editsave(1,'',$scope.editthoughtlink,$scope.editthoughtname,$scope.editthoughtcontent,$scope.thoughtid,'','',$scope.editthoughtsort);
        };
        //编辑战略目标保存
        $scope.edittargetsave=function(imgUrl,filename){
            editsave(2,'',$scope.edittargetlink,$scope.edittargetname,$scope.edittargetcontent,$scope.targetid,imgUrl,filename,$scope.editgoalsort);
        };
        //编辑战略定位保存
        $scope.editpositionsave=function(imgUrl,filename){
            editsave(3,'',$scope.editpositionlink,$scope.editpositionname,$scope.editpositioncontent,$scope.positionid,imgUrl,filename,$scope.synopsis);
        };
        //编辑客户热线保存
        $scope.edittelsave=function(){
            editsave(4,$scope.edittelephone,'','','',$scope.telid,'','','');
        };
        //删除信息
        $scope.deletedata=function(status,id){
            confirm('确定删除？',function(){
                server.server().deletelist({
                    id:id,
                    userId:createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            if(status==1){
                                thought();
                            }else if(status==2){
                                goal();
                            }else if(status==3){
                                position();
                            }else if(status==4){
                                tel();
                            }
                        })
                        $scope.$apply()

                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })

        };
        //编辑取消
        $scope.cancel=function(sort){
            if(sort!=1&&sort!=2&&sort!=3){
                $scope.editlist.splice($scope.editlist.indexOf(sort),1);
            };
            cancel();
        }
    }])
    //知识库-新闻列表
    .controller('newsListCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.hostname=server.server().imgHost;
        var createUser=server.server().userId;
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        };
        //列表function
        function newslist(searchKeys){
            server.server().newslistdata({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit,
                searchKeys:searchKeys?searchKeys:''
            }, function (data) {
                if (data.result === true) {
                    $scope.list=data.data.rows;
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        };
        $scope.$watch('conf.currentPage + conf.itemPageLimit+title+searchKeys', function (news) {
            newslist($scope.searchKeys);
        });
        newslist('');
        //配置富文本
        $scope.config = {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [
                [
                    'anchor', //锚点
                    'undo', //撤销
                    'redo', //重做
                    'bold', //加粗
                    'indent', //首行缩进
                    'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    'superscript', //上标
                    'formatmatch', //格式刷
                    'source', //源代码
                    'blockquote', //引用
                    'pasteplain', //纯文本粘贴模式
                    'selectall', //全选
                    'print', //打印
                    'preview', //预览
                    'horizontal', //分隔线
                    'removeformat', //清除格式
                    'time', //时间
                    'date', //日期
                    'unlink', //取消链接
                    'insertrow', //前插入行
                    'insertcol', //前插入列
                    'mergeright', //右合并单元格
                    'mergedown', //下合并单元格
                    'deleterow', //删除行
                    'deletecol', //删除列
                    'splittorows', //拆分成行
                    'splittocols', //拆分成列
                    'splittocells', //完全拆分单元格
                    'deletecaption', //删除表格标题
                    'inserttitle', //插入标题
                    'mergecells', //合并多个单元格
                    'deletetable', //删除表格
                    'cleardoc', //清空文档
                    'insertparagraphbeforetable', //"表格前插入行"
                    'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'simpleupload', //单图上传
                    // 'insertimage', //多图上传
                    'edittable', //表格属性
                    'edittd', //单元格属性
                    'link', //超链接
                    'emotion', //表情
                    'spechars', //特殊字符
                    'searchreplace', //查询替换
                    'map', //Baidu地图
                    'gmap', //Google地图
                    'insertvideo', //视频
                    'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    'directionalityltr', //从左向右输入
                    'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    'pagebreak', //分页
                    'insertframe', //插入Iframe
                    'imagenone', //默认
                    'imageleft', //左浮动
                    'imageright', //右浮动
                    'attachment', //附件
                    'imagecenter', //居中
                    'wordimage', //图片转存
                    'lineheight', //行间距
                    'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    'autotypeset', //自动排版
                    'webapp', //百度应用
                    'touppercase', //字母大写
                    'tolowercase', //字母小写
                    'background', //背景
                    'template', //模板
                    'scrawl', //涂鸦
                    'music', //音乐
                    'inserttable', //插入表格
                    'drafts', // 从草稿箱加载
                    'charts', // 图表
                ]
            ],
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            initialFrameWidth: '100%',
            initialFrameHeight: 200,


        };
        //查看弹窗
        $scope.watch=function(flag,name,content,filePath,sort){
            $('.'+flag).dialog();
            $scope.name=name;
            $scope.content=content;
            $scope.sort=sort;
            $scope.watchfile=filePath;
        }
        //排序列表
        // $scope.sortlist=[{
        //     sort:0,
        //     name:'默认排序'
        // },{
        //     sort:1,
        //     name:'置顶1'
        // },{
        //     sort:2,
        //     name:'置顶2'
        // },{
        //     sort:3,
        //     name:'置顶3'
        // }]
        // //修改排序
        // //排序列表
        // $scope.editlist=[{
        //     sort:1,
        //     name:'置顶1'
        // },{
        //     sort:2,
        //     name:'置顶2'
        // },{
        //     sort:3,
        //     name:'置顶3'
        // }]
        //排序默认值
        $scope.newsort=0;
        //添加新闻
        $scope.add=function(flag){
            $('.'+flag).dialog();
        }
        //添加附件
        $scope.addannex=function(files){
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
                console.log($scope.data);
                $scope.fileName = $scope.data.fileName;
                $scope.filePath = $scope.data.filePath;
                $scope.size = $scope.data.size;
            }, function errorCallback(response) {
                alert(response);// 请求失败执行代码
            });
        }
        //添加保存新闻
        $scope.addnews=function(filePath,fileName){
            server.server().addnewsdata({
                createUser:createUser,
                name:$scope.newname,
                content:$scope.newcontent,
                imgUrl:filePath,
                fileName:fileName,
                sort:$scope.newsort
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        newslist('');
                        cancelData();
                        $('.adddata').hide();
                    });
                    $scope.$apply();


                } else {
                    alert(data.message,function(){cancelData();});
                }
            }, function (err) {
                alert(data.message,function(){cancelData();});
            });
        }
        //编辑新闻和初始化
        $scope.edit=function(id,flag,name,content,filePath,fileName,sort){
            $('.'+flag).dialog();
            $scope.editname=name;
            $scope.editcontent=content;

           $scope.editFilePath=filePath;
           $scope.editFileName=fileName;
            // if(sort!=1&&sort!=2&&sort!=3){
            //     $scope.editlist.push({'sort':sort,'name':sort});
            //     $scope.editsort=sort;
            // }else{
            //     $scope.editsort=sort;
            // }
            $scope.editsort=sort;
            $scope.editid=id;
        }
        //保存编辑信息
        $scope.editsave=function(id,filePath,fileName){

            server.server().addeditdata({
                id:id,
                updateUser:createUser,
                name:$scope.editname,
                content:$scope.editcontent,
                imgUrl:filePath,
                fileName:fileName,
                sort:$scope.editsort
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        // if($scope.editsort!=1&&$scope.editsort!=2&&$scope.editsort!=3){
                        //     $scope.editlist.splice($scope.editlist.indexOf($scope.editsort),1);
                        // }else{
                        //     $scope.editlist=[{
                        //         sort:1,
                        //         name:'置顶1'
                        //     },{
                        //         sort:2,
                        //         name:'置顶2'
                        //     },{
                        //         sort:3,
                        //         name:'置顶3'
                        //     }]
                        // };
                        cancelData();
                        newslist('');
                        console.log($scope.sortlist);

                    });
                    $scope.$apply();


                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //编辑取消
        $scope.cancel=function(sort){
            if(sort!=1&&sort!=2&&sort!=3){
                $scope.editlist.splice($scope.editlist.indexOf(sort),1);
            };
            cancelData();
            console.log($scope.sortlist);
        }
        function cancelData(){
            $scope.filePath='';
            $scope.filename='';
            $scope.newname='';
            $scope.newcontent='';
            $scope.newsort=0;

        }
        //删除
        $scope.delete=function(id){
            confirm('确认删除？',function(){
                server.server().deletenews({
                    id:id,
                    userId:createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            newslist('');
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
    // 知识库-栏目管理 
     .controller('columnadminCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.hostname=server.server().imgHost;
        var createUser=server.server().userId;
        $scope.no = '/';
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        };
    //列表function
        function newslist(searchKeys){
            server.server().zjcolumnlistdo({
                pageNo:$scope.conf.currentPage||1,
                pageSize:$scope.conf.itemPageLimit||10,
            }, function (data) {
                if (data.result === true) {
                    $scope.list=data.data.rows;
                    console.log(data.data)
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            });
        };
        $scope.$watch('conf.currentPage + conf.itemPageLimit+title+searchKeys', function (news) {
            newslist($scope.searchKeys);
        });

        // 编辑
        $scope.edit = function(index){
            $scope.edittelephone = $scope.list[index].name
            $scope.addid = $scope.list[index].id
            $('.editfour').dialog();
        }
        $scope.edittelephoneflag = false;

        $scope.blurs = function(){
            !$scope.edittelephone
                ?$scope.edittelephoneflag = true
                :$scope.edittelephoneflag = false
        }

        // 保存
        $scope.edittelsave = function(){
            if(!$scope.edittelephone){
                $scope.edittelephoneflag = true;
                return;
            }
            server.server().zjcolumnupdateSavedo({
                id:$scope.addid,
                name:$scope.edittelephone,
                updateUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        newslist($scope.searchKeys)
                        $('.editfour').hide(200);
                    })

                } else {
                    alert(data.message);
                }
            });
        }
        
    }])
    //知识库-项目信息管理
    .controller('knowledgeProjectCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.hostname=server.server().imgHost;
        var createUser=server.server().userId;
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        };
        //列表function
        function projectlist(searchKeys){
            server.server().projectListData({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit,
                searchKeys:searchKeys?searchKeys:''
            }, function (data) {
                if (data.result === true) {
                    $scope.projectlist=data.data.rows;
                    //多少页
                    $scope.conf.total =data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        };
        $scope.$watch('conf.currentPage + conf.itemPageLimit+title+searchKeys', function (news) {
            projectlist($scope.searchKeys);
        });
        projectlist('');
        //配置富文本
        $scope.config = {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [
                [
                    'anchor', //锚点
                    'undo', //撤销
                    'redo', //重做
                    'bold', //加粗
                    'indent', //首行缩进
                    'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    'superscript', //上标
                    'formatmatch', //格式刷
                    'source', //源代码
                    'blockquote', //引用
                    'pasteplain', //纯文本粘贴模式
                    'selectall', //全选
                    'print', //打印
                    'preview', //预览
                    'horizontal', //分隔线
                    'removeformat', //清除格式
                    'time', //时间
                    'date', //日期
                    'unlink', //取消链接
                    'insertrow', //前插入行
                    'insertcol', //前插入列
                    'mergeright', //右合并单元格
                    'mergedown', //下合并单元格
                    'deleterow', //删除行
                    'deletecol', //删除列
                    'splittorows', //拆分成行
                    'splittocols', //拆分成列
                    'splittocells', //完全拆分单元格
                    'deletecaption', //删除表格标题
                    'inserttitle', //插入标题
                    'mergecells', //合并多个单元格
                    'deletetable', //删除表格
                    'cleardoc', //清空文档
                    'insertparagraphbeforetable', //"表格前插入行"
                    'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'simpleupload', //单图上传
                    // 'insertimage', //多图上传
                    'edittable', //表格属性
                    'edittd', //单元格属性
                    'link', //超链接
                    'emotion', //表情
                    'spechars', //特殊字符
                    'searchreplace', //查询替换
                    'map', //Baidu地图
                    'gmap', //Google地图
                    'insertvideo', //视频
                    'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    'directionalityltr', //从左向右输入
                    'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    'pagebreak', //分页
                    'insertframe', //插入Iframe
                    'imagenone', //默认
                    'imageleft', //左浮动
                    'imageright', //右浮动
                    'attachment', //附件
                    'imagecenter', //居中
                    'wordimage', //图片转存
                    'lineheight', //行间距
                    'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    'autotypeset', //自动排版
                    'webapp', //百度应用
                    'touppercase', //字母大写
                    'tolowercase', //字母小写
                    'background', //背景
                    'template', //模板
                    'scrawl', //涂鸦
                    'music', //音乐
                    'inserttable', //插入表格
                    'drafts', // 从草稿箱加载
                    'charts', // 图表
                ]
            ],
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            initialFrameWidth: '100%',
            initialFrameHeight: 200,
        };
        //查看弹窗
        $scope.watch=function(flag,projectName,projectIdName,content,basePath,imgUrl,homeExhibitionList,sort){
            $('.'+flag).dialog();
            $scope.projectname=projectName;
            $scope.contactname=projectIdName;
            $scope.projectcontent=content;
            $scope.sort=sort;
            $scope.imgUrl=imgUrl;
            $scope.basePath=basePath;
        }
        //排序列表
        $scope.sortlist=[{
            sort:0,
            name:'默认排序'
        },{
            sort:1,
            name:'置顶1'
        },{
            sort:2,
            name:'置顶2'
        },{
            sort:3,
            name:'置顶3'
        }]
        //修改排序
        //排序列表
        $scope.editlist=[{
            sort:1,
            name:'置顶1'
        },{
            sort:2,
            name:'置顶2'
        },{
            sort:3,
            name:'置顶3'
        }]
        //排序默认值
        $scope.newsort=0;
        //添加项目管理
        $scope.add=function(flag){
            $('.'+flag).dialog();
        }
        //添加附件
        $scope.addannex=function(files){
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
                console.log($scope.data);
                $scope.filename = $scope.data.fileName;
                $scope.filePath = $scope.data.filePath;
                $scope.size = $scope.data.size;
            }, function errorCallback(response) {
                alert(response);// 请求失败执行代码
            });
        }
        //模糊搜索ul显示
        $scope.ulshow=function(name){
            $('.ulshow').show(500);
            search('');
        }
        //模糊搜索消失
        $scope.ulcancel=function(){
            $('.ulshow').hide(500);
        }
        //模糊搜索
        $scope.serachsomthing=function(name){
            search(name);
        }
        //选中搜索
        $scope.getname=function(id,name,flag){
            if(flag=='new'){
                $scope.newcontactname=name;
            }else if(flag=='edit'){
                $scope.editcontactname=name;
            }
            $scope.selid=id;
        }

        function search(name){
            server.server().searchcontactname({
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
        //添加保存项目管理
        $scope.addproject=function(selid,filePath,filename){
            server.server().addprojectdata({
                createUser:createUser,
                projectName:$scope.newprojectname,
                projectId:selid,
                content:$scope.newprojectcontent,
                imgUrl:filePath,
                fileName:filename,
                dataDisplay:'',
                sort:$scope.newsort
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        projectlist('');
                        cancelData();
                    });

                    $scope.$apply();


                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
            //取消
            $scope.cancel=function(){
                cancelData();
            }
            function cancelData(){
                $scope.newprojectname='';
                $scope.newprojectcontent='';
                $scope.newsort=0;
                $scope.newcontactname='';
                $scope.filePath='';
                $scope.filename='';
            }
        }
        //编辑项目管理信息和初始化
        $scope.edit=function(id,flag,projectName,projectIdName,content,basePath,imgUrl,fileName,homeExhibitionList,sort){
            $('.'+flag).dialog();
            $scope.editprojectname=projectName;
            $scope.editcontactname=projectIdName;
            $scope.editprojectcontent=content;
            // $scope.editsort=sort;
            if(sort!=1&&sort!=2&&sort!=3){
                $scope.editlist.push({'sort':sort,'name':sort});
                $scope.editsort=sort;
            }else{
                $scope.editsort=sort;
            }
            $scope.projectid=id;
            $scope.basePath=basePath;
            $scope.editimgUrl=imgUrl;
            $scope.editfilename=fileName;
        }
        //保存编辑信息
        $scope.editsave=function(projectid,selid,filePath,filename,editimgUrl,editfilename){
            server.server().editprojectdata({
                id:projectid,
                updateUser:createUser,
                projectName:$scope.editprojectname,
                projectId:selid,
                content:$scope.editprojectcontent,
                imgUrl:filePath?filePath:editimgUrl,
                fileName:filename?filename:editfilename,
                dataDisplay:'',
                sort:$scope.editsort
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        if($scope.editsort!=1&&$scope.editsort!=2&&$scope.editsort!=3){
                            $scope.editlist.splice($scope.editlist.indexOf($scope.editsort),1);
                        }else{
                            $scope.editlist=[{
                                sort:1,
                                name:'置顶1'
                            },{
                                sort:2,
                                name:'置顶2'
                            },{
                                sort:3,
                                name:'置顶3'
                            }]
                        };
                        projectlist('');
                    });
                    $scope.filename='';
                    $scope.filePath='';
                    $scope.$apply();


                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //编辑取消
        $scope.cancel=function(sort){
            if(sort!=1&&sort!=2&&sort!=3){
                $scope.editlist.splice($scope.editlist.indexOf(sort),1);
            };
            $scope.filePath='';
            $scope.filename='';
        }
        //删除
        $scope.delete=function(id){
            confirm('确认删除？',function(){
                server.server().deleteproject({
                    id:id,
                    userId:createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            projectlist('');
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
    //知识库-政策法规
    .controller('lawsregulationsCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;
        $scope.hostname=server.server().imgHost;
        
        //配置富文本
        $scope.config = {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [
                [
                    'anchor', //锚点
                    'undo', //撤销
                    'redo', //重做
                    'bold', //加粗
                    'indent', //首行缩进
                    'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    'superscript', //上标
                    'formatmatch', //格式刷
                    'source', //源代码
                    'blockquote', //引用
                    'pasteplain', //纯文本粘贴模式
                    'selectall', //全选
                    'print', //打印
                    'preview', //预览
                    'horizontal', //分隔线
                    'removeformat', //清除格式
                    'time', //时间
                    'date', //日期
                    'unlink', //取消链接
                    'insertrow', //前插入行
                    'insertcol', //前插入列
                    'mergeright', //右合并单元格
                    'mergedown', //下合并单元格
                    'deleterow', //删除行
                    'deletecol', //删除列
                    'splittorows', //拆分成行
                    'splittocols', //拆分成列
                    'splittocells', //完全拆分单元格
                    'deletecaption', //删除表格标题
                    'inserttitle', //插入标题
                    'mergecells', //合并多个单元格
                    'deletetable', //删除表格
                    'cleardoc', //清空文档
                    'insertparagraphbeforetable', //"表格前插入行"
                    'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'simpleupload', //单图上传
                    // 'insertimage', //多图上传
                    'edittable', //表格属性
                    'edittd', //单元格属性
                    'link', //超链接
                    'emotion', //表情
                    'spechars', //特殊字符
                    'searchreplace', //查询替换
                    'map', //Baidu地图
                    'gmap', //Google地图
                    'insertvideo', //视频
                    'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    'directionalityltr', //从左向右输入
                    'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    'pagebreak', //分页
                    'insertframe', //插入Iframe
                    'imagenone', //默认
                    'imageleft', //左浮动
                    'imageright', //右浮动
                    'attachment', //附件
                    'imagecenter', //居中
                    'wordimage', //图片转存
                    'lineheight', //行间距
                    'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    'autotypeset', //自动排版
                    'webapp', //百度应用
                    'touppercase', //字母大写
                    'tolowercase', //字母小写
                    'background', //背景
                    'template', //模板
                    'scrawl', //涂鸦
                    'music', //音乐
                    'inserttable', //插入表格
                    'drafts', // 从草稿箱加载
                    'charts', // 图表
                ]
            ],
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            initialFrameWidth: '100%',
            initialFrameHeight: 200,


        };
        //政策法规父级function
        function parentnode(){
            server.server().lawtypelist({
            }, function (data) {
                if (data.result === true) {
                    $scope.typelist=data.data.rows;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        parentnode();
        //政策法规子集function
        function sonnode(id){
            server.server().sonlowlist({
                parentId:id
            }, function (data) {
                if (data.result === true) {
                    $scope.sonlist=data.data;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        $scope.showflag = false;
        //通过点击获取子集列表
        $scope.showson=function(id){
            sonnode(id)
            $scope.showflag = !$scope.showflag
        }
        //点击父级新增弹窗
        $scope.addshow=function(flag){
            $('.'+flag).dialog();
        }
        //父级保存function
        function addsave(requestJson){
            server.server().addtypesave({
                requestJson:requestJson
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        parentnode();
                        $scope.typeName='';
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //保存父级新增
        $scope.addparent=function(){
            $scope.requestJson={createUser:createUser,typeName:$scope.typeName}
            addsave(JSON.stringify($scope.requestJson));
        }
        //编辑父级
        $scope.edit=function(id,typename,flag){
            console.log(id);
            $('.'+flag).dialog();
            // editinit(id);
            $scope.id=id;
            $scope.editTypename=typename;
        }
        //修改父级保存function
        function updatesave(json){
            server.server().updatetypesave({

                requestJson:json
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        parentnode();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //修改父级保存
        $scope.editparent=function(id){
            var requestJson={'id':id,'updateUser':createUser,'typeName':$scope.editTypename}
            updatesave(JSON.stringify(requestJson));
        }
        //新增子级弹窗
        $scope.addnewson=function(parentid,flag){
            $('.'+flag).dialog();
            $scope.parentid=parentid;
        }
        //添加附件
        $scope.addannex=function(files){
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
                console.log($scope.data);
                $scope.fileName = $scope.data.fileName;
                $scope.filePath = $scope.data.filePath;
                $scope.size = $scope.data.size;
            }, function errorCallback(response) {
                alert(response);// 请求失败执行代码
            });
        }
        //子集保存
        $scope.addson=function(content){
                var sonjson={'createUser':createUser,'parentId':$scope.parentid,'projectTitle':$scope.sontitle,'policyContent':content,'imageUrl':$scope.filePath?$scope.filePath:'','fileName':$scope.fileName?$scope.fileName:''}
                addsonsave(JSON.stringify(sonjson));


        }
        //新增子集保存function
        function addsonsave(json){
            server.server().addlawsavedata({
                requestJson:json
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        sonnode();
                        $scope.filename = '';
                        $scope.filePath = '';
                        $scope.sontitle='';
                        $scope.soncontent='';
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                    sonnode();
                    $scope.filename = '';
                    $scope.filePath = '';
                    $scope.sontitle='';
                    $scope.soncontent='';
                }
            }, function (err) {
                alert(data.message);
                sonnode();
                $scope.filename = '';
                $scope.filePath = '';
                $scope.sontitle='';
                $scope.soncontent='';
            });
        }
        //子级编辑弹窗
        $scope.editson=function(parentid,id,title,content,filePath,fileName,flag){
            $('.'+flag).dialog();
            $scope.parentid=parentid;
            $scope.sonid=id;
            $scope.editlawname=title;
            $scope.editlawcontent=content;
            $scope.editlawfilePath=filePath;
            $scope.editlawfileName=fileName;
        }
        //子集修改保存
        $scope.updatelawsave=function(content,filePath,fileName){
            var updatesonJson={'id':$scope.sonid,'updateUser':createUser,'projectTitle':$scope.editlawname,'policyContent':$scope.editlawcontent,'imageUrl':filePath,'fileName':fileName}
            server.server().updatelawsavedata({
                requestJson:JSON.stringify(updatesonJson)
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        sonnode($scope.sonid);
                        $scope.fileName = '';
                        $scope.filePath = '';
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //删除父级政策法规
        $scope.delete=function(id){
            confirm('确定删除?',function(){
                server.server().deletetypedata({
                    id:id,
                    userId:createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            parentnode();
                        });
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
        //删除子级政策法规
        $scope.deleteson=function(parentid,id){
            confirm('确定删除?',function(){
                server.server().deletelawdata({
                    id:id,
                    userId:createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            sonnode(parentid);
                        });
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
        //编辑取消
        $scope.cancel=function(){
            $scope.filePath='';
            $scope.fileName='';
        }
    }])
    //系统设置-组织结构
    .controller('systemsetCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys', function (news) {
            organization($scope.searchKeys);
        })
        function organization(searchKeys){
            server.server().organizationlist({
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit,
                searchKeys:searchKeys,
            }, function (data) {
                if (data.result === true) {
                   $scope.datalist=data.data.rows;
                    //共多少页
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;

                    // }
                    $scope.$apply()
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        organization();
        //$scope.projectId=$state.params.projectid;
    }])
    //系统设置-人员列表
    .controller('peoplelistCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.deptId=$state.params.deptId;
        var createUser=server.server().userId;
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        //人名ABCDEFG...
        $scope.letterData=[
            {
                name:'全部',
                letter:0,
                status:true
            },
            {
                name:'A',
                letter:'A',
                status:false
            },
            {
                name:'B',
                letter:'B',
                status:false
            },
            {
                name:'C',
                letter:'C',
                status:false
            },
            {
                name:'D',
                letter:'D',
                status:false

            },
            {
                name:'E',
                letter:'E',
                status:false
            },
            {
                name:'F',
                letter:'F',
                status:false
            },
            {
                name:'G',
                letter:'G',
                status:false
            },
            {
                name:'H',
                letter:'H',
                status:false
            },
            {
                name:'I',
                letter:'I',
                status:false
            },
            {
                name:'J',
                letter:'J',
                status:false
            },
            {
                name:'K',
                letter:'K',
                status:false
            },
            {
                name:'L',
                letter:'L',
                status:false
            },
            {
                name:'M',
                letter:'M',
                status:false
            },
            {
                name:'N',
                letter:'N',
                status:false
            },
            {
                name:'O',
                letter:'O',
                status:false
            },
            {
                name:'P',
                letter:'P',
                status:false
            },
            {
                name:'Q',
                letter:'Q',
                status:false
            },
            {
                name:'R',
                letter:'R',
                status:false
            },
            {
                name:'S',
                letter:'S'
            },
            {
                name:'T',
                letter:'T',
                status:false
            },
            {
                name:'U',
                letter:'U'
            },
            {
                name:'V',
                letter:'V',
                status:false
            },
            {
                name:'W',
                letter:'W',
                status:false
            },
            {
                name:'X',
                letter:'X',
                status:false
            },
            {
                name:'Y',
                letter:'Y',
                status:false
            },
            {
                name:'Z',
                letter:'Z',
                status:false
            }

            ];
        //全选和单选的互相切换
        $scope.selet=function(letter,status){
            if(letter==0&&status==true){
                for(var i=1;i<$scope.letterData.length;i++){
                    $scope.letterData[i].status=false;
                }
            };
            if(letter!=0&&status==true){
                $scope.letterData[0].status=false;
            };
            var list=[];
            for(var j=0;j<$scope.letterData.length;j++){
                if($scope.letterData[j].status==true){
                    if($scope.letterData[j].letter==0){
                        list=[];
                    }else{
                        list.push($scope.letterData[j].letter);
                    }

                }
            }
            people($scope.deptId,$scope.searchKeys,list.toString());
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys', function (news) {
            people($scope.deptId,$scope.searchKeys,'');
        });
        function people(deptId,searchKeys,list){
            server.server().peoplelist({
                deptId:deptId,
                pageSize:$scope.conf.itemPageLimit,
                pageNo:$scope.conf.currentPage,
                searchKeys:searchKeys,
                letter:list
            }, function (data) {
                if (data.result === true) {
                    $scope.peoplelist=data.data.rows;
                    $scope.total=data.data.total;
                    //共多少页
                    $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;

                    // }
                    $scope.$apply()
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        people($scope.deptId,'','');
        //添加用户评价弹窗
        $scope.addAppraise=function(flag,id,realname){
            $('.'+flag).dialog();
            $scope.id=id;
            $scope.addRealName=realname;
        }
        //添加用户评价保存
        $scope.addUserAppraiseData=function(id){
            server.server().addAppraiseData({
                userId:id,//用户ID
                appraise:$scope.newappraise,//评价
                createUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        people($scope.deptId,'','');
                        $scope.newappraise='';
                    })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        $scope.page = 1;
        $scope.pageSize = 5;
        $scope.pageFlag = true;
        $scope.appraiseList = [];
        function setData(id){
            server.server().watchAppraiseData({
                userId:id,//用户ID
                pageNo:$scope.page,//评价
                pageSize:$scope.pageSize
            }, function (data) {
                if (data.result === true) {
                    var _data = data.data;
                    if(_data.rows.length==0){
                        $scope.pageFlag = false;
                    }
                    if (_data.pageCount == $scope.page) {
                        $scope.pageFlag = false;
                    }
                    for (var item of _data.rows) {
                        $scope.appraiseList.push(item);
                    }
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //加载更多
        $scope.addPage = function (id) {
            $scope.page++;
            setData(id);
        };

        //查看用户评价
        $scope.watchAppraise=function(flag,id,realname){
            setTimeout(function(){$('.'+flag).dialog()},300);
            $scope.addRealName=realname;
            $scope.id=id;
            setData(id);
        }
        //弹窗取消
        $scope.cancel=function(){
            $scope.appraiseList = [];
        }
    }])
    //系统设置-物业授权
    .controller('propertyaccreditCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        //$scope.deptId=$state.params.deptId;
        var createUser=server.server().userId;
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.conf2 = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        
        //物业列表
        function accredit(projectId,searchProperty){
            server.server().accreditlist({
                projectId:projectId,
                pageSize:$scope.conf.itemPageLimit,
                pageNo:$scope.conf.currentPage,
                searchKeys:searchProperty,
            }, function (data) {
                if (data.result === true) {
                    $scope.accreditlist=data.data.rows;
                    let lists = 0;
                    for(var i=0;i<$scope.accreditlist.length;i++){
                        $scope.accreditlist[i].status=false;
                        $scope.checkArr.forEach(function(item,list){
                            if($scope.checkArr[list] ==$scope.accreditlist[i].id ){
                                $scope.accreditlist[i].status=true;
                                lists++
                            }
                        })
                    }
                    if(lists==$scope.accreditlist.length){
                        $scope.selectAll = true
                    }else{
                        $scope.selectAll = false
                    }
                    $scope.total=data.data.total;
                    //共多少页
                    $scope.conf.total = data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    
                    $scope.$broadcast("categoryLoaded");
                    $scope.$apply()

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        
        // =================xu qiu geng gai ====================
        
        //搜索function
        function search(name){
            server.server().searchprojectName({
                searchKeys:name||''
            }, function (data) {
                if (data.result === true) {
                    $scope.searchlist=data.data;
                    $scope.projectName = data.data[0].id;
                    // accredit($scope.projectName,$scope.searchProperty);
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        search()
        
        //============================= xu qiu geng gai=====================
        // 下接选择
        $scope.myFunc2 = function(val){
            // $scope.projectName = val
            accredit($scope.projectName,$scope.searchProperty);
        }

        // 搜索
        $scope.sellists=function(val){
            accredit($scope.projectName,$scope.searchProperty);
        }





        //点击房源授权

        $scope.selpeople=function(id,flag){
            setTimeout(function(){$('.'+flag).dialog()},300);
            initrole($scope.searchKeys);
            $scope.piliangarr=id;
        }

        
        //点击集体授权
        $scope.selectAllPeople=function(flag){
            $('.'+flag).dialog(300);
            initrole();
        }
        //角色列表
        //角色初始化
        function initrole(searchKeys){
            server.server().initrolelist({
                searchKeys:$scope.searchKeys,
                pageNo:$scope.conf2.currentPage||1,
                pageSize:$scope.conf2.itemPageLimit||10,
            }, function (data) {
                if (data.result === true) {
                    $scope.rolelist=data.data.rows;

                    for(var i = 0;i<$scope.rolelist.length;i++){
                        for(var j = 0;j<$scope.roleidlist.length;j++){
                            if($scope.rolelist[i].id===$scope.roleidlist[j]){
                                $scope.rolelist[i].isFlag = true;
                            }
                        }
                    }
                    $scope.total=data.data.total;
                    //共多少页
                    $scope.conf2.total = data.data.pageCount;
                    //共有多少条数据
                    $scope.conf2.counts = data.data.total;
                    $scope.$apply()
                    $scope.$broadcast("categoryLoaded2");
                    
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        // 角色授权筛选
        $scope.shaixuan = function(val){
            initrole(searchKeys)
        }

        $scope.$watch('conf2.currentPage + conf2.itemPageLimit+searchKeys', function (news) {
            initrole($scope.searchKeys);
        })
        $scope.$watch('conf.currentPage + conf.itemPageLimit', function (news) {
            accredit($scope.projectId,$scope.searchProperty);
            
        })

        //角色分配角色选中
        $scope.roleidlist=[];
        $scope.addrole=function(event,index){
            dict.rolemultiple ($scope.roleidlist,$scope.rolelist,event,index)
        }
        //单个授权-保存角色选中
        $scope.addsel=function(){
            var selList=[];
            // for(var i=0;i<$scope.accreditlist.length;i++){
            //     if($scope.accreditlist[i].status==true){
            //         selList.push($scope.accreditlist[i].id);
            //     }
            // }
            console.log($scope.checkArr)
            server.server().addAllsel({
                createUser:createUser,
                strUserId:$scope.roleidlist.toString(),
                strRoomId:$scope.checkArr.toString(),
            }, function (data) {
                if (data.result === true) {
                    alert('保存成功',function(){
                        accredit($scope.projectId,$scope.searchProperty)
                        $scope.roleidlist=[];
                        selList=[];
                    });
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //集体授权-保存角色选中
        $scope.addAllsel=function(){
            var selList=[];
            for(var i=0;i<$scope.accreditlist.length;i++){
                if($scope.accreditlist[i].status==true){
                    selList.push($scope.accreditlist[i].id);
                }
            }
            server.server().addSingelsel({
                projectId:$scope.projectName,
                userId:createUser,
                strUserId:$scope.roleidlist.toString()
        
            }, function (data) {
                if (data.result === true) {
                    alert('保存成功',function(){
                        accredit($scope.projectId,$scope.searchProperty)
                        $scope.roleidlist=[];
                        selList=[];
                        $scope.batchChecked=false;
                    });
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //角色分配弹窗取消
        $scope.cancel=function(){
            $scope.rolelist='';
            $scope.roleidlist=[];
            $scope.searchKeys='';
        
            // accredit($scope.projectId,$scope.searchProperty);
        }

        $scope.checkArr = [];

        //批量操作
        var batch=[];
        $scope.checkAll = function(val){
            if(val){
                $scope.accreditlist.forEach(function(item,index){
                    $scope.accreditlist[index].status = true;
                    // 存入数组
                    if($scope.checkArr.length>0){
                        $scope.checkArr.push($scope.accreditlist[index].id)
                        let arrs = [...new Set($scope.checkArr)]
                        $scope.checkArr = arrs
                    }else{
                        $scope.checkArr.push($scope.accreditlist[index].id)
                    }
                })
                
            }else{
                $scope.accreditlist.forEach(function(item,index){
                    $scope.accreditlist[index].status = false;
                    if($scope.checkArr.length>0){
                        $scope.checkArr.forEach(function(item,list){
                            if($scope.checkArr[list]==$scope.accreditlist[index].id){
                                $scope.checkArr.splice(list,1)
                            }
                        })
                    }else{
                        $scope.checkArr = [];
                    }
                })
            }
            console.log($scope.checkArr)
        }
        // 单选
        $scope.check = function(val,index){
            $scope.selectAll = false;
            if(val){
                let m = 0;
                $scope.accreditlist.forEach(function(item,inde){
                    if($scope.accreditlist[inde].status){
                        m++;
                    }
                })
                if(m===$scope.accreditlist.length){
                    $scope.selectAll = true;
                }
                // 存入数组
                if($scope.checkArr.length>0){
                    $scope.checkArr.push($scope.accreditlist[index].id)
                    let arrs = [...new Set($scope.checkArr)]
                    $scope.checkArr = arrs
                }else{
                    $scope.checkArr.push($scope.accreditlist[index].id)
                }
            }else{
                let n = 0;
                $scope.accreditlist.forEach(function(item,inde){
                    if(!$scope.accreditlist[inde].status){
                        n++;
                    }
                })
                if(n===$scope.accreditlist.length){
                    $scope.selectAll[index].status = true;
                }
                $scope.checkArr.forEach(function(item,list){
                    if($scope.checkArr[list]===$scope.accreditlist[index].id){
                        $scope.checkArr.splice(list,1)
                    }
                })
            }
            console.log($scope.checkArr)
        }
        // 批量审批
        $scope.allotrole = function(){
            $scope.piliangarr = [];
            $scope.accreditlist.forEach(function(item,inde){
                if($scope.accreditlist[inde].status){
                    $scope.piliangarr.push($scope.accreditlist[inde].id)
                }
            })
            if($scope.piliangarr.length>0){
                initrole();
                $('.hchakantwo').dialog(300);
            }else{
                alert('请选择授权列表')
            }
        }
    }])
    //系统设置-已授权人员列表
    .controller('propertyPeopleCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.userId = server.server().userId
        $scope.host = server.server().host
        //角色列表
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 6, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.conf2 = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 6, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys', function () {
            ppList($scope.searchKeys);

        })
        $scope.$watch('conf2.currentPage + conf2.itemPageLimit+propertylist+searchKeyswuye', function () {
            propertyList($scope.propertyId)

        })
        //已授权人员列表
         function ppList(searchKeys){
            server.server().ppListData({
                searchKeys:searchKeys,
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit
            }, function (data) {
                if (data.result === true) {
                    $scope.accreditlist=data.data.rows;
                    $scope.accreditlist.forEach(function(item,index){
                        $scope.accreditlist[index].status = false;
                    })
                    //多少页
                    $scope.conf.total = data.data.pageCount;

                    // $scope.conf.total = data.data.total/data.data.pageSize;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        ppList('');

        //名下物业列表
        function propertyList(id,flag){
            server.server().propertyListData({
                userId:id,
                searchKeys:$scope.searchKeyswuye,
                pageNo:$scope.conf2.currentPage,
                pageSize:$scope.conf2.itemPageLimit,
                exportType:1
            }, function (data) {
                if (data.result === true) {
                    console.log(data.data)
                    $scope.propertylist=data.data.rows;
                    //多少页
                    $scope.conf2.total = data.data.pageCount;

                    // $scope.conf.total = data.data.total/data.data.pageSize;
                    //共有多少条数据
                    $scope.conf2.counts = data.data.total;
                    // 导出
                    $scope.daochu = $scope.host+'propertyauthority/queryRoomAuthorization.do'+'?userId='+$scope.propertyId+
                    '&searchKeys='+($scope.searchKeyswuye||'')+
                    '&pageNo='+$scope.conf2.currentPage+
                    '&pageSize='+$scope.conf2.itemPageLimit+
                    '&exportType=2'
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");
                    if(flag){
                        $('.'+flag).dialog()
                    }
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        $scope.selproperty=function(id,flag){
            
            $scope.propertyId=id;
                propertyList(id,flag);
        }
        $scope.cancel=function(){
            $scope.propertyId = '';
            console.log($scope.daochu)
        }

        
        
        // 删除
        $scope.deletelist = function(id){
            confirm('确认删除该条数据吗？',function(){
                server.server().propertyauthoritydeleteById({
                    updateUser:$scope.userId,
                    id:id
                },function(data){
                    if(data.result === true){
                        propertyList($scope.propertyId)
                    }else{
                        alert(data.message)
                    }
                },function(err){
    
                })
            })
            
        }

        $scope.selectAll = false
         //批量操作
         $scope.checkAll = function(val){
             if(val){
                 $scope.accreditlist.forEach(function(item,index){
                     $scope.accreditlist[index].status = true;
                 })
             }else{
                 $scope.accreditlist.forEach(function(item,index){
                     $scope.accreditlist[index].status = false;
                 })
             }
         }
         // 单选
         $scope.check = function(val,index){
             $scope.selectAll = false;
             if(val){
                 let m = 0;
                 $scope.accreditlist.forEach(function(item,inde){
                     if($scope.accreditlist[inde].status){
                         m++;
                     }
                 })
                 if(m===$scope.accreditlist.length){
                     $scope.selectAll = true;
                 }
             }else{
                 let n = 0;
                 $scope.accreditlist.forEach(function(item,inde){
                     if(!$scope.accreditlist[inde].status){
                         n++;
                     }
                 })
                 if(n===$scope.accreditlist.length){
                     $scope.selectAll[index].status = true;
                 }
             }
         }
         // 批量删除
         $scope.allotrole = function(){
             $scope.piliangarr = [];
             $scope.accreditlist.forEach(function(item,inde){
                 if($scope.accreditlist[inde].status){
                     $scope.piliangarr.push($scope.accreditlist[inde].userId)
                 }
             })
             if($scope.piliangarr.length>0){
                 
                 confirm('确认批量删除吗？',function(){
                    initrole($scope.piliangarr);
                 })
             }else{
                 alert('请选择删除列表')
             }
         }
        //  批量的ajax
        function initrole(arr){
            server.server().zjpropertyauthoritydeleteEmpowerdo({
                strUserId:arr.toString(),
                userId:$scope.userId
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        ppList($scope.searchKeys)
                    });
                } else {
                    alert(data.message);
                }
            });
        }
        //删除
        $scope.deleterole = function(id){
            confirm('确认删除该条吗？',function(){
                initrole(id);
             })
        }
    }])

    //系统设置-角色授权
    .controller('roleaccreditCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        //$scope.deptId=$state.params.deptId;
        var createUser=server.server().userId;
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys', function (news) {
            roleaccredit();
        })
        function roleaccredit(){
            server.server().roleaccreditlist({
                pageSize:$scope.conf.itemPageLimit,
                pageNo:$scope.conf.currentPage,
                searchKeys:$scope.searchKeys,
            }, function (data) {
                if (data.result === true) {
                    $scope.roleaccreditlist=data.data.rows;
                    for(var i=0;i<$scope.roleaccreditlist.length;i++){
                        $scope.roleaccreditlist[i].status=false;
                    }
                    $scope.total=data.data.total;
                    //共多少页
                    $scope.conf.total = data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;

                    // }
                    $scope.$apply()
                    $scope.$broadcast("categoryLoaded");

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        roleaccredit();

        // 全选
        $scope.allclick=function(allchoose,indx){
            if(allchoose){
                for(var i = 0; i<$scope.addRootData[indx].rootData.length;i++){
                    $scope.addRootData[indx].rootData[i].status = true;
                }
            }else{
                for(var i = 0; i<$scope.addRootData[indx].rootData.length;i++){
                    $scope.addRootData[indx].rootData[i].status = false;
                }
            }
        }

        //单选
        $scope.singleChoose = function(alingle,parentIndx){
            console.log(alingle,parentIndx)
            if(!alingle){
                $scope.addRootData[parentIndx].allChoose = false;
            }else{
                let indx = 0;
                for(var i = 0; i<$scope.addRootData[parentIndx].rootData.length;i++){
                    if($scope.addRootData[parentIndx].rootData[i].status){
                        indx++;
                    }
                }
                if(indx == $scope.addRootData[parentIndx].rootData.length){
                    $scope.addRootData[parentIndx].allChoose = true;
                }else{
                    $scope.addRootData[parentIndx].allChoose = false;
                }
            }
        }

        
            // 初始化ajas
            const addrootfunction = function(flag){
                $scope.addRootData = [];
                return new Promise((resolve,reject)=>{
                    server.server().zjrolerightInitialisedo({},function (data) {
                        if (data.result === true) {
                            $scope.myData = data.data;
                            resolve($scope.myData);
                            $scope.$apply()
                            for(let j = 0;j<$scope.myData.length;j++){
                                $scope.myData[j].class=$scope.myData[j].status==1?true:false
                                $scope.myData[j].titlestatus=$scope.myData[j].status
                                $scope.myData[j].status=false
                            }
                            
                            for(let i = 0;i<$scope.myData.length;i++){
                                
                                switch($scope.myData[i].type)
                                {
                                    case 1:
                                        if(!$scope.addRootData[0]){
                                            $scope.addRootData[0]={
                                                title: '项目',
                                                allChoose:false,
                                                index:0,
                                                rootData :[]
                                            }
                                        }
                                        $scope.myData[i].status==1
                                            ?$scope.addRootData[0].rootData.unshift($scope.myData[i])
                                            :$scope.addRootData[0].rootData.push($scope.myData[i])
                                        break
                                    case 2:
                                        if(!$scope.addRootData[1]){
                                            $scope.addRootData[1]={
                                                title: '物业管理',
                                                allChoose:false,
                                                index:1,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[1].rootData.push($scope.myData[i])
                                        break
                                    case 3:
                                        if(!$scope.addRootData[2]){
                                            $scope.addRootData[2]={
                                                title: '物业信息',
                                                allChoose:false,
                                                index:2,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[2].rootData.push($scope.myData[i])
                                        break
                                    case 4:
                                        if(!$scope.addRootData[3]){
                                            $scope.addRootData[3]={
                                                title: '我的工作',
                                                allChoose:false,
                                                index:3,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[3].rootData.push($scope.myData[i])
                                        break
                                    case 5:
                                        if(!$scope.addRootData[4]){
                                            $scope.addRootData[4]={
                                                title: '物业移交',
                                                allChoose:false,
                                                index:4,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[4].rootData.push($scope.myData[i])
                                        break
                                    case 7:
                                        if(!$scope.addRootData[5]){
                                            $scope.addRootData[5]={
                                                title: '物业拆除',
                                                allChoose:false,
                                                index:5,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[5].rootData.push($scope.myData[i])
                                        break
                                    case 8:
                                        if(!$scope.addRootData[6]){
                                            $scope.addRootData[6]={
                                                title: '物业还建',
                                                allChoose:false,
                                                index:6,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[6].rootData.push($scope.myData[i])
                                        break
                                    case 9:
                                        if(!$scope.addRootData[7]){
                                            $scope.addRootData[7]={
                                                title: '财务管理',
                                                allChoose:false,
                                                index:7,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[7].rootData.push($scope.myData[i])
                                        break
                                    case 10:
                                        if(!$scope.addRootData[8]){
                                            $scope.addRootData[8]={
                                                title: '审批',
                                                allChoose:false,
                                                index:8,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[8].rootData.push($scope.myData[i])
                                        break
                                    case 11:
                                        if(!$scope.addRootData[9]){
                                            $scope.addRootData[9]={
                                                title: '合同',
                                                allChoose:false,
                                                index:9,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[9].rootData.push($scope.myData[i])
                                        break
                                    case 12:
                                        if(!$scope.addRootData[10]){
                                            $scope.addRootData[10]={
                                                title: '系统设置',
                                                allChoose:false,
                                                index:10,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[10].rootData.push($scope.myData[i])
                                        break
                                    // case 13:
                                    //     if(!$scope.addRootData[11]){
                                    //         $scope.addRootData[11]={
                                    //             title: '跟进跟踪',
                                    //             allChoose:false,
                                    //             index:11,
                                    //             rootData :[]
                                    //         }
                                    //     }
                                    //     $scope.addRootData[11].rootData.push($scope.myData[i])
                                    //     break
                                    case 14:
                                        if(!$scope.addRootData[11]){
                                            $scope.addRootData[11]={
                                                title: '知识库',
                                                allChoose:false,
                                                index:11,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[11].rootData.push($scope.myData[i])
                                        break
                                    case 15:
                                        if(!$scope.addRootData[12]){
                                            $scope.addRootData[12]={
                                                title: '数据统计',
                                                allChoose:false,
                                                index:12,
                                                rootData :[]
                                            }
                                        }
                                        $scope.addRootData[12].rootData.push($scope.myData[i])
                                        break
                                    case 16:
                                    if(!$scope.addRootData[13]){
                                        $scope.addRootData[13]={
                                            title: '共有权限',
                                            allChoose:false,
                                            index:13,
                                            rootData :[]
                                        }
                                    }
                                    $scope.addRootData[13].rootData.push($scope.myData[i])
                                    break
                                }
                            }


                            $scope.$apply()
                            if($scope.addRootData.length>0 && flag){
                                $('.'+flag).dialog();
                            }
        
                        } else {
                            alert(data.message);
                        }
                    });
                })
            }
            // 编辑ajas
            const editajax = function(parentData,flag,id){
                server.server().editroleinit({
                    id:id
                    }, function (data) {
                        if (data.result === true) {
                            $scope.roleMap=data.data.roleMap;//角色角色授权信息
                            $scope.updatename=$scope.roleMap.name;
                            $scope.updateremarks=$scope.roleMap.remarks;
                            $scope.rightMap=data.data.rightMap;//角色id
                            // 下面的做法是减少性能开支，本来想用二叉树的；没时间,只能用这么土的办法了
                            if($scope.rightMap && $scope.rightMap.length>0){
                                for(let i = 0;i<parentData.length;i++){
                                    parentData[i].status = false;
                                    for(let j = 0;j<$scope.rightMap.length;j++){
                                        if(parentData[i].id==$scope.rightMap[j]){
                                            parentData[i].status = true;
                                            // $scope.rightMap.splice(1,j)
                                        }
                                    }
                                }
                            //     for(let i = 0;i<$scope.addRootData.length;i++){
                            //         // 是否全选
                            //         let index = 0;
                            //         for(var k = 0; k<$scope.addRootData[i].rootData.length;k++){
                            //             if($scope.addRootData[i].rootData[k].status){
                            //                 indx++;
                            //             }
                            //         }
                            //         if(index == $scope.addRootData[i].rootData.length){
                            //             $scope.addRootData[i].allChoose=true
                            //         }
                            //    }
                                
                            }
                            $scope.$apply();
                            $('.'+flag).dialog();
                        } else {
                            alert(data.message);
                        }
                        
                    });
            }
            
        
        //新建弹窗
        $scope.addshow=function(flag){
            addrootfunction(flag)
        }
        //编辑的弹窗-初始化
        $scope.editbasiclist=function(flag,id){
            $scope.detid=id;
            addrootfunction().then(data=>{
                editajax(data,flag,id)
            })
            
        }

        
        

        //保存新建
        $scope.addsave=function(){
            var sel=[];
            for(var i=0;i<$scope.myData.length;i++){//项目管理
                if($scope.myData[i].status==true){
                    sel.push($scope.myData[i].id)
                }
            }
            
            server.server().addsaverole({
                name:$scope.rolename,
                remarks:$scope.remarks,
                createUser:createUser,
                rights:sel.join(',')
            }, function (data) {
                if (data.result === true) {
                   alert(data.message,function(){
                       
                       $scope.rolename='';
                       $scope.remarks='';
                       for(var i=0;i<$scope.myData.length;i++){
                           $scope.myData[i].status=false;
                       }
                       roleaccredit();
                   });
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        
        //编辑保存
        $scope.updatesave=function(){
            
            var sel=[];
            for(var i=0;i<$scope.myData.length;i++){//项目管理
                if($scope.myData[i].status==true){
                    sel.push($scope.myData[i].id)
                }
            }
            server.server().updatesaverole({
                id:$scope.detid,
                name:$scope.updatename,
                remarks:$scope.updateremarks,
                updateUser:createUser,
                rights:sel.toString()
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        
                        $scope.updatename='';
                        $scope.updateremarks='';
                        for(var i=0;i<$scope.myData.length;i++){
                            $scope.myData[i].status=false;
                        }
                        roleaccredit();
                    });
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //批量操作
        $scope.batchselect=function($event,id){
            $scope.batchChecked=false;

        }
        //批量支付 全选
        $scope.batchAll=function($event){
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                for(var i=0;i<$scope.roleaccreditlist.length;i++){
                    $scope.roleaccreditlist[i].status=true;
                }
            }else{
                for(var i=0;i<$scope.roleaccreditlist.length;i++){
                    $scope.roleaccreditlist[i].status=false;
                }
            }

        }
        //单个删除角色
        $scope.deleterole=function(id){
            confirm('确认删除？',function(){
                deleteall(id)
            })
        }
        //群删除
        $scope.deletelist=function(){
            confirm('确认删除这些角色？',function(){
                var rolesel=[];
                for(var i=0;i<$scope.roleaccreditlist.length;i++){
                    if($scope.roleaccreditlist[i].status==true){
                        rolesel.push($scope.roleaccreditlist[i].id);
                    }
                }
                deleteall(rolesel.toString());

            })
        }
        //删除接口function
        function deleteall(id){
            server.server().deleterolelist({
                id:id,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        roleaccredit();
                    });
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
    }])
    //系统设置-角色分配
    .controller('allotroleCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.roleid=$state.params.roleid;
        var createUser=server.server().userId;
        // //分配角色
        // $scope.allotrole=function(id,flag){
        //     $('.'+flag).dialog();
        //
        // }

        //角色列表
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 6, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        //弹窗
        $scope.conf2 = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 6, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys', function (news) {
            roleuserlist();

        })
        $scope.$watch('conf2.currentPage + conf2.itemPageLimit+searchKeys2', function (news) {
            initrole();
        })
        function initrole(){
            server.server().initrolelist({
                searchKeys:$scope.searchKeys2,
                pageNo:$scope.conf2.currentPage,
                pageSize:$scope.conf2.itemPageLimit,
            }, function (data) {
                if (data.result === true) {
                    $scope.rolelist=data.data.rows;
                    $scope.total=data.data.total;
                    for(var i = 0;i<$scope.rolelist.length;i++){
                        for(var j = 0;j<$scope.roleidlist.length;j++){
                            if($scope.rolelist[i].id===$scope.roleidlist[j]){
                                $scope.rolelist[i].isFlag = true;
                            }
                        }
                    }
                    //共多少页
                    $scope.conf2.total = data.data.pageCount;
                    //共有多少条数据
                    $scope.conf2.counts = data.data.total;
                    $scope.$broadcast("categoryLoaded2");
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //添加角色分配初始化
        $scope.addroleshow=function(flag){
            $('.'+flag).dialog();
            initrole();
        }
        //角色分配角色选中
        $scope.roleidlist=[];
        $scope.addrole=function(event,index){
            dict.rolemultiple($scope.roleidlist,$scope.rolelist,event,index)
        }
        //保存角色选中
        $scope.addAllotRole=function(){
            // roleuserlist();
            server.server().addroleuser({
                createUser:createUser,
                arrayId:$scope.roleidlist.toString(),
                roleId:$scope.roleid,
            }, function (data) {
                if (data.result === true) {
                  alert('保存成功',function(){
                    $scope.roleidlist=[];
                      roleuserlist();
                  });
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //角色分配弹窗取消
        $scope.cancel=function(){
            $scope.conf.total='';
            $scope.conf.counts=''
            roleuserlist();
            $scope.roleidlist=[];
        }
        //分配角色列表
        function roleuserlist(){
            server.server().initroleuserlist({
                searchKeys:$scope.searchKeys,
                pageNo:$scope.conf.currentPage,
                pageSize:$scope.conf.itemPageLimit,
                roleId:$scope.roleid
            }, function (data) {
                if (data.result === true) {
                    $scope.roleuserlist=data.data.rows;
                    for(var i=0;i<$scope.roleuserlist.length;i++){
                        $scope.roleuserlist[i].status=false;
                    }
                    $scope.total=data.data.total;
                    //共多少页
                    $scope.conf.total = data.data.pageCount;
                    //共有多少条数据
                    $scope.conf.counts = data.data.total;
                    $scope.$apply()
                    $scope.$broadcast("categoryLoaded");
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        roleuserlist();
        //分配角色删除
        function deleteroleuser(id){
            server.server().deleteRoleUserList({
                id:id,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        roleuserlist();
                    });
                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //批量操作
        var batch=[];
        $scope.batchselect=function($event,id){
            $scope.batchChecked=false;

        }
        //批量支付 全选
        $scope.batchAll=function($event){
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if(checked){
                for(var i=0;i<$scope.roleuserlist.length;i++){
                    $scope.roleuserlist[i].status=true;
                }
            }else{
                for(var i=0;i<$scope.roleuserlist.length;i++){
                    $scope.roleuserlist[i].status=false;
                }
            }

        }
        //单个删除
        $scope.deleteUser=function(id){
            confirm('确定删除这个角色？',function(){
                deleteroleuser(id);
            })

        }
        //多个删除
        $scope.deleteUserList=function(){
            var arr=[];
            for(var i=0;i<$scope.roleuserlist.length;i++){
                if($scope.roleuserlist[i].status==true){
                    arr.push($scope.roleuserlist[i].id);
                }
            }
            confirm('确定删除这些角色？',function(){
                deleteroleuser(arr.toString());
            })

        }
    }])
    //基础数据-补偿项目
    .controller('databasicCompensationProjectCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;
        $scope.status=0;//默认无限制
        //项目列表function
        function compensateproject(){
            server.server().compensateprojectlist({

                }, function (data) {
                    if (data.result === true) {
                        $scope.projectlist=data.data;

                        // for(var i=0;i<$scope.roleuserlist.length;i++){
                        //     $scope.roleuserlist[i].status=false;
                        // }
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
        }
        compensateproject();
        //添加弹窗
        $scope.addshow=function(flag){
            $('.'+flag).dialog();
        }
        //编辑弹窗 初始化
        $scope.editprojectlist=function(flag,id,name,remarks,type){
            $('.'+flag).dialog();
            $scope.updatecompensateName=name;
            $scope.updateremarks=remarks;
            $scope.id=id;
            $scope.updateStatus=type;
        }
        //保存项目名称
        $scope.projectsave=function(){
            server.server().addprojectsave({
                compensateName:$scope.compensateName,
                createUser:createUser,
                remarks:$scope.remarks,
                type:$scope.status
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        compensateproject('');
                        $scope.compensateName='';
                        $scope.remarks='';
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //修改保存
        $scope.updateprojectsave=function(id){
            server.server().updateprojectsave({
                id:id,
                updateUser:createUser,
                remarks:$scope.updateremarks,
                compensateName:$scope.updatecompensateName,
                type:$scope.updateStatus
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        compensateproject();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //删除
        $scope.deleteproject=function(id){
            confirm('确定删除？',function(){
                server.server().deleteprojectdata({
                    id:id,
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            compensateproject();
                        })
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
    }])
    //基础数据-补偿类型
    .controller('databasicCompensationTypeCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;
        $scope.isStatus=0;
        $scope.isArea=2;
        $scope.whetherOrNot=1;
        $scope.isPicture=2;
        //取消
        function cancel(){
            //父级
            $scope.isStatus=0;
            $scope.isArea=2;
            $scope.whetherOrNot=1;
            $scope.isPicture=2;
            $scope.compensateName='';
            $scope.remarks='';
            //子级
            $scope.sonName='';
            $scope.description='';
        }
        //点击取消清除数据
        $scope.clearData=function(){
            cancel();
        }
        //补偿类型父级function
        function parentnode(){
            server.server().parentnodelist({
            }, function (data) {
                if (data.result === true) {
                    $scope.parentlist=data.data;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        parentnode();
        //补偿类型子集function
        function sonnode(id){
            server.server().sonnodelist({
                parentId:id
            }, function (data) {
                if (data.result === true) {
                    $scope.sonlist=data.data;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        $scope.flag=false;
        //通过点击获取子集列表
        $scope.showson=function(id){
            sonnode(id);
        }
        //点击新增弹窗
        $scope.addshow=function(flag){
            $('.'+flag).dialog();
        }
        function addsave(parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks){
            server.server().addpjtypesave({
                compensateName:compensateName,
                status:status,
                isArea:isArea,
                parentId:parentid,
                whetherOrNot:whetherOrNot,
                isPicture:isPicture,
                type:type,
                createUser:createUser,
                remarks:remarks,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        cancel();
                        parentnode();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                    cancel();
                }
            }, function (err) {

            });
        }
        //保存新增
        $scope.addprojectsave=function(parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks){
            status=status?status:0;
            addsave(parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks);
        }
        //编辑初始化
        function editinit(id){
            server.server().editnodelist({
                id:id
            }, function (data) {
                if (data.result === true) {
                    $scope.list=data.data;
                    $scope.updatecompensateName=$scope.list.compensateName;
                    $scope.isupdateStatus=$scope.list.status;
                    $scope.isupdateArea=$scope.list.isArea;
                    $scope.updatewhetherOrNot=$scope.list.whetherOrNot;
                    $scope.isupdatePicture=$scope.list.isPicture;
                    $scope.updateremarks=$scope.list.remarks;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //编辑父级
        $scope.edit=function(id,flag){
            $('.'+flag).dialog();
            editinit(id);
            $scope.id=id;
        }
        //修改保存function
        function updatesave(id,parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks){
            server.server().updatepjtypesave({
                id:id,
                compensateName:compensateName,
                status:status,
                isArea:isArea,
                parentId:parentid,
                whetherOrNot:whetherOrNot,
                isPicture:isPicture,
                type:type,
                updateUser:createUser,
                remarks:remarks,
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        parentnode();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //修改父级保存,修改子级保存
        $scope.updateprojectsave=function(id,parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks){
            status=status?status:0;
            updatesave(id,parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks);
        }
        //新增子级弹窗
        $scope.addnewson=function(parentid,flag){
            $('.'+flag).dialog();
            $scope.parentid=parentid;
        }
        $scope.addsonsave=function(parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks){
            status=status?status:0;
            addsave(parentid,type,compensateName,status,isArea,whetherOrNot,isPicture,remarks);
        }
        //子级编辑弹窗
        $scope.editson=function(parentid,id,flag){
            $('.'+flag).dialog();
            $scope.parentid=parentid;
            $scope.sonid=id;
            server.server().editnodelist({
                id:id
            }, function (data) {
                if (data.result === true) {
                    $scope.list=data.data;
                    $scope.updatesonName=$scope.list.compensateName;
                    $scope.isupdatesonStatus=$scope.list.status;
                    $scope.isupdatesonArea=$scope.list.isArea;
                    $scope.updatesonwhetherOrNot=$scope.list.whetherOrNot;
                    $scope.isupdatesonPicture=$scope.list.isPicture;
                    $scope.updatesonremarks=$scope.list.remarks;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //删除
        $scope.delete=function(id,parentid){
            confirm('确定删除?',function(){
                server.server().deletedata({
                    id:id
                }, function (data) {
                    if (data.result === true) {
                       alert(data.message,function(){
                           parentnode();
                           if(parentid!=''){
                               sonnode(parentid);
                           }
                       });
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
    }])

    //单一基础数据
    .controller('singledatabasicCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;
        $scope.istype='';
        $scope.newname='';
        function cancel(){
            //父级
            $scope.istype='';
            $scope.newname='';
            $scope.remarks='';
        }
        $scope.clearData=function(){
            cancel();
        }
        //项目列表function
        function nameproject(){
            server.server().singlelist({
            }, function (data) {
                if (data.result === true) {
                    $scope.singledata=data.data;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        nameproject();

        //添加弹窗
        $scope.addshow=function(flag){
            $('.'+flag).dialog();
        }
        //编辑弹窗 初始化
        $scope.editprojectlist=function(flag,id,code,name,remarks){
            $('.'+flag).dialog();
            $scope.isupdatetype=code;
            $scope.updatename=name;
            $scope.updateremarks=remarks;
            $scope.id=id;
        }
        //保存项目名称
        $scope.projectsave=function(){
            server.server().addsingledata({
                name:$scope.newname,
                remarks:$scope.remarks,
                type:$scope.istype,
                createUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        cancel();
                        nameproject();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                    cancel();
                }
            }, function (err) {

            });
        }
        //下拉框初始化
        server.server().settinginit({
        }, function (data) {
            if (data.result === true) {
                $scope.initdata=data.data;
                $scope.$apply()
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        //修改保存
        $scope.updatesave=function(id){
            server.server().updatesavedata({
                id:id,
                name:$scope.updatename,
                remarks:$scope.updateremarks,
                type:$scope.isupdatetype,
                updateUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        nameproject();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //删除
        $scope.delete=function(id){
            confirm('确定删除？',function(){
                server.server().deletesingledata({
                    id:id,
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            nameproject();
                        })
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
    }])
    //基础数据-合同模板
    .controller('databasiccompactCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        var createUser=server.server().userId;
        //取消数据清除
        $scope.clearData=function(){
            $scope.templateName='';
            $scope.content='';
        }
        $scope.no = '/';
        //列表初始化function
        function compactlist(){
            server.server().compactdatalists({
            }, function (data) {
                if (data.result === true) {
                   $scope.list=data.data;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        compactlist();
        //编辑
        $scope.editcompact=function(flag,id){
            $scope.updatetemplateName = '';
            $scope.updatetemplateOne = '';
            $scope.updatecontent = '';
            $scope.updatetemplateTwo = '';
            $('.'+flag).dialog();
            $scope.id=id;
            server.server().editcompactdata({
                id:id
            }, function (data) {
                if (data.result === true) {
                    $scope.updatetemplateName=data.data.templateName;
                    $scope.updatecontent=data.data.templateContent;
                    $scope.updatetemplateOne=data.data.templateOne;
                    $scope.updatetemplateTwo=data.data.templateTwo;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }




        $scope.typeflag = true
        //查看补充协议
        $scope.protocol = function(id){
            $scope.pactprotocolId = id;
            $scope.cunid = id;
            $scope.typeflag = false
            $scope.typeflags = 0
            // $scope.typeddd = 0
            $scope.childinit( $scope.pactprotocolId)
        }
        // 查看合同父级
        $scope.compactlook = function(id,flag){
            if(flag!==2){
                $scope.typeddd = 1
                
            }else{
                
                $scope.typeddd = 0
            }
            $scope.pactprotocolId = id;
            $scope.typeflag = false
            $scope.typeflags = 1
            $scope.childinit1( $scope.pactprotocolId)
        }
        // 退回
        $scope.back = function(){
            $scope.typeflag = true
        }
        $scope.back2 = function(){
            $scope.typeflag = false
            $scope.typeflags = 0
        }
        // 退回父级
        $scope.backparent = function(flag){
            if($scope.typeddd == 0){
                $scope.typeflag = false
                $scope.typeflags = 0
            }else{
                $scope.typeflag = true
            }
            // 查看补充协议id
            if(flag==2 &&$scope.typeddd==0){
                $scope.pactprotocolId = $scope.cunid
            }
            
        }

        $scope.$watch('conf.currentPage + conf.itemPageLimit+title', function (news) {
            if(!$scope.typeflag){
                console.log($scope.pactprotocolId)
                $scope.childinit( $scope.pactprotocolId)
            }
            
        })
        $scope.conf = {
            total: 6,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 10, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        };

        // 列表初始化
        $scope.childinit = function(id){
            server.server().zjpactprotocoltemplatelistdo({
                pactTemplateId:id,
                pageNo: $scope.conf.currentPage || 1,
                pageSize: $scope.conf.itemPageLimit|| 10
            }, function (data) {
                if (data.result === true) {
                    $scope.listchild = data.data.rows
                    $scope.conf.total =data.data.pageCount;
                    $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded");
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        // 列表初始化1
        $scope.childinit1 = function(id){
            server.server().zjcontentlistdo({
                pactDataId:id
            }, function (data) {
                if (data.result === true) {
                    $scope.parenthetonglist = data.data
                    // $scope.conf.total =data.data.pageCount;
                    // $scope.conf.counts = data.data.total;
                    $scope.$apply();
                    // $scope.$broadcast("categoryLoaded");
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        
        // 新增
        $scope.addshowchild = function(flag){
            $scope.namechild = '';
            $scope.contentchild = '';
            $scope.namechild1 = '';
            $scope.contentchild1 = '';
            $scope.namechild = ''
            $scope.footer = ''
            $scope.type = 0
            $('.'+flag).dialog();
        }
        // 新增父级
        $scope.addshowchild1 = function(flag){
            $scope.namechild = '';
            $scope.contentchild = '';
            $scope.namechild1 = '';
            $scope.contentchild1 = '';
            $scope.namechild = ''
            $scope.footer = ''
            $scope.type = 0
            $('.'+flag).dialog();
        }

$scope.type = 0
        // 新增保存
        $scope.projectsavechild = function(){
            server.server().zjpactprotocoltemplateaddSavedo({
                pactTemplateId:$scope.pactprotocolId,
                name:$scope.namechild,
                content:$scope.contentchild,
                createUser:createUser,
                isSign:$scope.type?$scope.type:0,
                footer:$scope.footer
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        $scope.childinit($scope.pactprotocolId);
                    })
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        // 新增保存1
        $scope.projectsavechild1 = function(){
            server.server().zjcontentaddSavedo({
                pactDataId:$scope.pactprotocolId,
                name:$scope.namechild1,
                keyName:$scope.contentchild1,
                type:$scope.typeddd==0?2:1,
                createUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        $scope.childinit1($scope.pactprotocolId);
                    })
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        // 编辑初始化
        $scope.editcompactchild = function(flag,id){
            server.server().zjpactprotocoltemplateinitUpdatedo({
                id:id
            }, function (data) {
                if (data.result === true) {
                    $scope.updatenamechild = data.data.name
                    $scope.updatecontentchild = data.data.content
                    $scope.updateId = data.data.id
                    $scope.updatepactTemplateId = data.data.pactTemplateId
                    $scope.updateisSign = data.data.isSign
                    $scope.updatefooter = data.data.footer
                    $('.'+flag).dialog();
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
       
        // 编辑保存
        $scope.updatecompactsavechild = function(){
            server.server().zjppactprotocoltemplateupdateSavedo({
                id:$scope.updateId,
                pactTemplateId:$scope.updatepactTemplateId,
                name:$scope.updatenamechild,
                content:$scope.updatecontentchild,
                type:$scope.type,
                updateUser:createUser,
                isSign:$scope.updateisSign?$scope.updateisSign:0,
                footer:$scope.updatefooter
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        $scope.childinit($scope.pactprotocolId);
                    })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
         // 编辑初始化
         $scope.editcompactchild1 = function(flag,id,index){
            console.log($scope.parenthetonglist)
                    $scope.updatenamechild1 = $scope.parenthetonglist[index].name
                    $scope.updatecontentchild1 = $scope.parenthetonglist[index].keyName
                    $scope.updateId1 = $scope.parenthetonglist[index].pactDataId
                    $scope.id1 = $scope.parenthetonglist[index].id
                    $scope.type = $scope.parenthetonglist[index].type
                    // $scope.updatepactTemplateId = data.data.pactTemplateId
                    $('.'+flag).dialog();
        }
        // 编辑保存1
        $scope.updatecompactsavechild1 = function(){
            server.server().zjcontentupdateSavedo({
                id:$scope.id1,
                pactDataId:$scope.updateId1,
                name:$scope.updatenamechild1,
                keyName:$scope.updatecontentchild1,
                type:$scope.type,
                updateUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        $scope.childinit1($scope.pactprotocolId);
                    })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

        // 删除
        $scope.deletecompactchild = function(id){
            confirm('确定删除？',function(){
                server.server().zjpactprotocoltemplatedeleteByIddo({
                    id:id
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            $scope.childinit($scope.pactprotocolId);
                        })
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }
        // 删除1
        $scope.deletecompactchild1 = function(id){
            confirm('确定删除？',function(){
                server.server().zjcontentdeleteByIddo({
                    id:id
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            $scope.childinit1($scope.pactprotocolId);
                        })
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }



        $scope.config = {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [
                [
                    'anchor', //锚点
                    'undo', //撤销
                    'redo', //重做
                    'bold', //加粗
                    'indent', //首行缩进
                    'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    'superscript', //上标
                    'formatmatch', //格式刷
                    'source', //源代码
                    'blockquote', //引用
                    'pasteplain', //纯文本粘贴模式
                    'selectall', //全选
                    'print', //打印
                    'preview', //预览
                    'horizontal', //分隔线
                    'removeformat', //清除格式
                    'time', //时间
                    'date', //日期
                    'unlink', //取消链接
                    'insertrow', //前插入行
                    'insertcol', //前插入列
                    'mergeright', //右合并单元格
                    'mergedown', //下合并单元格
                    'deleterow', //删除行
                    'deletecol', //删除列
                    'splittorows', //拆分成行
                    'splittocols', //拆分成列
                    'splittocells', //完全拆分单元格
                    'deletecaption', //删除表格标题
                    'inserttitle', //插入标题
                    'mergecells', //合并多个单元格
                    'deletetable', //删除表格
                    'cleardoc', //清空文档
                    'insertparagraphbeforetable', //"表格前插入行"
                    'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'simpleupload', //单图上传
                    // 'insertimage', //多图上传
                    'edittable', //表格属性
                    'edittd', //单元格属性
                    'link', //超链接
                    'emotion', //表情
                    'spechars', //特殊字符
                    'searchreplace', //查询替换
                    'map', //Baidu地图
                    'gmap', //Google地图
                    'insertvideo', //视频
                    'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    'directionalityltr', //从左向右输入
                    'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    'pagebreak', //分页
                    'insertframe', //插入Iframe
                    'imagenone', //默认
                    'imageleft', //左浮动
                    'imageright', //右浮动
                    'attachment', //附件
                    'imagecenter', //居中
                    'wordimage', //图片转存
                    'lineheight', //行间距
                    'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    'autotypeset', //自动排版
                    'webapp', //百度应用
                    'touppercase', //字母大写
                    'tolowercase', //字母小写
                    'background', //背景
                    'template', //模板
                    'scrawl', //涂鸦
                    'music', //音乐
                    'inserttable', //插入表格
                    'drafts', // 从草稿箱加载
                    'charts', // 图表
                ]
            ],
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            initialFrameWidth: '100%',
            initialFrameHeight: 200,


        };
        //添加窗口显示
        $scope.addshow=function(flag){
            $scope.templateName = '';
            $scope.templateOne = '';
            $scope.content = '';
            $scope.templateTwo = '';
            $('.'+flag).dialog();
        }
        //编辑保存
        $scope.updatecompactsave=function(content,id){
            server.server().updatecompactdata({
                id:id,
                templateName:$scope.updatetemplateName,
                templateOne:$scope.updatetemplateOne,
                templateContent:content,
                updateUser:createUser,
                templateTwo:$scope.updatetemplateTwo
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        compactlist();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //新建保存
        $scope.projectsave=function(content){
            console.log($scope.templateOne,$scope.templateTwo)
            server.server().addcompactdata({
                templateName:$scope.templateName,
                templateContent:content,
                createUser:createUser,
                templateOne:$scope.templateOne,
                templateTwo:$scope.templateTwo
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        $scope.templateName='';
                        $scope.content='';
                        compactlist();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                    $scope.templateName='';
                    $scope.content='';
                }
            }, function (err) {

            });
        }
        //删除
        $scope.deletecompact=function(id){
            confirm('确定删除？',function(){
                server.server().deletecompactdata({
                    id:id
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            compactlist();
                        })
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })

        }

    }])
    //首页-新闻动态详情
    .controller('newsDetailCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.newsId=$state.params.newsId;
        var userId=server.server().userId;
        let loginHost = server.server().loginHost;
        $scope.login = function () {
            document.location = loginHost;
        }
        $scope.imgHost=server.server().imgHost;
        
        //用户名和用户头像放
        if(userId!=''){
            server.server().zjmUserImg({
                userId:userId
            },function (data) {
                if(data.result){
                    $scope.nickname=data.data.nickname;//昵称
                    $scope.realname=data.data.realname;//真实名字
                    $scope.photoUrl=data.data.photoUrl;//用户头像
                    $scope.$apply();
                }else {
                    alert(data.message);
                }
            });
        }
        server.server().zjcolumnqueryColumndo({
        }, function (data) {
            if (data.result) {
                $scope.indexwordarr = data.data;
                $scope.indexwordarr.forEach(function(item,index){
                    // "columnNo": 2, // 1品牌介绍  2品牌简介 3 品牌荣誉 4 代表项目
                    if(item.columnNo==1){
                        $scope.brandintroduced = item.name
                    }
                    if(item.columnNo==2){
                        $scope.brandintrodjian = item.name
                    }
                    if(item.columnNo==3){
                        $scope.brandintrodyu = item.name
                    }
                    if(item.columnNo==4){
                        $scope.brandintrodxiangmu = item.name
                    }
                })
            }
        }, function (err) {
    
        });
        //咨询热线
        server.server().lgcMainInfoHotline({}, function (data) {
                $scope.mobile = data.data[0].mobile;
                $scope.$apply();
            },
            function () {
                alert(errorText);
            });
        server.server().newsDetailsInfo({
            id:$scope.newsId
            }, function (data) {
                if (data.result) {
                    $scope.newsList=data.data;
                } else {
                    alert(data.message);
                }
                $scope.$apply();
            },
            function () {
                alert(errorText);
            });


    }])
    //物业还建基础数据
    .controller('databasicRebuildCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){

        var createUser=server.server().userId;
        $scope.istype='';
        $scope.newname='';
        $scope.clearData=function(){
            $scope.newname='';
            $scope.remarks='';
            $scope.istype='';
        }
        //还建基础数据初始化
        function rebuildInit(){
            server.server().rebuildInitList({
            }, function (data) {
                if (data.result === true) {
                    $scope.rebuildData=data.data;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        rebuildInit();

        //添加弹窗
        $scope.addshow=function(flag){
            $('.'+flag).dialog();
        }
        //编辑弹窗 初始化
        $scope.editprojectlist=function(flag,id,code,name,remarks){
            $('.'+flag).dialog();
            $scope.isupdatetype=code;
            $scope.updatename=name;
            $scope.updateremarks=remarks;
            $scope.id=id;
        }
        //保存项目名称
        $scope.rebuildsave=function(){
            server.server().addRebuildData({
                shemaName:$scope.newname,
                remarks:$scope.remarks,
                status:$scope.istype,
                createUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        rebuildInit();
                        $scope.newname='';
                        $scope.remarks='';
                        $scope.istype='';
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                    $scope.newname='';
                    $scope.remarks='';
                    $scope.istype='';
                }
            }, function (err) {

            });
        }
        //下拉框类型初始化
        server.server().rebuidTypeinit({
        }, function (data) {
            if (data.result === true) {
                $scope.initdata=data.data;
                $scope.$apply()
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        //修改保存
        $scope.updatesave=function(id){
            server.server().updateRebuildData({
                id:id,
                shemaName:$scope.updatename,
                remarks:$scope.updateremarks,
                status:$scope.isupdatetype,
                updateUser:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        rebuildInit();
                    })
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
        //删除
        $scope.delete=function(id){
            confirm('确定删除？',function(){
                server.server().deleteRebuildData({
                    id:id,
                    userId:createUser
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message,function(){
                            rebuildInit();
                        })
                        $scope.$apply()
                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }

    }])
    //财务管理-查看合同
    .controller('pactInfoCtrl', ['$http', '$scope','server', '$state','dict','$rootScope',function($http, $scope,server,$state,dict,$rootScope){
        $scope.pactId=$state.params.pactId;//合同ID
        $scope.flag=$state.params.flag;//合同ID
        $scope.userId = server.server().userId;
        if($scope.flag=='1'){
            server.server().zjpactinfoexamineDownloadPactdo({
                pactModeId:$scope.pactId,
                userId:$scope.userId,
                type:'1'
            },function (data) {
                if(data.result && data.data){
                    $scope.content=data.data.content;
                    $scope.$apply();
                }else {
                    alert(data.message);
                }
            });
        }else{
            server.server().watchPactInfoData({
                pactId:$scope.pactId,
            }, function (data) {
                if (data.result === true) {
                    $scope.content=data.data.content;
                    $scope.$apply()
                } else {
                    alert(data.message);
                }
            }, function (err) {
    
            });
        }
    }])
