/**
 * Created by pc on 2017/10/24.
 */
//数据层级设置
angular.module('app').controller('dataHierarchyCtrl', ['$http', '$scope', 'server', '$state', function ($http, $scope, server, $state) {

    // $scope.isroom
    var isroom = 0;
    $scope.getroom = function (data) {
        if (data) {
            isroom = 1;
        } else {
            isroom = 0;
        }
    }


    var parkId = $state.params.projectid;//261e554de2f3493ebed1e4b6567818d1';
    var createUser = server.server().userId;
    $scope.searchKeys = '';//筛选
    $scope.flag = false;
    $scope.category = '';
    $scope.nameJson = [
        {shemaName: ''}
    ];
    $scope.nameJsonFlag=[false];
    //四五层在这里重新添加

    // var schemaId=$scope.sublevel.id;
    //添加层级结构
    $scope.cjsave = function () {
        $('.saveDisabled').attr('disabled','disabled');
        for(var t of $scope.nameJson){
            if(!t.shemaName){
                $('.saveDisabled').removeAttr('disabled');
                return
            }
        }
        for(let t of $scope.nameJsonFlag){
            if(t){
                $('.saveDisabled').removeAttr('disabled');
                return
            }
        }
        server.server().dataHierarchySave({
            createUser: createUser,
            isRoom: isroom,
            parkId: parkId,
            category: $scope.category,
            nameJson: JSON.stringify($scope.nameJson)
        }, function (data) {
            if (data.result === true) {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                    window.location.reload();
                })

                $scope.$apply();
            } else {
                alert(data.message,function(){$('.saveDisabled').removeAttr('disabled');});
            }
        }, function (err) {
            alert(err,function(){$('.saveDisabled').removeAttr('disabled');});
        })
    };
    $scope.nameJsonFlagFn=function (index,flag) {
        if('sublevelList'==flag){
            $scope.sublevelList.forEach(function (e,i) {
                if (i != index) {
                    if (e.shemaName == $scope.sublevelList[index].shemaName) {
                        console.log($scope.nameJsonFlag);
                        $scope.nameJsonFlag[index] = true;
                        $scope.nameJsonFlag[i] = true;
                        return
                    }else{
                        $scope.nameJsonFlag[index]=false;
                        $scope.nameJsonFlag[i]=false;
                        return
                    }

                }
            })
        }else{
                $scope.nameJson.forEach(function (e,i) {
                    if(i!=index){
                        if(e.shemaName==$scope.nameJson[index].shemaName){
                            console.log($scope.nameJsonFlag);
                            $scope.nameJsonFlag[index]=true;
                            $scope.nameJsonFlag[i]=true;
                            return
                        }else{
                            $scope.nameJsonFlag[index]=false;
                            $scope.nameJsonFlag[i]=false;
                            return
                        }
                    }
            })
        }

    };


    //层级一级结构列表
    function list(){
        server.server().dataHierarchyList({
            projectId: parkId
        }, function (data) {
            if (data.result === true) {
                var arr = data.data;
                var json = {};
                for (var i = 0; i < arr.length; i++) {
                    json[i] = arr[i];
                }
                JSON.stringify(json);
                $scope.dataList = json;
                $scope.$apply();

            } else {

                alert(data.message);
            }
        }, function (err) {

        });
    };
    list();


    //点添加显示添加栏信息
    $scope.flag = false;
    $scope.flag2 = false;
    $scope.flag3 = false;
    $scope.flag4 = false;
    $scope.flag5 = false;
    $scope.add = function (sort, index, dataList, sublevel) {
        console.log(sublevel.parentId);
        var id = sublevel.parentId;
        if (sort == '0') {
            $scope.flag = !$scope.flag;
        } else if (sort == '1') {
            $scope.flag2 = !$scope.flag2;
        } else if (sort == '2') {
            $scope.flag3 = !$scope.flag3;
        } else if (sort == '3') {
            $scope.flag4 = !$scope.flag4;
        } else if (sort == '4') {
            $scope.flag5 = !$scope.flag5;
        }
        server.server().dataInit({
            schemaId: id
        }, function (data) {
            if (data.result === true) {
                $scope.dataInit = data.data
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        console.log(index);

    }
    //层级结构二级联动
    $scope.myselect = function (id) {
        //console.log($scope.selectid);

        server.server().dataInitTwice({
            parentId: id
        }, function (data) {
            if (data.result === true) {
                $scope.dataTwice = data.data
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });

    }
    //层级结构三级联动
    $scope.myselect2 = function (id) {
        server.server().dataInitTwice({
            parentId: id
        }, function (data) {
            if (data.result === true) {
                $scope.dataThird = data.data
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
    //层级结构四层联动
    $scope.myselect3 = function (id) {
        server.server().dataInitTwice({
            parentId: id
        }, function (data) {
            if (data.result === true) {
                $scope.dataForth = data.data
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
    }
    //栋-座-层数据层级保存
    $scope.saveall = function (select, text, schemaId) {
        $('.saveDisabled').attr('disabled','disabled');
        server.server().adddata({
            parkId: parkId,
            parentId: select,
            createUser: createUser,
            objName: text,
            schemaId: schemaId
        }, function (data) {
            if (data.result === true) {
                console.log(data.message);
                alert('添加成功', function () {
                    list();
                    $('.saveDisabled').removeAttr('disabled');
                })

                $scope.$apply();
            } else {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                });
            }
        }, function (data) {
            alert(data.message,function(){
                $('.saveDisabled').removeAttr('disabled');
            });
        });

    }
    //删除功能

    $scope.delete = function (id) {
        confirm('确认删除？',function(){
            server.server().deleteDataHierarchy({
                id: id
            }, function (data) {
                if (data.result === true) {
                    alert(data.message);
                    list();
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        })

    }
    $scope.forth = false;
    $scope.five = false;
    $scope.zjm = true;
    var i = 0;
    //增加层级结构form表单里
    $scope.addlevel = function () {
            $scope.nameJson.push({shemaName:''});
            $scope.nameJsonFlag.push(false);
    }
    //取消添加
    $scope.cancel=function(){
        $scope.nameJson = [
            {shemaName: ''}
        ];
        $scope.category='';
        $scope.sublevelList=[ {shemaName: ''}];
        $scope.nameJsonFlag=[false];
    }
    //层级结构修改
    $scope.editData=function(flag,id){
        $('.'+flag).dialog();
        server.server().editDH({
            id: id//层级结构ID
        }, function (data) {
            if (data.result === true) {
                $scope.editcategory=data.data.category;//结构名称
                $scope.isRoom=data.data.isRoom==1?true:false;//是否有房号
                $scope.sublevelList=data.data.sublevelList;//子集列表
                $scope.sublevelList.forEach(function(item,i){
                    if($scope.sublevelList.length>2){
                        $scope.nameJsonFlag.push(false);
                    }

                });
                $scope.$apply();
            } else {
                alert(data.message);
            }
        }, function (err) {

        });
        $scope.dhId=id;
    }
    //层级修改保存
    $scope.cjUpdate=function(dhId){
        $('.saveDisabled').attr('disabled','disabled');
        var arr=[{id:'',shemaName:''}];
        $scope.sublevelList.forEach(function(item,i){
            arr[i]={
                id:item.id,
                shemaName:item.shemaName
            }
        })
        server.server().editSaveDH({
            id: dhId,//层级结构ID
            updateUser:createUser,
            category:$scope.editcategory,
            isRoom:$scope.isRoom?1:0,
            nameJson:JSON.stringify(arr)
        }, function (data) {
            if (data.result === true) {
                alert(data.message,function(){
                    $('.editData').hide();
                    list();
                    $('.saveDisabled').removeAttr('disabled');
                })
                $scope.$apply();
            } else {
                alert(data.message,function(){
                    $('.saveDisabled').removeAttr('disabled');
                });
            }
        }, function (data) {
            alert(data.message,function(){
                $('.saveDisabled').removeAttr('disabled');
            });
        });
    }
    //层级删除
    $scope.deleteSublevel=function(name,id){
        confirm('确认删除'+name+'?',function(){
            server.server().deleteDH({
                id: id,//层级结构ID
                userId:createUser
            }, function (data) {
                if (data.result === true) {
                    alert(data.message,function(){
                        list();
                    })
                    $scope.$apply();
                } else {
                    alert(data.message);
                }
            }, function (err) {

            });
        })
    }
}]);