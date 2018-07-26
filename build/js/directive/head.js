'use strict';

angular.module('app').directive('appHead', ['cache','$http','server','$state','$rootScope','$cookieStore', function(cache,$http,server,$state,$rootScope,$cookieStore){

    return {
        restrict: 'E',//调用方式
        replace: true,//是否替换

        templateUrl: 'view/template/public/head.html',
        link:function($scope) {
            var userId=server.server().userId;
            $scope.imgHost = server.server().imgHost;
            $scope.casHost = server.server().casHost;
            $scope.propertyUrl = server.server().propertyUrl;
            $scope.headImg = server.server().headImg;
            //拿项目id
            var storage=window.localStorage;
            $scope.avalue = storage.getItem('a');


            
            $scope.name=[
                {name:'首页',val:false,class:false, getItem:'',usename:'main'},
                {name:'我的工作',val:false,class:false, getItem:'',usename:'myJob'},
                {name:'项目管理',val:false,class:false, getItem:'',usename:'projectmanagement'},
                {name:'物业信息',val:false,class:false, getItem:$scope.avalue,usename:'propertyInfo',information:2},
                {name:'物业管理',val:true,class:false, getItem:$scope.avalue,usename:'totalPropertyList'},
                {name:'合同管理',val:true,class:false, getItem:$scope.avalue,usename:'compactmanagement'},
                {name:'审批管理',val:true,class:false, getItem:$scope.avalue,usename:'examine'},
                {name:'财务管理',val:true,class:false, getItem:$scope.avalue,usename:'finance'},
                {name:'物业移交',val:true,class:false, getItem:$scope.avalue,usename:'handOverProperty'},
                {name:'物业拆除',val:true,class:false, getItem:$scope.avalue,usename:'PropertyDismantle'},
                {name:'物业还建',val:true,class:false, getItem:$scope.avalue,usename:'propertyBuilt'},
                {name:'数据统计',val:true,class:false, getItem:$scope.avalue,usename:'dataSurvey'},
                {name:'知识库',val:true,class:false, getItem:$scope.avalue,usename:'knowledge'},
                {name:'系统设置',val:true,class:false, getItem:$scope.avalue,usename:'systemset'}
            ];
            // 拿颜色
            $scope.flagIndex = storage.getItem('flagindex');
            if($scope.flagIndex){
                $scope.name.forEach(function(item,i){
                    item.class = false;
                })
                $scope.name[$scope.flagIndex].class = true;
            }else{
                $scope.name.forEach(function(item,i){
                    item.class = false;
                })
                $scope.name[1].class = true;
                storage.setItem('flagindex',1);
            }

            $scope.locationTitleName=function(usename,indx){
                
                storage.setItem("b",usename);
                // $scope.name.forEach(function(item,i){
                //     item.class = false;
                // })

                storage.setItem("f",'');
                storage.setItem("j",'');
                //名字着色
                // $scope.name[indx].class=true;
                storage.setItem('flagindex',indx);
                //存储项目id
                // 物业信息
                if($scope.name[indx].val){
                // 带projectId的
                    $state.go(usename,{projectid:storage.getItem('a')});
                }else{
                    if($scope.name[indx].information==2){
                        storage.setItem('flagindex',3);
                        window.location = $scope.casHost+ $scope.propertyUrl;
                        // $state.go(usename,{projectid:storage.getItem('a')});
                    }else{
                        $state.go(usename);
                    }
                    
                }
            }

            
            $scope.exit=function(){
                document.location=server.server().loginOut;
                localStorage.removeItem('a');
                $cookieStore.remove('userId');
                storage.setItem('flagindex',1);
                
            }
            //用户名和用户头像放
            server.server().zjmUserImg({
                    userId:userId
                },function (data) {
                    if(data.result){
                        $scope.nickname=data.data.nickname?data.data.nickname:'暂未设置';//昵称
                        $scope.realname=data.data.realname?data.data.realname:'暂未设置';//真实名字
                        $scope.photoUrl=data.data.photoUrl;//用户头像
                        if(!$cookieStore.get("userId")){
                            $cookieStore.put("userId", data.data.id);
                        }
                        $scope.$apply()
                    }
                });
        }
    };
}]);