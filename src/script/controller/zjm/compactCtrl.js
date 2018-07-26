/**
 * Created by pc on 2017/10/30.
 */
//合同管理
angular.module('app').controller('compactmanagementCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
//选中导航


    //关注
    $scope.list = {
        projectId:$state.params.projectid,
        createUser:server.server().userId,
        toUserId:server.server().userId,
        type:3,   //1转移   2分享   3关注
        status:1 //类型 1 项目 2物业
    }

    $scope.listtop={
        projectId:$state.params.projectid,
        roomId:'',
        createUser:server.server().userId,
        imgHost:server.server().imgHost,
        questiontype:4,//1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag:2,  //项目id1  物业id2
        reloadajax:1,   //需要调用函数就传1 or ''
        locationflag:1, //需要跳转到某页面就填写 1 or ''
    }
    $scope.projectId = $state.params.projectid;///当前操作项目的id'261e554de2f3493ebed1e4b6567818d1';
    //查询出当前项目的合同个数
    var createUser = server.server().userId;
    $scope.imgHost = server.server().imgHost;

    /**
     * 发布跟进信息
     * @param content 发布的内容
     * @param propertyId 当前操作的物业的id
     * @param imageUrl 图片的地址
     * @param soundUrl 音频的地址
     * @param vidoUrl 视频的地址
     */

    $scope.action = {};
    $scope.dataFollowUp=function(name,roomId,pacteId){
        $scope.roomId = roomId;
        $scope.pacteId = pacteId;
        $scope.action.reset(roomId);
    }


    //跟进页面刷新
    $scope.myajax=function(){
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
    }
    //跟进页面跳转
    $scope.mylocation=function(){
        $state.go('compactdetail',{propertyId:$scope.roomId,projectId:$state.params.projectid,pacteId:$scope.pacteId})
    }
    ////////////////////共享和移交选择角色弹窗从这里开始


    //转移共享
    $scope.transferclick = {};
    $scope.gcShowWin=function(flag){
        $scope.transferclick.reset(flag);
    }


    ///////////////////end/////////////////////////////////

    $scope.search = '';
    //搜索
    $scope.searchs=function(){
        doSev()
    }


    //分页配置
    $scope.conf = {
        total: 10,  //共多少页
        currentPage: 1,  //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
    }

     

    var areaArr = [];//存放选中的区域
    var nodeArr = [];//存放阶段的节点
    //初始化
    function doSev() {
        console.log($scope.search)
        //首先获取选中的搜索条件
        $scope.getSelectCheckBox();
        var signId = nodeArr.toString();//签约进度
        var schemaId = areaArr.toString();//区域id
        nodeArr.length = 0;//清空数组
        areaArr.length = 0;
        server.server().showPactList({
            projectId: $scope.projectId,
            signId: signId,
            schemaId: schemaId,
            searchKeys:$scope.search||'',
            pageNo: $scope.conf.currentPage||1,
            pageSize: $scope.conf.itemPageLimit||10
        }, function (data) {
            if (data.result === true) {
                $scope.pactList = data.data.rows;
                $scope.conf.pageNo = data.data.pageNo;
                //多少页
                $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                //共有多少条数据
                $scope.conf.counts = data.data.total;
                //用于显示当前的合同的个数为
                $scope.counts = data.data.total;
                $scope.$broadcast("categoryLoaded");
            } else {
                alert(data.message)
            }
            $scope.$apply();
        })
    }

    //物业基本信息（上面）
    //项目信息
    server.server().zjprojectdeleteById({
        id: $scope.projectId,
        userId: createUser
    }, function (data) {
        if (data.result === true) {
            $scope.project2 = data.data.project;
            $scope.project2.createTime = dict.timeConverter($scope.project2.createTime);
            if($scope.project2){    $scope.project2.updateTime = dict.timeConverter($scope.project2.updateTime);}
            $scope.$apply();
        }
    })

    //获取签约的节点
    function doGetNode() {
        //测绘阶段的所有子阶段，签约阶段的所有子阶段
        server.server().showSignNodedo({}, function (data) {
            if (data.result === true) {
                $scope.nodeSign = data.data.signList;
            }
            $scope.$apply();
        })
    }

    //获取区域
    function doGetCondition() {
        //加载搜索条件
        server.server().showPropertyConditionsdo({
            projectId: $scope.projectId
        }, function (data) {
            if (data.result === true) {
                $scope.porpertyConditions = data.data;
            }
            $scope.$apply();
        });
    }

    //获取当前项目物业的个数
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
    })
   
    //事件
    //点击事件
    $scope.doChange = function (name, names) {
        //去掉全选
        var checkLength = $('input[name="' + name + '"]:checkbox').length;
        var checkedLength = $('input[name="' + name + '"]:checked').length
        if (checkLength != checkedLength) {
            $('input[name="' + names + '"]:checkbox')[0].checked = false;
        } else {
            $('input[name="' + names + '"]:checkbox')[0].checked = true;
        }
        doSev();
    }
    //全选和反选操作
    $scope.selectedAll = function (name) {
        if ($('input[name="' + name + 's"]:checkbox').is(':checked')) {
            $('input[name="' + name + '"]:checkbox').each(function (index) {
                this.checked = true;
            })
        } else {
            $('input[name="' + name + '"]:checkbox').each(function (index) {
                this.checked = false;
            })
        }
        //数据加载
        doSev();
    }
    //获取选中的数据的节点
    $scope.getSelectCheckBox = function () {
        $('input[name="con"]:checked').each(function () {
            areaArr.push($(this)[0].id);
        })
        $('input[name="sign"]:checked').each(function () {
            nodeArr.push($(this)[0].id);
        })
    }

    //事件的监听
    $scope.$watch('conf.currentPage + conf.itemPageLimit+projectnameinput+search', function (news) {
        
        //加载签约节点的数据
        doGetNode();
        //加载搜索条件区域
        doGetCondition();
        //加载页面的数据
        doSev();
    })




}])
//补偿方案
    .controller('comcompensateCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;
        var createUser = server.server().userId;

        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
        //获取查询补偿方案展示信息

        function setDate() {
            $scope.topData = [];
            $scope.bottomData = [];
            server.server().zjqueryCompensationInfodo({
                propertyId: $scope.propertyId
            }, function (data) {
                if (data.result === true) {
                    if (data.data.length > 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].Identification === 0
                                ? $scope.topData.push(data.data[i])
                                : $scope.bottomData.push(data.data[i])
                        }

                        $scope.totalMoneyCompensate = Number(data.data[0].totalMoneyCompensate).toFixed(2);
                        $scope.monthlyInterimCompensate = Number(data.data[0].monthlyInterimCompensate).toFixed(2);
                        $scope.$apply();
                    }
                } else {
                    alert(data.message)
                }
            })
        }

        setDate();

}])

    //查伪信息
    .controller('comcheckfalseCtrl', ['$http', '$scope', 'server', '$state', 'dict','$rootScope', function ($http, $scope, server, $state, dict,$rootScope) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;
        $scope.headImg = server.server().headImg;
        //页面最上部的部分
        var createUser = server.server().userId;
        $scope.imgHost = server.server().imgHost;
        $scope.localhostimg = $rootScope.localhostimg;
        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
        //获取当前对应的合同的id
        var defaultImg = '/file.jpg';//默认图片的地址
        var defaultSound = '';//声音的默认地址
        var defaultVido = '';//视频的默认地址
        $scope.visibleOne = false;//可显示
        $scope.visibleTwo = false;//可显示
        $scope.visibleThree = false;//可显示
        $scope.toggle = function () {
            $scope.visible = !$scope.visible;
        }
        //获取数据
        server.server().showComcheckFalsedo({
            propertyId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {
                if (data.data.illegalInfoList === null) {
                    $scope.visiible = true;
                } else {
                    $scope.illegalInfoList = data.data.illegalInfoList;

                    // var objsOnes = data.data.illOne;
                    // var objsTwo = data.data.illTwo;
                    // var objsThree = data.data.illThree;
                    // $scope.rowOne = objsOnes;//第一个节点
                    // $scope.rowTwo = objsTwo;//第二个节点
                    // $scope.rowThree = objsThree;//第三个节点
                    // if (objsOnes != null) {
                    //     $scope.imagesOne = objsOnes.imageUrl;//图片地址
                    //     $scope.soundOne = objsOnes.soundUrl;//音频地址
                    //     $scope.vidoOne = objsOnes.vidoUrl;//视频地址
                    //     $scope.userVidoOne = (objsOnes.userImage == null ? defaultImg : objsOnes.userImage)//图片
                    // } else {
                    //     $scope.visibleOne = true;//不可显示
                    // }
                    // if (objsTwo != null) {
                    //     $scope.imagesTwo = objsTwo.imageUrl;//图片地址
                    //     $scope.soundTwo = objsOnes.soundUrl;//音频地址
                    //     $scope.vidoTwo = objsOnes.vidoUrl;//视频地址
                    //     $scope.userImageTwo = (objsTwo.userImage == null ? defaultImg : objsTwo.userImage );
                    // } else {
                    //     $scope.visibleTwo = true;//不可显示
                    // }
                    // if (objsThree != null) {
                    //     $scope.imagesThree = objsThree.imageUrl;//图片地址
                    //     $scope.soundThree = objsOnes.soundUrl;//音频地址
                    //     $scope.vidoThree = objsOnes.vidoUrl;//视频地址
                    //     $scope.userImageThree = (objsThree.userImage == null ? defaultImg : objsThree.userImage );
                    // } else {
                    //     $scope.visibleThree = true;//不可显示
                    // }
                }
            }
            $scope.$apply();
        }, function (data) {
            alert(data);
        });
    }])
    //基本信息
    .controller('compactbasicCtrl', ['$http', '$scope', 'server', '$state', 'dict','$rootScope', function ($http, $scope, server, $state, dict,$rootScope) {
        
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;





        
        $scope.imgHost = server.server().imgHost;
        var cause = '';
        var type = '';
        $scope.no = '/';
        $scope.type = {
            number: 1

        };
        $scope.templateList=[];


        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }

        //后合同模板列表
        function compactdatalist(){
            server.server().compactdatalist({
                pactId:$scope.pactId
            },function (data) {
                if(data.result){
                    $scope.templateList=data.data;
                    $rootScope.pactInfocontent = $scope.templateList.content;
                    $scope.agreementList = data.data.agreementList
                    if($scope.templateList.status=='1'){
                        $scope.templateList.name = '查看'+$scope.templateList.name+'合同审批';
                    }else{
                        $scope.templateList.name = '查看'+$scope.templateList.name+'合同审批';
                    }
                    $scope.pactModeId = data.data.pactModeId;
                    $scope.link = server.server().host+'pactinfo/examineDownloadPact.do'+'?pactModeId='+$scope.pactModeId+'&userId='+server.server().userId+'&type=2'+'&status=1'
                    $scope.link2 = server.server().host+'pactinfo/examineDownloadPact.do'+'?pactModeId='+$scope.pactModeId+'&userId='+server.server().userId+'&type=1'+'&status=1'
                    console.log($scope.pactModeId)
                    $scope.$apply();
                }else {
                    console.log('没有合同模板');
                }
            });
        }
        compactdatalist();

        $scope.linkchilds = function(id){
            $scope.linkchild = server.server().host+'pactinfo/examineDownloadPact.do'+'?pactModeId='+id+'&userId='+server.server().userId+'&type=2'+'&status=2'
            $scope.linkchild2 = server.server().host+'pactinfo/examineDownloadPact.do'+'?pactModeId='+id+'&userId='+server.server().userId+'&type=1'+'&status=2'
            // server.server().zjpactattachmentfindByIddo({
            //     id:id
            // },function (data) {
            //     if(data.result){
            //         $scope.templateList=data.data;
            //         $scope.pactModeId = data.data.pactModeId;
            //         $scope.linkchild = server.server().host+'pactinfo/examineDownloadPact.do'+'?pactModeId='+$scope.pactModeId+'&userId='+server.server().userId+'&type=2'+'&status=2'
            //         $scope.link2 = server.server().host+'pactinfo/examineDownloadPact.do'+'?pactModeId='+$scope.pactModeId+'&userId='+server.server().userId+'&type=1'+'&status=2'
                    
            //         $scope.$apply();
            //     }else {
            //         console.log('没有合同模板');
            //     }
            // });
        }
        
        //下载
        // $scope.templateSubmit=function (flag) {
        //         if($scope.templateList.url){
        //             var useHost = server.server().imgHost;
        //             var host =useHost + $scope.templateList.url;
        //             $scope.link = host;
        //             if(flag=='1'){
        //                 window.open($state.href('pactInfo',{pactId:$scope.pactId,flag:1}));
        //             }
        //         }else{
        //             alert('没有合同信息');
        //         }
        // };
        // server.server().zjpactinfoexamineDownloadPactdo({
        //     pactModeId:$scope.pactId,
        //     userId:$server.server().userId,
        //     type:2
        // },function (data) {
        //     if(data.result){
        //         // $scope.content=data.data.content;
        //         console.log(data.data)
        //         $scope.$apply();
        //     }else {
        //         alert(data.message);
        //     }
        // });
        
        // 查看合同审批
        $scope.looksee = function(){
            window.open($state.href('pactInfo',{pactId:$scope.pactModeId,flag:1}));
        }

        $scope.deletehetong=function(){
            confirm('确认删除合同吗？',function(){
                server.server().pactinfodeleteByPath({
                    pactId:$scope.pactId
                },function (data) {
                    if(data.result){
                        confirm(data.message,function(){
                            $state.go('compactmanagement',{projectid:$scope.projectId});
                        })
                        
                    }else {
                        alert(data.message);
                    }
                })
            })
            
        }

        server.server().zjroomessentialInformationdo({
            roomId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {
                //业权人
                $scope.ownership = data.data.ownership;
                // 右上和右下两块
                $scope.room = data.data.room;
                $scope.room.createTime = dict.timeConverter($scope.room.createTime);
                $scope.room.updateTime = dict.timeConverter($scope.room.updateTime);
                //物业
                if(data.data.surveyData){
                    $scope.grossArea = data.data.surveyData.grossArea;
                    $scope.areaOfBase = data.data.surveyData.areaOfBase;
                    // 数组来着
                    $scope.single = data.data.surveyData.single;
                    $scope.survey = data.data.surveyData.survey;
                }
                $scope.$apply();
            } else {
                alert(data.message)
            }
        }, function (err) {
            alert(err)
        })
        // 补偿
        server.server().zjbasicCompensateInfodo({
            propertyId: $scope.propertyId,
            cause: cause
        }, function (data) {
            if (data.result === true) {
                $scope.monthlyInterimCompensate = data.data.monthlyInterimCompensate;
                $scope.totalMoneyCompensate = data.data.totalMoneyCompensate;

                $scope.compensateItemList = data.data.compensateItemList;
                $scope.builtInAreaList = data.data.builtInAreaList;
                $scope.$apply();
            } else {
                alert(data.message)
            }
        }, function (err) {
            alert(err)
        })

        //物业查找签约阶段公共接口
        // 补偿
        server.server().zjpropertystagelistdo({
            roomId: $scope.propertyId,
            type: type
        }, function (data) {
            if (data.result === true) {
                $scope.signList = data.data;
                $scope.$apply();
            } else {
                alert(data.message)
            }
        }, function (err) {
            alert(err)
        })
    }])
    //合同详情
    .controller('compactdetailCtrl', ['$http', '$scope', 'server', "$state", 'dict','$rootScope', function ($http, $scope, server, $state, dict,$rootScope) {
        $scope.imgHost=server.server().imgHost;

        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;
        $scope.headImg = server.server().headImg;


        // 视频地址
        $scope.trustSrc = function(url){
            return $sce.trustAsResourceUrl($scope.imgHost+url);
        }

        $scope.localhostimg = $rootScope.localhostimg;
        //上面加载物业的信息
        var createUser = server.server().userId;

        //关注
        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
        //加载各种回复和通知
        server.server().informationDetail({
            typeValue: 2,
            dataId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {

                if (data.data === null) {
                    console.log(data.data)
                    $scope.disVisible = true;
                } else {
                    $scope.data = data.data;
                    $scope.disVisible = false;
                }
            } else {
                $scope.disVisible = true;
            }

        }, function (data) {
        })
        //右侧-基本信息
        /* var roomId = "47518e0d3278404eb095f6bd30046c0e";
         var projectId = "261e554de2f3493ebed1e4b6567818d1";
         var propertyId = "47518e0d3278404eb095f6bd30046c0e"
         var cause = "空地";*/
        server.server().basicInformation({
            roomId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {
                $scope.fuJianList=data.data;
                $scope.informations = data.data.surveyCount;
                // console.log($scope.informations);//
                $scope.$apply();

            } else {

                alert(data.message);
            }
        }, function (err) {

        });
        //右侧-补偿信息
        server.server().basicCompensate({
            propertyId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {
                $scope.compensates = data.data;
                $scope.compensateItemList = data.data.compensateItemList;
                $scope.builtInAreaList = data.data.builtInAreaList;
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        //右侧-签约进度
        server.server().signList({
            roomId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {
                $scope.signList = data.data;
                // console.log($scope.signList);
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {
            alert(err);
        });
    }])
    //支付方案
    .controller('compactPayCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;


        var pactId = $scope.pactId;//方便起见暂时没有加合同的id
        var flag = false;
        //做拦截操作 只更新当前为支付的方案
        $scope.func = function (event) {
            return event.status > 0
        }
        //分页配置
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 4, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        //第二个支付记录分页配置
        $scope.conf2 = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 4, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
        //页面数据初始化
        compactList($scope.conf.currentPage,$scope.conf.itemPageLimit,'');
        compactList($scope.conf.currentPage,$scope.conf.itemPageLimit,1);
        //设置事件的监听
        $scope.$watch('conf.currentPage + conf.itemPageLimit', function (news) {
            //获取当前合同的支付方案的数据
            compactList($scope.conf.currentPage,$scope.conf.itemPageLimit,'');

        })
        //设置事件的监听
        $scope.$watch('conf2.currentPage + conf2.itemPageLimit', function (news) {
            //获取当前合同的支付方案的数据
            compactList($scope.conf2.currentPage,$scope.conf2.itemPageLimit,1);

        })
        function compactList(currentPage,itemPageLimit,status){
            server.server().lajpactPayLoadListdo({
                propertyId: $scope.propertyId,
                pageNo:currentPage,
                pageSize: itemPageLimit,
                status:status,
                type:''
            }, function (data) {
                if (data.result === true) {
                    if(status==''){
                        // 定义一个数组
                        $scope.rowsPlan = data.data.rows;
                        //判断支付类型给自定义payment赋值
                        for(var i=0;i<$scope.rowsPlan.length;i++) {
                            if ($scope.rowsPlan[i].paymentStatus == 0) {
                                $scope.rowsPlan[i].payment = '未支付';
                            } else if ($scope.rowsPlan[i].paymentStatus == 1) {
                                $scope.rowsPlan[i].payment = '已支付';
                            } else if ($scope.rowsPlan[i].paymentStatus == 2) {
                                $scope.rowsPlan[i].payment = '截留';
                            } else if ($scope.rowsPlan[i].paymentStatus == 3) {
                                $scope.rowsPlan[i].payment = '未收款';
                            } else if ($scope.rowsPlan[i].paymentStatus == 3) {
                                $scope.rowsPlan[i].payment = '已收款';
                            }
                        }
                        //多少页
                        $scope.conf.total = data.data.pageCount;
                        //共有多少条数据
                        $scope.conf.counts = data.data.total;
                        $scope.$broadcast("categoryLoaded");
                    }else{
                        // 定义一个数组
                        $scope.rowsRecorde = data.data.rows;
                        //判断支付类型给自定义payment赋值
                        for(var i=0;i<$scope.rowsRecorde.length;i++) {
                            if ($scope.rowsRecorde[i].paymentStatus == 0) {
                                $scope.rowsRecorde[i].payment = '未支付';
                            } else if ($scope.rowsRecorde[i].paymentStatus == 1) {
                                $scope.rowsRecorde[i].payment = '已支付';
                            } else if ($scope.rowsRecorde[i].paymentStatus == 2) {
                                $scope.rowsRecorde[i].payment = '截留';
                            } else if ($scope.rowsRecorde[i].paymentStatus == 3) {
                                $scope.rowsRecorde[i].payment = '未收款';
                            } else if ($scope.rowsRecorde[i].paymentStatus == 3) {
                                $scope.rowsRecorde[i].payment = '已收款';
                            }
                        }
                        //多少页
                        $scope.conf2.total = data.data.pageCount;
                        //共有多少条数据
                        $scope.conf2.counts = data.data.total;
                        $scope.$broadcast("categoryLoaded2");
                    }
                    $scope.$apply();

                }

            }, function (data) {
                alert(data)
            });
        }


    }])
    //业权人
    .controller('compactpageholderCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {

        
        $scope.no = '-';
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;



        var createUser = server.server().userId;

        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }

        var get2 = function () {
            var p = new Promise((resolve, reject) => {
                // 物业数据
                server.server().zjownershipqueryOwnerAndRecievedo({
                    holderId: $scope.roomId
                }, data => {
                    if (data.result === true) {
                        $scope.data = data.data;
                        if ($scope.data) {
                            $scope.data.forEach(function (item, i) {
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

                        $scope.$apply();
                        resolve($scope.data)
                    } else {
                        reject(data.message)
                    }
                })
            })
            return p;
        }

        Promise
            .all([ get2()])
            .then(results => {
                console.log(results);
            }, err => {
                console.log(err)
            });


        //关系图谱数据
        $scope.usedata = [];
        $scope.links = [];
        $scope.uhshifts = {
            relationShip: '业权人',
            relationPersion: ''
        }
        //业权人关系图谱
        $scope.editInformation = function (id, indx) {
            server.server().zjownershipqueryOwnerRelationShipdo({
                // id:'4832c7bbcec740b0a51b3a0118338bf',
                id: id
            }, function (data) {
                if (data.result === true) {
                    $scope.relationdata = data.data;
                    $scope.relation = data.data.relation;
                    $scope.uhshifts.relationPersion = $scope.relationdata.holderName;

                    $scope.relation.unshift($scope.uhshifts)
                    for (var i = 0; i < $scope.relation.length; i++) {
                        //多少位
                        $scope.usedata[i] = {
                            name: $scope.relation[i].relationPersion,
                            category: i === 0 ? 0 : 1,
                            draggable: true
                        };
                        //关系
                        $scope.links[i] = {
                            source: 0,
                            target: (i + 1),
                            category: 0,
                            value: $scope.relation[i].relationShip
                        }
                    }

                    echart($scope.usedata, $scope.links)
                } else {
                    alert(data.message)
                }
            }, function (err) {
                alert(err)
            })
        }

        //联系人关系图谱
        $scope.makecoll = function (id, indx) {
            server.server().zjmakecollectionsqueryRelationShipdo({
                // id:'4832c7bbcec740b0a51b3a0118338bf',
                id: id
            }, function (data) {
                if (data.result === true) {
                    $scope.relationdata = data.data;
                    console.log($scope.relationdata)
                    $scope.relation = data.data.relation;
                    $scope.uhshifts.relationPersion = $scope.relationdata.holderName;

                    $scope.relation.unshift($scope.uhshifts)
                    for (var i = 0; i < $scope.relation.length; i++) {
                        //多少位
                        $scope.usedata[i] = {
                            name: $scope.relation[i].relationPersion,
                            category: i === 0 ? 0 : 1,
                            draggable: true
                        };
                        //关系
                        $scope.links[i] = {
                            source: 0,
                            target: (i + 1),
                            category: 0,
                            value: $scope.relation[i].relationShip
                        }
                    }

                    echart($scope.usedata, $scope.links)
                } else {
                    alert(data.message)
                }
            }, function (err) {
                alert(err)
            })
        }


        var myChart = echarts.init(document.getElementById('main'));


        function echart(usedata, links) {

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
                    data: ["家人", "朋友", '亲戚']
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

    }])
    //佣金方案
    .controller('commissionSchemeCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;

        var createUser = server.server().userId;

        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
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
        ];
        //分页
        $scope.no = '/';
        $scope.conf = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 4, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.conf2 = {
            total: 10,  //共多少页
            currentPage: 1,  //默认第一页
            itemPageLimit: 4, //一页多少条
            isSelectPage: false,
            isLinkPage: false
        }
        $scope.$watch('conf.currentPage + conf.itemPageLimit', function () {
            commissioninit($scope.conf.currentPage,$scope.conf.itemPageLimit);

        })
        $scope.$watch('conf2.currentPage + conf2.itemPageLimit', function () {
            paycommissionlist($scope.conf2.currentPage,$scope.conf2.itemPageLimit);

        })
        // $scope.list='';
        //封装成函数，以便各个调用，顺便将接口调用放进去，可以实时根据筛选的条件来筛选出结果
        function commissioninit(currentPage,itemPageLimit){
            //console.log(selected,payselected)
            server.server().commissionlist({
                propertyId:$scope.propertyId,
                projectId:'',
                pageNo: currentPage,
                pageSize: itemPageLimit,
                searchKeys:'',//搜索条件
                status:'',//佣金类型
                paymentStatus:'',//付款状态
                type:'',//1最近7天  2最近一个月
                beginTime:'',
                endTime:'',
                exportType:'',//是否导出
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
        //支付列表-佣金
        function paycommissionlist(currentPage,itemPageLimit){
            server.server().paycommissiondatalist({
                propertyId:$scope.propertyId,
                projectId:'',
                pageNo:currentPage,
                pageSize:itemPageLimit,
                status:'',
                exportType:''
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
                    $scope.conf2.total = data.data.pageCount;

                    // $scope.conf.total = data.data.total/data.data.pageSize;
                    //共有多少条数据
                    $scope.conf2.counts = data.data.total;
                    $scope.$apply();
                    $scope.$broadcast("categoryLoaded2");
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }

    }])
    //测绘信息
    .controller('comsurveyinginfoCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;

        $scope.no = '/';
        $scope.hostname=server.server().imgHost;
        var createUser = server.server().userId

        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$state.params.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
        //项目信息
        server.server().surveyingInformationById({
            roomId: $scope.propertyId
        }, function (data) {
            if (data.result === true) {
                if(data.data){
                    if(data.data){
                        $scope.surveyInfo = data.data;
                        $scope.singleList = data.data.singleList;
                        $scope.surveyList = data.data.surveyList;
                        $scope.housesImg = data.data.housesImg;
                        var arr = [];
                        var arr2 = [];
                        var arr3 = [];
                        for (var i = 0; i < $scope.surveyList.length; i++) {
                            if ($scope.surveyList[i].compensateName == '擅改商业') {
                                arr.push($scope.surveyList[i]);

                            } else if ($scope.surveyList[i].compensateName == '查违信息') {
                                arr2.push($scope.surveyList[i]);
                            } else if ($scope.surveyList[i].compensateName == '临时建筑物') {
                                arr3.push($scope.surveyList[i]);
                                console.log(arr3);
                            }
                        }
                        $scope.arr = arr;
                        $scope.arr2 = arr2;
                        $scope.arr3 = arr3;
                        // $scope.arr2=arr2;
                        // if(arr3[].length != 0){
                        //     $scope.arr3 = arr3;
                        // }
                    }

                }

                $scope.$apply();

            } else {
                alert(data.message)
            }
        }, function () {
            alert('404请求失败')
        });
        //右侧测绘进度
        server.server().surveyingList({
            roomId: $scope.propertyId,
            type: 2
        }, function (data) {
            if (data.result === true) {
                $scope.surveyingList = data.data;
                console.log($scope.surveyingList);
                // console.log($scope.signList);
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }])
    //关联订单
    .controller('linkorderCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;
        var createUser = server.server().userId;

        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$scope.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }

        setData();
        function setData() {
            server.server().zjrelatedlistdo({
                roomId:$scope.propertyId
            },function(data){
                if(data.result===true){
                    $scope.data = data.data;
                    $scope.$apply();
                }else{
                    alert(data.message)
                }
            },function(err){
                alert(err)
            });
        }


    }])
    //  附件
    .controller('compactappendixCtrl', ['$http', '$scope', 'server', '$state', 'dict', function ($http, $scope, server, $state, dict) {
        $scope.pactId=$state.params.pacteId;
        $scope.propertyId = $state.params.propertyId;//$state.params.propertyId;//物业的id
        $scope.projectId = $state.params.projectId;//
        $scope.roomId = $scope.propertyId;
        $scope.approveId = $state.params.approveId;
        $scope.pnumber = $state.params.number;
        $scope.pflag = $state.params.flag;
        $scope.pstatus = $state.params.status;
        $scope.pupdateStatus = $state.params.updateStatus;
        var host = server.server().host;
        //var hostname=
        var createUser = server.server().userId;
        $scope.imghost = server.server().imgHost;
        console.log( $scope.imghost)
        $scope.list = {
            roomId:$scope.roomId,
            projectId:$state.params.propertyId,
            createUser:server.server().userId,
            toUserId:server.server().userId,
            type:3,   //1转移   2分享   3关注
            status:2 //类型 1 项目 2物业
        }
        $scope.listtop={
            roomId:$state.params.propertyId,
            projectId:$scope.projectId,
            paciId:$scope.pactId,
            createUser:server.server().userId,
            imgHost:server.server().imgHost
        }
        //附件列表
        // var ownership=[],card=[],pro=[],other=[];
        function filelist(){
            server.server().enclorurelist({
                propertyId: $scope.roomId,
            }, function (data) {
                if (data.result === true) {
                    $scope.list = data.data;
                    var length = 0;
                    for (var key in $scope.list) {
                        length += $scope.list[key].propertyAttachments.length;
                    }
                    $scope.length = length;
                    $scope.$apply();
                } else {
                    alert(data.message)
                }
            }, function () {
                alert('404请求失败')
            })
        };
        filelist();


        //添加附件
        $scope.addannex=function(files,type){
            var fd = new FormData();
            var file=files[0];
            $scope.filename = file.name;
            fd.append('multipartFile', file);
            $http({
                method: 'POST',
                url: host+"attachment/fielUpload.do",
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function successCallback(response) {
                // 请求成功执行代码
                $scope.data = response.data.data;
                $scope.fileName = $scope.data.fileName;
                $scope.filePath = $scope.data.filePath;
                $scope.size = $scope.data.size;
                var attachment={
                    filePath:$scope.filePath,
                    fileName:$scope.fileName
                }
                server.server().enclosursave({
                    attachment: JSON.stringify(attachment),
                    propertyId: $scope.roomId,
                    createUser: createUser,
                    type: type
                }, function (data) {
                    if (data.result === true) {
                        alert(data.message, function () {
                            filelist();
                        });
                        $scope.$apply();

                    } else {
                        alert(data.message);
                    }
                }, function (err) {

                });
            })
        }

        //附件下载
        $scope.downenclosure = function (id) {

            var hostURL = host + 'propertyAttachment/attachmentDownload.do'
            $scope.link = hostURL + '?id=' + id;
        }
        //附件删除
        $scope.deleteenclosure = function (id) {
            server.server().deleteenclosure({
                id: id
            }, function (data) {
                if (data.result === true) {
                    alert(data.message, function () {
                        filelist();
                    });
                    $scope.data = data.message;


                    $scope.$apply();

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        }
    }])


