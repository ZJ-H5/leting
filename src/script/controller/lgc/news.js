
angular.module('app').controller('newsCtrl', ['$http', '$scope', 'dict', 'server', '$rootScope', function ($http, $scope, dict, server, $rootScope, $rootscope) {
    $scope.mobile = '';
    var errorText = '404请求失败';
    // $scope.imgHost=
    $scope.newsList = [];
    $scope.page = 1;
    $scope.pageFlag = true;
    let s=server.server().imgHost;
    $scope.imgHost=s.substring(0,s.length-1);
    var userId=server.server().userId;
    let loginHost = server.server().loginHost;
    var storage=window.localStorage;
    $scope.login = function () {
        storage.setItem('flagindex',1);
        document.location = loginHost;
    }
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
    //新闻数据
    setDate();

    function setDate() {
        server.server().lgcMainInfoNews({pageNo: $scope.page, pageSize: 7}, function (data) {
                if (data.result) {
                    var _data = data.data;
                    if(_data.rows.length==0){
                        $scope.pageFlag = false;
                    }
                    if (_data.pageCount == $scope.page) {
                        $scope.pageFlag = false;
                    }
                    for (var item of _data.rows) {
                        $scope.newsList.push(item);
                    }
                    console.log($scope.newsList)
                } else {
                    alert(data.message);
                }
                $scope.$apply();
            },
            function () {
                alert(errorText);
            });
    }

    //加载更多
    $scope.addPage = function () {
        if ($scope.pageFlag) {
            $scope.page++;
            setDate();
        }
    };
}])
// 品牌荣誉
angular.module('app').controller('BrandawardsCtrl', ['$http', '$scope', 'dict', 'server', '$rootScope', function ($http, $scope, dict, server, $rootScope, $rootscope) {
    $scope.mobile = '';
    var errorText = '404请求失败';
    // $scope.imgHost=
    $scope.newsList = [];
    $scope.page = 1;
    $scope.pageFlag = true;
    let s=server.server().imgHost;
    $scope.imgHost=s.substring(0,s.length-1);
    var userId=server.server().userId;
    let loginHost = server.server().loginHost;
    $scope.login = function () {
        document.location = loginHost;
    }
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
    //新闻数据
    setDate();

    function setDate() {
        

        server.server().lgcMainInfoTarget({},function (data) {
            if (data.result) {
                var _data = data.data;
                for (var item of _data) {
                    $scope.newsList.push(item);
                }
                if(_data.length==0){
                    $scope.pageFlag = false;
                }
                if (_data.pageCount == $scope.page) {
                    $scope.pageFlag = false;
                }
                
                
                
                $scope.$apply();
            }
        },
        function () {
            // $rootscope.showTips(errorText);
        });
    }

    //加载更多
    $scope.addPage = function () {
        if ($scope.pageFlag) {
            $scope.page++;
            setDate();
        }
    };
}])
//政策法规
.controller('lawsCtrl', ['$http', '$scope', 'dict', 'server', '$rootScope', function ($http, $scope, dict, server, $rootScope) {
        // $scope.mobile = '';
        $scope.lawsTypeList = [];
        $scope.lawsInfoList = [];
        $scope.isType = 0;
        $scope.detailFlag = true;
        $scope.isLaws = {};
        var errorText = '404请求失败';
        var userId=server.server().userId;
        let loginHost = server.server().loginHost;
        var storage=window.localStorage;
        $scope.login = function () {
            storage.setItem('flagindex',1);
            document.location = loginHost;
        }
        $scope.imgHost = server.server().imgHost;
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
        //政策法规类型
        server.server().lgcMainInfoPolicyTypes({}, function (data) {
                console.log(data);
                if (data.result) {
                    $scope.lawsTypeList = data.data;
                    $scope.$apply();
                    console.log($scope.lawsTypeList[0].id);
                    $scope.searDate($scope.lawsTypeList[0].id, 0);
                } else {
                    alert(data.message);
                }
            },
            function () {
                alert(errorText);
            });
        $scope.searDate = function (id, index) {
            //根据类型查询数据
            $scope.detailFlag = true;
            $scope.isType = index;
            server.server().lgcMainInfoPolicyLaws({typeId: id}, function (data) {
                    console.log(data);
                    if (data.result) {
                        $scope.lawsInfoList = data.data;
                        $scope.$apply();
                    } else {
                        alert(data.message);
                    }
                },
                function () {
                    alert(errorText);
                });
        };
        $scope.showDetail = function (item) {
            $scope.isLaws = item;
            $scope.detailFlag = false;
            $scope.imgUrl = item.imgUrl;
            $scope.title = item.title;
        }
    }])
    //代表项目
.controller('showProjectCtrl', ['$http', '$scope', 'dict', 'server', '$rootScope', function ($http, $scope, dict, server, $rootScope, $rootscope) {
        $scope.mobile = '';
        $scope.projectList = [];
        $scope.page = 1;
        $scope.pageFlag = true;
        $scope.imgHost=server.server().imgHost;
        var errorText = '404请求失败';
        var userId=server.server().userId;
        let loginHost = server.server().loginHost;
        $scope.login = function () {
            document.location = loginHost;
        }
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
        //咨询热线
        server.server().lgcMainInfoHotline({}, function (data) {
                $scope.mobile = data.data[0].mobile;
                $scope.$apply();
            },
            function () {
                alert(errorText);
            });
        //代表项目数据
        setDate();

        function setDate() {
            server.server().lgcMainInfoManages({pageNo: $scope.page, pageSize: 5}, function (data) {
                    var _data = data.data;
                    if(_data.rows.length==0){
                        $scope.pageFlag = false;
                    }
                    if (_data.pageCount == $scope.page) {
                        $scope.pageFlag = false;
                    }
                    for (var item of _data.rows) {
                        $scope.projectList.push(item);
                    }
                    console.log($scope.projectList);
                    $scope.$apply();
                },
                function () {
                    alert(errorText);
                });
        }

        //加载更多
        $scope.addPage = function () {
            if ($scope.pageFlag) {
                $scope.page++;
                setDate();
            }
        };
    }])
    //代表项目详情
.controller('showProjectDetailCtrl', ['$http', '$scope', 'dict', 'server', '$rootScope', '$state', function ($http, $scope, dict, server, $rootScope, $state, $rootscope) {
        $scope.mobile = '';
        $scope.project = {};
        $scope.id = $state.params.id;
        var errorText = '404请求失败';
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
            // 改---改成了品牌介绍的详情
            //代表项目数
            // server.server().lgcMainInfoManages({}, function (data) {
            //         for (var t of data.data.rows) {
            //             if (t.id == $scope.id) {
            //                 $scope.newsList = t;
            //                 $scope.$apply();
            //             }
            //         }
            //         $scope.$apply();
            //     },
            //     function () {
            //         alert(errorText);
            //     });

        // 我在这呢
        server.server().zjpagemanagefindPageManageByIddo({
            id:$scope.id
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