/**
 * Created by pc on 2017/10/30.
 */
angular.module('app').controller('linkOrderCtrl', ['$http', '$scope', 'server', function ($http, $scope, server) {
    $scope.no = '-'
    $scope.nothingTips=false;
    $scope.roomId=$state.params.propertyId;
    $scope.propertyId=$state.params.propertyId;
    $scope.projectId= $state.params.projectid;
    var userId=server.server().userId;

    //项目信息头部共公
    server.server().zjprojectdeleteById({
        id:$scope.projectId,
        userId:userId
    },function(data){
        if(data.result===true){
            $scope.project2 = data.data.project;


            $scope.$apply();
        }else{
            alert(data.message)
        }
    })
    //已关联数据

    setData();
    function setData() {
        server.server().zjrelatedlistdo({
            roomId:$scope.roomId
        },function(data){
            if(data.result===true){
                $scope._data = data.data;
                $scope.$apply();
            }else{
                alert(data.message)
            }
        },function(err){
            alert(err)
        });
    }
    //删除
    $scope.dataDelete=function(id,indx){
        confirm('确认删除吗？',function(){
            server.server().zjrelateddeleteByIddo({
                id:id
            },function(data){
                if(data.result===true){
                    setData();
                    $scope.$apply();
                }else{
                    alert(data.message)
                }
            })
        })

    }

    //跟进
    $scope.dataFollowUp=function(id,indx){
        $scope.genjingId = id;
        //遇到问题一级
        server.server().signListProblem({}, function (data) {
            if (data.result === true) {
                $scope.signListP = data.data;
                $scope.$apply();
            } else {
                alert(data.message);
            }

        });
        //遇到问题select出二级
        $scope.myFunc = function () {
            $scope.flag = false;
            $scope.listSecondP = '';
            for (var i = 0; i < $scope.signListP.length; i++) {
                if ($scope.signListP[i].id == $scope.myselect) {
                    var arr = [];
                    arr.push($scope.signListP[i].stage);
                }
            }
            $scope.listSecondP = arr;
            if (JSON.stringify($scope.listSecondP[0]) != '[]') {
                $scope.flag = true;
            }
        };

        $('.hopbntshare2').dialog();
    }

    //跟进保存
    $scope.advice = '';
    $scope.depict = '';
    $scope.solution = '';
    $scope.addInformation=function(roomid){
        //跟进当前物业
        //增加追踪信息

        server.server().addInformation({
            typeValue: 2, //(1.表示项目跟踪 2.物业跟踪 3.测绘数据跟踪）
            dataId: $scope.roomId,  //所属项目或物业id
            orderSignType: $scope.myselect,//签约阶段父类型
            orderSignName: $scope.myselect2,//签约阶段子类型
            advice: $scope.advice,
            depict: $scope.depict,
            solution: $scope.solution,
            attachments:null,
            createUser:userId
        }, function (data) {
            if (data.result === true) {
                $('.hopbntshare2').fadeOut(200);
                alert('发布成功');
                $scope.$apply();
            } else {
                alert(data.message);
            }
        });
    }

    //搜索按钮副代表
    function zjroomsearchForConditiondo(){
        server.server().zjroomsearchForConditiondo({
            projectId:$scope.projectId
        },function(data){
            if(data.result===true){
                $scope.dataCheckbox = data.data;
                for(var i=0;i<$scope.dataCheckbox.length;i++){
                    $scope.dataCheckbox[i].state=false;
                }
                $scope.$apply();
            }else{
                alert(data.message)
            }
        })
    }

    //分页
    $scope.conf = {
        total : 10,  //共多少页
        currentPage : 1,  //默认第一页
        itemPageLimit : 10, //一页多少条
        isSelectPage : false,
        isLinkPage : false
    }
    $scope.$watch('conf.currentPage + conf.itemPageLimit' , function(news){
        zjroompropertyListdo($scope.selected.join(","),$scope.conf.currentPage)
    })
    //分页结束

    $scope.selected = [];
    $scope.selectAll = true;
    // 单选
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
        zjroompropertyListdo($scope.selected.join(","),$scope.conf.currentPage)
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
        zjroompropertyListdo($scope.selected.join(","),$scope.conf.currentPage)
    }

    //获取关联数据弹窗的
    function zjroompropertyListdo(schemaId,pageCount){
        $scope.rows=[];
        server.server().zjroompropertyListdo({
            projectId:$scope.projectId,
            schemaId:schemaId?schemaId:'', //搜索id
            pageNo:pageCount?pageCount:1,  //当前页娄
            pageSize:10
        },function(data){
            if(data.result===true){
                $scope.rows = data.data.rows;
                for(var i = 0;i<$scope.rows.length;i++){
                    $scope.rows[i].state=false;
                }
                //共多少页
                $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                //共有多少条数据
                $scope.conf.counts = data.data.total;
                $scope.$apply();
                $scope.$broadcast("categoryLoaded");
            }else{
                alert(data.message)
            }
        })
    }
    zjroompropertyListdo('',1)

    //显示弹窗
    $scope.showBox=function(){
        if($('.dialog').css('display')=='block'){
            zjroomsearchForConditiondo()
            zjroompropertyListdo()
        }
    }
    //保存成功
    function zjrelatedaddSavedo(relatedRoomId){
        server.server().zjrelatedaddSavedo({
            userId:userId,
            roomId:$scope.roomId,
            relatedRoomId:relatedRoomId
        },function(data){
            if(data.result===true){
                //保存成功
                $('.dialog').hide(200);
                setData();
                $scope.$apply();
            }else{
                alert(data.message)
            }
        })
    }
    //下面列表
    $scope.childSelected = [] ;  //压入数据
    $scope.childSelectAll=true;    //全选model
    //全选
    $scope.childCheckobxAll=function(m){
        $scope.childSelected=[];
        if(m===true){
            for(var i=0;i<$scope.rows.length;i++){
                $scope.rows[i].state=true;
                $scope.childSelected.push($scope.rows[i].id)
            }
        }else{
            for(var j=0;j<$scope.rows.length;j++){
                $scope.rows[j].state=false;
            }
            $scope.childSelected=[];
        }
        return $scope.childSelected;
    }
    //单选
    $scope.childUpdateSelection=function(eve,id,state){
        var checkbox = eve.target ;
        var checked = checkbox.checked;
        if(checked){
            $scope.childSelected.push(id) ;
        }else{
            var idx = $scope.childSelected.indexOf(id) ;
            $scope.childSelected.splice(idx,1) ;
        }
        if($scope.childSelected.length<$scope.rows.length){
            $scope.childSelectAll=false;
        }else{
            $scope.childSelectAll=true;
        }
    }

    //保存
    $scope.save=function(){
        zjrelatedaddSavedo($scope.childSelected.join(","))
    }
}])