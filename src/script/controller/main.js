'use strict';
angular.module('app').controller('mainCtrl', ['$http', '$scope','server','$rootScope','$cookieStore','server','$state', function($http, $scope,$rootScope,$rootscope,$cookieStore,server,$state){

    
    let loginHost = server.server().loginHost;
    var userIds = $cookieStore.get("userId");
    var storage=window.localStorage;
    $scope.login = function () {
        if(userIds){
            storage.setItem('flagindex',1);
            $state.go('myJob')
            
        }else{
            document.location = loginHost
        }
    }

    

    if(userIds){
        //用户名和用户头像放
        server.server().zjmUserImg({
            userId:userIds
        },function (data) {
            if(data.result){
                $scope.nickname=data.data.nickname;//昵称
                $scope.realname=data.data.realname;//真实名字
                $scope.photoUrl=data.data.photoUrl;//用户头像

                $scope.$apply();
            }else {
                alert(data.message);
            }
        })
    }
    let s=server.server().imgHost;
    $scope.imgHost=s.substring(0,s.length-1);
    // var errorText='404请求失败';
    $scope.location=[];
    $scope.idea={};
    $scope.mobile='';
    $scope.isMuinfoList=[];
    
   

    server.server().lgcMainInfoConcept({},function (data) {
            $scope.idea=data.data[0];

            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
    // 首页几个字的，恶心哪
    server.server().zjcolumnqueryColumndo({},function (data) {
        $scope.indexwordarr = data.data;
        $scope.indexwordarr.forEach(function(item,index){
            // "columnNo": 2, // 1品牌介绍  2品牌简介 3 品牌荣誉 4 代表项目
            if(item.columnNo==1){
                $scope.brandintroduced = item.name
            }
            if(item.columnNo==2){
                $scope.brandintrodjian = item.name
            }
        })
        $scope.$apply();
    },
    function () {
        // $rootscope.showTips(errorText);
    });
    // 品牌荣誉
    server.server().lgcMainInfoTarget({},function (data) {
            console.log(data);
            $scope.isMuinfoList=data.data;
            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });

    server.server().lgcMainInfoPositioning({},function (data) {
            $scope.location=data.data;
            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
    server.server().lgcMainInfoHotline({},function (data) {
            if(data.result){
                if(data.data[0]){
                    $scope.mobile=data.data[0].mobile;
                    $scope.$apply();
                }
            }else {
                alert(data.message);
            }
        },
        function () {
            // $rootscope.showTips(errorText);
        });
}])

// 战略目标 品牌介绍
angular.module('app').controller('objectiveCtrl', ['$http', '$scope','server','$rootScope','$cookieStore','server','$state','$compile', function($http, $scope,$rootScope,$rootscope,$cookieStore,server,$state,$compile){
    let loginHost = server.server().loginHost;
    var userIds = $cookieStore.get("userId");
    var storage=window.localStorage;
    $scope.login = function () {
        if(userIds){
            storage.setItem('flagindex',1);
            $state.go('myJob')
        }else{
            document.location = loginHost
        }

        
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
    if(userIds){
        //用户名和用户头像放
        server.server().zjmUserImg({
            userId:userIds
        },function (data) {
            if(data.result){
                $scope.nickname=data.data.nickname;//昵称
                $scope.realname=data.data.realname;//真实名字
                $scope.photoUrl=data.data.photoUrl;//用户头像

                $scope.$apply();
            }else {
                alert(data.message);
            }
        })
    }
    let s=server.server().imgHost;
    $scope.imgHost=s.substring(0,s.length-1);
    // var errorText='404请求失败';
    $scope.location=[];
    $scope.idea={};
    $scope.mobile='';
    $scope.isMuinfoList=[];


   
   
    $scope.urself=function(id){
        $state.go('showProjectDetail',{id:$scope.isMuinfoList[id].id})
    }

    
    
   

    //战略目标   
    server.server().lgcMainInfoTarget({},function (data) {
            $scope.isMuinfoList=data.data;
            // console.log($scope.isMuinfoList)
            setTimeout(function(){
                var swiper = new Swiper('.swiper-container', {
                    pagination: {
                      el: '.swiper-pagination',
                      type: 'fraction',
                    },
                    navigation: {
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    },
                    autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: true,
                    }
                    // autoplay: 3000,//可选选项，自动滑动
    
                  });
            },20)
            
            console.log($scope.isMuinfoList)
            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
        server.server().lgcMainInfoConcept({},function (data) {
            $scope.idea=data.data[0];

            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
        $scope.flag = 1;
    //    轮播图
    function lunajax(flag){
        server.server().lgcMainInfoPositioning({
            pageNo:flag,
            pageSize:4
        },function (data) {
            $scope.location=data.data.rows;
            console.log(data.data.rows)
            $scope.pagecontent = data.data.pageCount;
            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
    }
    lunajax($scope.flag)
        
    //     $scope.leftclick = function(){
    //         $scope.flag--;
    //         if($scope.flag<=0){
    //             $scope.flag = 1;
    //             return;
    //         }
    //         lunajax($scope.flag)
    //         console.log(111)
    //     }
    //     $scope.rightclick = function(){
    //         $scope.flag++
    //         if($scope.flag>$scope.pagecontent){
    //             $scope.flag = $scope.pagecontent;
    //             return;
    //         }
    //         lunajax($scope.flag)
    //         console.log(22)
    //     }

    

    server.server().lgcMainInfoHotline({},function (data) {
            if(data.result){
                if(data.data[0]){
                    $scope.mobile=data.data[0].mobile;
                    $scope.$apply();
                }
            }else {
                alert(data.message);
            }
        },
        function () {
            // $rootscope.showTips(errorText);
        });

        
    
    
}])
// 战略定位 去掉了
angular.module('app').controller('positioningCtrl', ['$http', '$scope','server','$rootScope','$cookieStore','server','$state', function($http, $scope,$rootScope,$rootscope,$cookieStore,server,$state){
    let loginHost = server.server().loginHost;
    var userIds = $cookieStore.get("userId");
    $scope.login = function () {
        if(userIds){
            $state.go('myJob')
        }else{
            document.location = loginHost
        }

        
    }
    if(userIds){
        //用户名和用户头像放
        server.server().zjmUserImg({
            userId:userIds
        },function (data) {
            if(data.result){
                $scope.nickname=data.data.nickname;//昵称
                $scope.realname=data.data.realname;//真实名字
                $scope.photoUrl=data.data.photoUrl;//用户头像

                $scope.$apply();
            }else {
                alert(data.message);
            }
        })
    }
    let s=server.server().imgHost;
    $scope.imgHost=s.substring(0,s.length-1);
    // var errorText='404请求失败';
    $scope.location=[];
    $scope.idea={};
    $scope.mobile='';
    $scope.isMuinfoList=[];
    
   

    server.server().lgcMainInfoConcept({},function (data) {
            $scope.idea=data.data[0];

            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
   
    server.server().lgcMainInfoPositioning({},function (data) {
            $scope.location=data.data;
            $scope.$apply();
        },
        function () {
            // $rootscope.showTips(errorText);
        });
    server.server().lgcMainInfoHotline({},function (data) {
            if(data.result){
                if(data.data[0]){
                    $scope.mobile=data.data[0].mobile;
                    $scope.$apply();
                }
            }else {
                alert(data.message);
            }
        },
        function () {
            // $rootscope.showTips(errorText);
        });

        
    
    
}])