angular.module('app').controller('compensatePropertyCtrl', ['$http', '$scope', 'server', '$state', 'dict', '$rootScope', function ($http, $scope, server, $state, dict, $rootScope) {

    $scope.roomId = $state.params.roomId;
    $scope.projectId = $state.params.projectid;
    // $scope.projectId='47518e0d3278404eb095f6bd30046c0e';
    $scope.updatesaveFlag = true;
    $scope.timedata = 3000;

    var createUser = server.server().userId; //用户id

    $scope.no = '/';
    //关注
    $scope.list = {
        roomId:$state.params.roomId,
        projectId: $state.params.roomId, //1是项目id 2是物业id
        createUser: server.server().userId,        toUserId: server.server().userId,
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


    // 打印
    $scope.print = server.server().host+'compensationplandetails/export.do'+'?roomId='+$scope.roomId
    // console.log($scope.print)
    // $scope.prints=function(){
        // let html = $('.printhtml').html();
        // document.body.innerHTML = html; 
        // window.print()
        
        
        // var wind = window.open("",'newwindow');
        // wind.document.body.innerHTML = html;
        // wind.print();
        // server.server().zjcompensationplandetailsexportdo({
        //     roomId:$scope.roomId
        // }, function (data) {
        //     alert(data);
        // });
    // }

    //查询补偿方案展示信息

    function setDate() {
        $scope.topData = [];
        $scope.bottomData = [];
        server.server().zjqueryCompensationInfodo({
            propertyId: $scope.roomId
        }, function (data) {
            if (data.result === true) {
                if (data.data.length > 0) {
                    // 删除用的id;
                    $scope.deleteId = data.data[0].compensateId;

                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].Identification === 0
                            ? $scope.topData.push(data.data[i])
                            : $scope.bottomData.push(data.data[i])
                    }



                    for (let m = 0; m < $scope.topData.length; m++) {
                        $scope.topData[m].area=(Math.round($scope.topData[m].area*100)/100||0);
                        $scope.topData[m].replacementRatio=(Math.round($scope.topData[m].replacementRatio)||0);
                        $scope.topData[m].builtInArea=(Math.round($scope.topData[m].builtInArea*100)/100||0);
                    }


                    for (let k = 0; k < $scope.bottomData.length; k++) {
                        $scope.bottomData[k].area=(Math.round($scope.bottomData[k].area*100)/100||0);
                        $scope.bottomData[k].compensatePrice=(Math.round($scope.bottomData[k].compensatePrice*100)/100||0);
                        $scope.bottomData[k].compensationAmount=(Math.round($scope.bottomData[k].compensationAmount*100)/100||0);
                        if($scope.bottomData[k].priceMode=='0'){
                            // $scope.bottomData[k].compensationAmount=$scope.bottomData[k].compensatePrice;
                        }else{
                            // status 1装修补偿 2过度费补偿 3房屋补偿 4原产证办证费补偿 5搬迁补偿
                            // isRestricted 是否限定 1 是 0否  （是否限定只有在装修补偿的时候有用到，如果有用到则按照限定的面积计算，如果补偿是总价则还是总价）
                            // restrictedArea 限定面积
                            if($scope.bottomData[k].status===1 && $scope.bottomData[k].isRestricted===1){
                                if($scope.bottomData[k].restrictedArea && ($scope.bottomData[k].area>=$scope.bottomData[k].restrictedArea)){
                                    $scope.bottomData[k].area = Math.round($scope.bottomData[k].restrictedArea*100)/100
                                    $scope.bottomData[k].disablessss = true;
                                }
                            }
                        }
                    }

                    //总计
                    $scope.totalMoneyCompensate = $scope.bottomData[0].totalMoneyCompensate ? Math.round($scope.bottomData[0].totalMoneyCompensate*100)/100 : 0;
                    // 每月补偿标识数组
                    $scope.monthlyInterimCompensate = $scope.bottomData[0].monthlyInterimCompensate ? Math.round($scope.bottomData[0].monthlyInterimCompensate*100)/100 : 0;

                    $scope.$apply();
                }
            } else {
                alert(data.message)
            }
        })
    }

    setDate();

    //添加 补偿规则初始化列表
    $scope.addlis = function () {
        server.server().zjinitCompensateRuledo({
            propertyId: $scope.roomId
        }, function (data) {
            if (data.result === true) {
                if (data.data) {
                    $scope.lists = data.data;
                    $scope.$apply();
                    $('.addlis').dialog();
                } else {
                    alert('您没有添加拆迁补偿规则！')
                }

            } else {
                alert(data.message)
            }
        }, function () {
        })

    }

    // 删除补偿方案
    $scope.Detail=function(){
        console.log( $scope.deleteId);
        confirm('确认删除补偿方案吗',function(){
            server.server().zjcompensationplandetailsdeleteByIddo({
                id:$scope.deleteId,  //补偿方案主表id
                userId:createUser //用户id
            }, function (data) {
                if (data.result) {
                    alert(data.message)
                    setDate()
                    $scope.$apply();
                } else {
                    alert(data.message)
                }
            })
        })
    }


    function addupdateajax(DATA, flag) {
        //添加展示数组0 1
        $scope.addtopData = [];
        $scope.addbottomData = [];

        //暂存数组，添加用的
        $scope.topTemporaryArray = [];
        $scope.bottomTemporaryArray = [];
        //提交数组
        $scope.planDetails = [];
        $scope.addTotalMoney = 0;
        $scope.addMonthMoney = 0;

        // 初始化还建期数下拉框
        server.server().zjsettingsinitPeriodsdo({
            // id:id
        }, function (data) {
            if (data.result === true) {
                $scope.selectval = data.data;
                // for (var i = 0; i < $scope.selectval.length; i++) {
                //     $scope.selectval[i].periodCount = Number($scope.selectval[i].periodCount);
                // }

                $scope.$apply();

            } else {
                alert(data.message)
            }
        }, function () {
        })

        //请求编辑添加接口
        if (flag == 'add') {
            // console.log(11111111111111111)
            for (var i = 0; i < DATA.length; i++) {
                DATA[i].compensationWay === 0
                    ? $scope.topTemporaryArray.push(DATA[i])
                    : $scope.bottomTemporaryArray.push(DATA[i])
            }




            for (var j = 0; j < $scope.topTemporaryArray.length; j++) {
                $scope.addtopData[j] = {

                    Identification: 0,
                    compensationId: $scope.topTemporaryArray[j].compensationTypeId,
                    programmeValue: $scope.topTemporaryArray[j].compensateTypeName,
                    childId: $scope.topTemporaryArray[j].childId,
                    subtypeName: $scope.topTemporaryArray[j].childName,
                    area: $scope.topTemporaryArray[j].area?Math.round($scope.topTemporaryArray[j].area*100)/100:0,    //置换面积
                    replacementRatio: $scope.topTemporaryArray[j].replacementRatio?Number($scope.topTemporaryArray[j].replacementRatio):0,
                    builtInArea: Math.round(Number(($scope.topTemporaryArray[j].area)||0)*($scope.topTemporaryArray[j].replacementRatio?$scope.topTemporaryArray[j].replacementRatio:0))/100,  //对应 还建面积
                    rebuiltTypeId: $scope.topTemporaryArray[j].rebuiltTypeId,
                    builtType: $scope.topTemporaryArray[j].rebuiltTypeName,
                    builtInPeriod: 0,  //下拉框还建期数

                    priceMode:$scope.topTemporaryArray[j].priceMode,
                    disabled:$scope.topTemporaryArray[j].area?true:false,
                    rulesId:$scope.topTemporaryArray[j].rulesId
                }
                if($scope.topTemporaryArray[j].isBlank===10){
                    $scope.toparea = $scope.addtopData[j].builtInArea;
                }
        
            }
            for (var k = 0; k < $scope.bottomTemporaryArray.length; k++) {

                // 空地
                if($scope.bottomTemporaryArray[k].isBlank === 10){
                    $scope.bottomTemporaryArray[k].area = $scope.toparea
                }

                $scope.addbottomData[k] = {
                    Identification: 1,
                    compensateProjectId: $scope.bottomTemporaryArray[k].compensateProjectId,
                    programmeName: $scope.bottomTemporaryArray[k].compensationProjectName,
                    compensationId: $scope.bottomTemporaryArray[k].compensationTypeId,
                    programmeValue: $scope.bottomTemporaryArray[k].compensateTypeName,
                    childId: $scope.bottomTemporaryArray[k].childId,
                    subtypeName: $scope.bottomTemporaryArray[k].childName,
                    area: $scope.bottomTemporaryArray[k].area?(Math.round($scope.bottomTemporaryArray[k].area*100)/100):0,    ////补偿面积（㎡）
                    compensationAmount: $scope.bottomTemporaryArray[k].priceMode=='0'?(Math.round((($scope.bottomTemporaryArray[k].compensationPrice)||0)*100)/100):(Math.round((($scope.bottomTemporaryArray[k].area)||0)*(($scope.bottomTemporaryArray[k].compensationPrice)||0)*100)/100),  ////补偿金额总价（input计算）
                    compensatePrice: $scope.bottomTemporaryArray[k].compensationPrice?Number($scope.bottomTemporaryArray[k].compensationPrice*100)/100:0, //补偿单价

                    priceMode:$scope.bottomTemporaryArray[k].priceMode,
                    compensationAmountAjax: $scope.bottomTemporaryArray[k].priceMode=='0'?(Math.round((($scope.bottomTemporaryArray[k].compensationPrice)||0)*100)/100):(Math.round((($scope.bottomTemporaryArray[k].area)||0)*(($scope.bottomTemporaryArray[k].compensationPrice)||0)*100)/100),  ////补偿金额总价（不允许计算传值 ）
                    disabled:$scope.bottomTemporaryArray[k].priceMode=='0'?true:false,
                    isCount:$scope.bottomTemporaryArray[k].isCount,
                    status:$scope.bottomTemporaryArray[k].status,
                    isRestricted:$scope.bottomTemporaryArray[k].isRestricted,
                    restrictedArea:$scope.bottomTemporaryArray[k].restrictedArea,
                    areaIdsabled:$scope.bottomTemporaryArray[k].priceMode=='0'?true:false,
                    areaplaceholder:$scope.bottomTemporaryArray[k].priceMode=='0'?'补偿总价':'请输入...',
                    rulesId:$scope.bottomTemporaryArray[k].rulesId
                }
                
                
            }
            for (var Q = 0; Q < $scope.addbottomData.length; Q++) {
                if($scope.addbottomData[Q].priceMode!='0'){
                    // status 1装修补偿 2过度费补偿 3房屋补偿 4原产证办证费补偿 5搬迁补偿 6延期
                    // isRestricted 是否限定 1 是 0否  （是否限定只有在装修补偿的时候有用到，如果有用到则按照限定的面积计算，如果补偿是总价则还是总价）
                    // restrictedArea 限定面积
                    if($scope.addbottomData[Q].status===1 && $scope.addbottomData[Q].isRestricted===1){
                        if($scope.addbottomData[Q].restrictedArea && ($scope.addbottomData[Q].area>=$scope.addbottomData[Q].restrictedArea)){
                            $scope.addbottomData[Q].area = Math.round($scope.addbottomData[Q].restrictedArea*100)/100;
                            $scope.addbottomData[Q].compensationAmount = Math.round($scope.addbottomData[Q].compensatePrice*$scope.addbottomData[Q].area*100)/100;
                            $scope.addbottomData[Q].disabled = true;
                        }
                    }
                }
                // 总价求值
                if(!$scope.addbottomData[Q].compensationAmount){
                    $scope.addbottomData[Q].compensationAmount = 0;
                }
                // 是否是每月过渡补偿合计(addMonthMoney)还是货币补偿合计(addTotalMoney)
                if($scope.addbottomData[Q].status===2){
                    if($scope.addbottomData[Q].isCount=== 8){
                        continue
                    }
                    $scope.addMonthMoney += Number($scope.addbottomData[Q].compensationAmount);
                }else if($scope.addbottomData[Q].status!=6){
                    if($scope.addbottomData[Q].isCount=== 8){
                        continue
                    }
                    $scope.addTotalMoney += Number($scope.addbottomData[Q].compensationAmount);
                }
            }
            $scope.addMonthMoney = Math.round($scope.addMonthMoney*100)/100
            $scope.addTotalMoney = Math.round($scope.addTotalMoney*100)/100


        } else {
            for (let i = 0; i < DATA.length; i++) {
                DATA[i].Identification === 0
                    ? $scope.addtopData.push(DATA[i])
                    : $scope.addbottomData.push(DATA[i])
            }

            for (let m = 0; m < $scope.addtopData.length; m++) {
                if($scope.addtopData[m].isBank===10){
                    $scope.updatetoparea = $scope.addtopData[m].builtInArea;
                }
                $scope.addtopData[m].area=(Math.round($scope.addtopData[m].area*100)/100||0);
                $scope.addtopData[m].replacementRatio=(Math.round($scope.addtopData[m].replacementRatio)||0);
                $scope.addtopData[m].builtInArea=(Math.round($scope.addtopData[m].builtInArea*100)/100||0);
            }


            for (let k = 0; k < $scope.addbottomData.length; k++) {
                if($scope.addbottomData[k].isBank === 10){
                    $scope.addbottomData[k].area = $scope.updatetoparea
                }
                $scope.addbottomData[k].area=(Math.round($scope.addbottomData[k].area*100)/100||0);
                $scope.addbottomData[k].compensatePrice=(Math.round($scope.addbottomData[k].compensatePrice*100)/100||0);
                $scope.addbottomData[k].compensationAmount=(Math.round($scope.addbottomData[k].compensationAmount*100)/100||0);
                if($scope.addbottomData[k].priceMode=='0'){
                    // $scope.addbottomData[k].compensationAmount=$scope.addbottomData[k].compensatePrice;
                    $scope.addbottomData[k].disabled=true;
                }else{
                    // status 1装修补偿 2过度费补偿 3房屋补偿 4原产证办证费补偿 5搬迁补偿
                    // isRestricted 是否限定 1 是 0否  （是否限定只有在装修补偿的时候有用到，如果有用到则按照限定的面积计算，如果补偿是总价则还是总价）
                    // restrictedArea 限定面积
                    if($scope.addbottomData[k].status===1 && $scope.addbottomData[k].isRestricted===1){
                        if($scope.addbottomData[k].restrictedArea){
                            //  && ($scope.addbottomData[k].area>=$scope.addbottomData[k].restrictedArea)
                            // 修改时如果大于200 （限定）就按很定算，否则就按实际算
                            $scope.addbottomData[k].sendareadisabled=$scope.addbottomData[k].area;//(实际)
                            if($scope.addbottomData[k].area>=$scope.addbottomData[k].restrictedArea){
                                $scope.addbottomData[k].area = Math.round($scope.addbottomData[k].restrictedArea*100)/100;//（限定）
                                $scope.addbottomData[k].compensationAmount = ($scope.addbottomData[k].compensatePrice*$scope.addbottomData[k].area*100)/100;
                                // $scope.addbottomData[k].disabled=true;
                                $scope.addbottomData[k].senddisabled=true;
                            }
                            
                            
                        }
                    }
                }
            }

            //总计
            $scope.addTotalMoney = $scope.addbottomData[0].totalMoneyCompensate ? Math.round($scope.addbottomData[0].totalMoneyCompensate*100)/100 : 0;
            // 每月补偿标识数组
            $scope.addMonthMoney = $scope.addbottomData[0].monthlyInterimCompensate ? Math.round($scope.addbottomData[0].monthlyInterimCompensate*100)/100 : 0;

        }
        $scope.$apply();
    }

    // function inputvals(val){
    //     // var months = [1,2,3,4,5,6,7,8,9,0,'.'];
    //     // months[val]
    // }

    //置地面积
    $scope.topngchanges = function (val, indx) {
        if (!$scope.addtopData[indx].replacementRatio) {
            alert('请输入置换比例！')
            // return;
        }
        if (!val) {
            alert('请输入置换面积！')
            // return;
        }
        if (val.charCodeAt() > 89) {
            // console.log(111,val.charCodeAt(),val)
            return;
        }
        $scope.addtopData[indx].builtInArea = Math.round((Number(val) * Number($scope.addtopData[indx].replacementRatio) / 100)*100)/100;
        console.log($scope.addtopData[indx].builtInArea)
        if($scope.addtopData[indx].isBank===10){
            $scope.addTotalMoney = 0
            $scope.addMonthMoney = 0
            for(var i = 0;i<$scope.addbottomData.length;i++){
                if($scope.addbottomData[i].isBank ===10){
                    $scope.addbottomData[i].area = Math.round($scope.addtopData[indx].builtInArea*100)/100;
                    $scope.addbottomData[i].compensationAmount = Math.round(($scope.addbottomData[i].area * $scope.addbottomData[i].compensatePrice)*100)/100;
                    
                }
                buttomchange('update')
            }
            
        }
    }
    //置换比例的时候
    $scope.updatetopngchanges = function (val, indx, flag) {
        // if(flag=='update'){
        if (!$scope.addtopData[indx].area) {
            alert('请输入置换面积！')
            // return;
        }
        if (!val) {
            alert('请输入置换比例！')
            // return;
        }
        if (val.charCodeAt() > 89) {
            // console.log(111,val.charCodeAt(),val)
            return;
        }
        $scope.addtopData[indx].builtInArea = Math.round(Number(val) / 100 * Number($scope.addtopData[indx].area)*100)/100;
        if($scope.addtopData[indx].isBank===10){
            $scope.addTotalMoney = 0
            $scope.addMonthMoney = 0
            for(var i = 0;i<$scope.addbottomData.length;i++){
                if($scope.addbottomData[i].isBank ===10){
                    $scope.addbottomData[i].area = Math.round($scope.addtopData[indx].builtInArea*100)/100
                    $scope.addbottomData[i].compensationAmount = Math.round($scope.addbottomData[i].area * $scope.addbottomData[i].compensatePrice*100)/100;
                    
                }
                buttomchange('update')
            }
            
        }
        // }
    }
    



    //下拉框斂拿id
    $scope.topSelect = function (val, indx) {
        if (!val) {
            $scope.addtopData[indx].builtInPeriod = 0;
            alert('请选择还建期数！');
            // return
        }
        $scope.addtopData[indx].builtInPeriod = val;

    }


    //1的补偿面积input输入事件
    $scope.Middlengchanges = function (val, indx, flag) {
        //总计
        $scope.addTotalMoney = 0;
        // 每月补偿标识数组
        $scope.addMonthMoney = 0;

        if (!$scope.addbottomData[indx].compensatePrice) {
            alert('请输入补偿单价！')
            // return;
        }
        if (!val) {
            alert('请输入补偿面积！')
            // return;
        }
        if (val.charCodeAt() > 89) {
            // console.log(111,val.charCodeAt(),val)
            return;
        }

        // if(val.charCodeAt()<78){
        //
        //     return
        // }
        

        // 1的总计
        $scope.addbottomData[indx].compensationAmount = Math.round(Number(val) * Number($scope.addbottomData[indx].compensatePrice)*100)/100;
      
        buttomchange(flag)


    }

    //总面积改变事件（编辑的时候）
    $scope.updatecompensationAmount = function (val, indx, flag) {
        //总计
        $scope.addTotalMoney = 0;
        // 每月补偿标识数组
        $scope.addMonthMoney = 0;

        if (!$scope.addbottomData[indx].compensatePrice) {
            alert('请输入补偿单价！')
            // return;
        }
        if (!$scope.addbottomData[indx].area) {
            alert('请输入补偿面积！')
            // return;
        }
        // if (val.charCodeAt() > 89) {
            // console.log(111,val.charCodeAt(),val)
            // return;
        // }
        buttomchange(flag)

    }

    

    //1的编辑补偿单价输入事件
    $scope.updateMiddlengchanges = function (val, indx, flag) {
        //总计
        $scope.addTotalMoney = 0;
        // 每月补偿标识数组
        $scope.addMonthMoney = 0;

        if (!$scope.addbottomData[indx].area) {
            alert('请输入补偿面积！')
            // return;
        }
        if (!val) {
            alert('请输入补偿单价！')
            // return;
        }
        if (val.charCodeAt() > 89) {
            // console.log(111,val.charCodeAt(),val)
            return;
        }
        // 1的总计
        if($scope.addbottomData[indx].priceMode===0){
            $scope.addbottomData[indx].compensationAmount = Number(val);
        }else{
            $scope.addbottomData[indx].compensationAmount = Math.round(Number(val) * Number($scope.addbottomData[indx].area)*100)/100;
        }
        buttomchange(flag)

        // for (var k = 0; k < $scope.addbottomData.length; k++) {



        //     if (!$scope.addbottomData[k].compensationAmount) {
        //         $scope.addbottomData[k].compensationAmount = 0;
        //     }
            
        //     // 每月补偿
        //     if (flag == 'update') {
        //         if ($scope.addbottomData[k].status===2) {
        //             $scope.addMonthMoney += Number($scope.addbottomData[k].compensationAmount);
        //         }if($scope.addbottomData[k].status!=6){
        //             $scope.addTotalMoney += Number($scope.addbottomData[k].compensationAmount);
        //         }
        //     } else {
        //         if ($scope.bottomTemporaryArray[k].status===2) {
        //             $scope.addMonthMoney += Number($scope.addbottomData[k].compensationAmount);
        //         }if($scope.addbottomData[k].status!=6){
        //             $scope.addTotalMoney += Number($scope.addbottomData[k].compensationAmount);
        //         }
        //     }
        //     $scope.addTotalMoney += Number($scope.addbottomData[k].compensationAmount);
        // }
        // $scope.addTotalMoney = $scope.addTotalMoney.toFixed(2)  //货币补偿合计
        // $scope.addMonthMoney = $scope.addMonthMoney.toFixed(2)  //每月过渡补偿合计
    }

    function buttomchange(flag){
        for (var k = 0; k < $scope.addbottomData.length; k++) {
            // if($scope.addbottomData[k].isCount===8){
            //     $scope.addbottomData[k].compensationAmount = 0;
            // }
            
            if (!$scope.addbottomData[k].compensationAmount) {
                $scope.addbottomData[k].compensationAmount = 0;
            }
            // 每月补偿
            if (flag == 'update') {
                if ($scope.addbottomData[k].status===2) {
                    if($scope.addbottomData[k].isCount===8){
                        continue 
                    }
                    $scope.addMonthMoney += Number($scope.addbottomData[k].compensationAmount);
                }else if($scope.addbottomData[k].status!=6){
                     if($scope.addbottomData[k].isCount===8){
                        
                        continue 
                    }
                    $scope.addTotalMoney += Number($scope.addbottomData[k].compensationAmount);
                }
            } else {
                console.log($scope.addbottomData[k])
                if ($scope.bottomTemporaryArray[k].status===2) {
                    if($scope.addbottomData[k].isCount===8){
                        continue 
                    }
                    $scope.addMonthMoney += Number($scope.addbottomData[k].compensationAmount);
                }else if($scope.addbottomData[k].status!=6){
                    if($scope.addbottomData[k].isCount===8){
                        continue 
                    }
                    $scope.addTotalMoney += Number($scope.addbottomData[k].compensationAmount);
                }
            }

            
        }
        $scope.addTotalMoney = Math.round($scope.addTotalMoney*100)/100 //货币补偿合计
        $scope.addMonthMoney = Math.round($scope.addMonthMoney*100)/100//每月过渡补偿合计
    }


    //添加
    $scope.add = function (id, indx) {

        server.server().zjqueryCompenPlando({
            id: id,
            roomId:$scope.roomId
        }, function (data) {
            if (data.result === true) {
                if(data.data){
                    if (data.data.length > 0) {
                        addupdateajax(data.data, 'add');
                        $scope.$apply();
                        $('.addtext').dialog();
                    } else {
                        alert('您没有添加拆迁补偿规则！')
                    }
                }else{
                    alert(data.message)
                }

            } else {
                alert(data.message)
            }
        }, function () {
        })

    }

    //编缉
    $scope.update = function () {
        server.server().zjqueryCompensationInfodo({
            propertyId:$scope.roomId
        },function(data){
            if(data.result===true){
                if(data.data.length>0){
                    addupdateajax(data.data,'update');
                    $scope.$apply();
                    $('.update').dialog();
                } else {
                    alert('请先添加补偿方案信息！')
                }
            } else {
                alert(data.message)
            }
        }, function () {

        })
         
        dict.timeouts(false,2000,function(a){
            $scope.tim = a;
        });
        console.log($scope.tim)

    }

    //添加保存
    $scope.addPersonsave = function () {
        if($scope.updatesaveFlag){
            $scope.planDetails = [];

        
            for (var j = 0; j < $scope.addtopData.length; j++) {
                $scope.addtopData[j] = {
                    Identification: 0,
                    // rulesId
                    rulesId: $scope.addtopData[j].rulesId,
                    compensationId: $scope.addtopData[j].compensationId,
                    programmeValue: $scope.addtopData[j].programmeValue,
                    childId: $scope.addtopData[j].childId,
                    subtypeName: $scope.addtopData[j].subtypeName,
                    area: $scope.addtopData[j].area,    //置换面积
                    replacementRatio: $scope.addtopData[j].replacementRatio,
                    builtInArea:$scope.addtopData[j].builtInArea,
                    rebuiltTypeId: $scope.addtopData[j].rebuiltTypeId,
                    builtType: $scope.addtopData[j].builtType,
                    builtInPeriod: $scope.addtopData[j].builtInPeriod,  //下拉框还建期数
                    priceMode: $scope.addtopData[j].priceMode
                }
                $scope.planDetails.push($scope.addtopData[j])
            }
            for (var k = 0; k < $scope.addbottomData.length; k++) {
                $scope.addbottomData[k] = {
                    Identification: 1,
                    // rulesId
                    rulesId: $scope.addbottomData[k].rulesId,
                    compensateProjectId: $scope.addbottomData[k].compensateProjectId,
                    programmeName: $scope.addbottomData[k].programmeName,
                    compensationId: $scope.addbottomData[k].compensationId,
                    programmeValue: $scope.addbottomData[k].programmeValue,
                    childId: $scope.addbottomData[k].childId,
                    subtypeName: $scope.addbottomData[k].subtypeName,
                    area: $scope.addbottomData[k].area,    ////补偿面积（㎡）
                    compensationAmount: $scope.addbottomData[k].compensationAmount,  ////补偿金额总价（input计算）
                    compensatePrice: $scope.addbottomData[k].compensatePrice,
                    priceMode: $scope.addbottomData[k].priceMode
                }
                $scope.planDetails.push($scope.addbottomData[k])

            }
            console.log($scope.addTotalMoney,$scope.addMonthMoney)
            server.server().zjaddCompensationPlando({
                planDetails: JSON.stringify($scope.planDetails),
                propertyId: $scope.roomId,            //物业id
                totalMoneyCompensate: $scope.addTotalMoney,	//货币补偿合计
                monthlyInterimCompensate: $scope.addMonthMoney,	//每月过度补偿和合计	是
                createUser: createUser,	//创建人id	是
                projectId: $scope.projectId,	            //项目id	是
                // projectName: $scope.bottomTemporaryArray[0].projectName||$scope.topTemporaryArray[0].projectName	        //项目名称	是
                // projectName: ''	        //项目名称	是

            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.planDetails=[];
                    setDate();
                    $('.addtext').fadeOut(200);
                    $scope.$apply();

                } else {
                    alert(data.message)
                }
            }, function () {
            })
            $scope.updatesaveFlag = false;
                dict.timeouts($scope.updatesaveFlag,$scope.timedata,function(data){
                        $scope.updatesaveFlag = data;
                })
        }
    }

    //编辑弹窗(是否弹)
    $scope.updatePersonalert = function () {
            $('.updateremarks').dialog();
            $('.update').fadeOut(200);
        
    }
    //修改弹窗提交
    $scope.updatePersonsave = function(){
        if($scope.updatesaveFlag){
            
            $scope.planDetails = [];
            
            for (var j = 0; j < $scope.addtopData.length; j++) {
                $scope.topTemporaryArray[j] = {
                    id: $scope.addtopData[j].id, //方案详情id
                    compensateId: $scope.addtopData[j].compensateId, //补偿方案id
                    Identification: 0,  //拆赔方案标识（1：货币补偿2:主体建筑产权置换）
                    extendV1: $scope.addtopData[j].extendV1, //还建信息id
                    area: $scope.addtopData[j].area,  //置换面积
                    builtInArea: $scope.addtopData[j].builtInArea, //还建面积
                    builtInPeriod: $scope.addtopData[j].builtInPeriod,  //还建期数
                    replacementRatio: $scope.addtopData[j].replacementRatio  //置换比例

                }
                $scope.planDetails.push($scope.topTemporaryArray[j])
            }
            for (var k = 0; k < $scope.addbottomData.length; k++) {

                $scope.bottomTemporaryArray[k] = {
                    id: $scope.addbottomData[k].id,
                    compensateId: $scope.addbottomData[k].compensateId,
                    Identification: 1,
                    area: ($scope.addbottomData[k].status===1 && $scope.addbottomData[k].isRestricted===1)?($scope.addbottomData[k].addbottomData?$scope.addbottomData[k].addbottomData.toString():0):($scope.addbottomData[k].area?$scope.addbottomData[k].area.toString():0),
                    // area: ($scope.addbottomData[k].senddisabled===true)?$scope.addbottomData[k].sendareadisabled:($scope.addbottomData[k].area?$scope.addbottomData[k].area.toString():0),
                    compensationAmount: $scope.addbottomData[k].compensationAmount?$scope.addbottomData[k].compensationAmount.toString():0,
                    compensatePrice: $scope.addbottomData[k].compensatePrice?$scope.addbottomData[k].compensatePrice.toString():0,
                    restrictedArea:($scope.addbottomData[k].status===1 && $scope.addbottomData[k].isRestricted===1)?($scope.addbottomData[k].area?$scope.addbottomData[k].area.toString():0):($scope.addbottomData[k].restrictedArea?$scope.addbottomData[k].restrictedArea.toString():0)
                }
                $scope.planDetails.push($scope.bottomTemporaryArray[k])

            }
            

            server.server().zjupdateCompensationInfodo({
                planDetails: JSON.stringify($scope.planDetails),
                propertyId: $scope.roomId,            //物业id
                totalMoneyCompensate: $scope.addTotalMoney,	//货币补偿合计
                monthlyInterimCompensate: $scope.addMonthMoney,	//每月过度补偿和合计	是
                createUser: createUser,	//创建人id	是
                projectId: $scope.projectId,	            //项目id	是
                // projectName:$scope.topTemporaryArray[0].projectName	        //项目名称	是
                remarks:$scope.remarks
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    $scope.disableds = true;
                    $scope.planDetails = [];
                    setDate();
                    $('.update').fadeOut(200);
                    $('.updateremarks').fadeOut(200);
                    $scope.$apply();

                } else {
                    alert(data.message)
                }
            }, function () {
                alert(data.message)
            })
            $scope.updatesaveFlag = false;
            dict.timeouts($scope.updatesaveFlag,$scope.timedata,function(data){
                    $scope.updatesaveFlag = data;
            })
        }
    }


}])