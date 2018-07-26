/**
 * Created by pc on 2017/10/24.
 */
/**
 * Created by pc on 2017/10/23.
 */
// 物业信息列表

angular.module('app').controller('propertyInfoCtrl', ['$http', '$scope', 'server', '$state', '$cookieStore', function ($http, $scope, server, $state, $cookieStore) {
    //标志位
    var storage=window.localStorage;
     if($state.params.projectid){
        var projectId = $state.params.projectid;
        $scope.projectId = $state.params.projectid;
     }else{
        $scope.projectId = storage.getItem('a')
     }

    var userId = server.server().userId;  //用户id
    $scope.searchKeys = '';//筛选
    $scope.flag = false;
    
    $scope.no = '/';
    //查询项目name和物业个数
    function topnumber(){
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
    }
    topnumber()


//搜索条件显示
    function showajax() {
        server.server().zjroomsearchForConditiondo({
            projectId: $scope.projectId
        }, function (data) {
            if (data.result === true) {
                $scope.dataCheckbox = data.data;
                for (var i = 0; i < $scope.dataCheckbox.length; i++) {
                    $scope.dataCheckbox[i].state = false;
                }
                $scope.$apply();
            } else {
                alert(data.message)
            }
        })
    }

    showajax()


    $scope.selected = [];
    $scope.selectAll = true;
//单选
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
        serv($scope.searchKeys, $scope.selected.join(","), $scope.conf.currentPage);
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
        serv($scope.searchKeys, $scope.selected.join(","), $scope.conf.currentPage)
    }
//分页
    $scope.conf = {
        total: 6,  //共多少页
        currentPage: 1,  //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
    }
    $scope.$watch('conf.currentPage + conf.itemPageLimit+searchKeys', function (news) {
        serv($scope.searchKeys, $scope.selected.join(","), $scope.conf.currentPage)
    })

//被筛选信息

    function serv(searchKeys, val, pageNo) {
        $scope.propertys = [];
        server.server().prpManageCtrlFn({
            userId:userId,
            projectId: $scope.projectId,
            searchKeys: searchKeys ? searchKeys : '',
            schemaId: val ? val : '',
            pageNo: pageNo ? pageNo : 1,
            pageSize: $scope.conf.itemPageLimit ? $scope.conf.itemPageLimit : 10
        }, function (data) {
            if (data.result === true) {
                $scope.propertys = data.data.rows;
                //多少个物业
                $scope.total=data.data.total;
                //共多少页
                $scope.conf.total = Math.ceil(data.data.total / data.data.pageSize);
                //共有多少条数据
                $scope.conf.counts = data.data.total;
                $scope.$broadcast("categoryLoaded");
                $scope.$apply()
            } else {
                alert(data.message)
            }
        })
    }

//搜索
    $scope.search = function () {
        serv($scope.searchKeys, $scope.selected.join(","), $scope.conf.currentPage)
    }
//编辑
    $scope.edit = function (id, schemaId, indx) {
        server.server().zjroominitUpdatedo({
            id: id,
            schemaId: schemaId
        }, function (data) {
            if (data.result === true) {
                $state.go('NewBuildingStandard', {id: id, schemaId: schemaId, projectid: $scope.projectId})
            } else {
                alert(data.message)
            }
        })


    }

//删除
    $scope.dels = function (id, indx) {
        confirm('确认删除该条吗？',function(){
            server.server().zjroomdeleteByIddo({
                id: id,
                userId: userId
            }, function (data) {
                if (data.result === true) {
                    $scope.propertys.splice(indx, 1);
                    topnumber()
                    serv('','',$scope.conf.currentPage)
                    alert(data.message)
                    $scope.$apply()
                }else{
                    alert(data.message)
                }
            })
        })

    }

// 新增弹窗
    $scope.xinzeng = function () {
        zjroomlistSearchdo('supper')
    }

    function zjroomlistSearchdo(flag) {
        //id城中村server
        server.server().zjroomlistSearchdo({
            projectId: $scope.projectId
        }, function (data) {
            if (data.result === true) {
                if (data.data.length > 0) {
                    $scope.newHousData = data.data;
                    $scope.newHousData.forEach(function (item, indx) {
                        $scope.newHousData[indx].indx = indx
                    })
                    $scope.$apply()
                    $('.' + flag).dialog();
                }
            } else {
                alert(data.message)
            }
        })
    }


//路由跳转 新增top
    $scope.NewHousingStandards = function (parkid, id) {
        if (parkid || id) {
            //请求接口
            //初始化
            server.server().zjroominitAdddo({
                projectId: parkid,
                schemId: id
            }, function (data) {
                if (data.result === true) {
                    $state.go('NewHousingStandards', {packid: parkid, id: id})
                } else {
                    alert(data.message,function(){
                        $state.go('dataHierarchy', {projectid: parkid})
                    })
                }
            })
        }
    }
    //导入弹窗
    $scope.import = function () {
        zjroomlistSearchdo('import')
    }
    //导出弹窗
    $scope.export = function () {
        zjroomlistSearchdo('export')
    }
    //下载导入弹窗
    $scope.Down = function () {
        zjroomlistSearchdo('Down')
    }

    //导入弹窗
    $scope.fileNameChanged = function (e, projectId, schemId) {

        var fd = new FormData();
        var eve = e.target;
        if (e.target.files[0]) {
            var file = e.target.files[0];
            var indx = $(eve).attr('useindx');
            var fileprojectId = $scope.newHousData[indx].parkId;
            var fileschemId = $scope.newHousData[indx].id;
            fd.append('multipartFile', file);
            fd.append('projectId', fileprojectId);
            fd.append('schemaId', fileschemId);
            fd.append('userId', userId);
            $('.import').fadeOut(200);
            $http({
                method: 'POST',
                url: server.server().host2 + "room/leadingIn.do",
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function successCallback(data) {
                eve.value = '';
                if (data.data.result === true) {
                    alert('导入成功', function () {
                        location.reload();
                    })
                } else {
                    alert(data.data.message)
                }
            })
        }
    }
    //导出弹窗
    $scope.exportSave = function (projectId, schemId, indx) {
        if(schemId && projectId){
            var useHost = server.server().host2;
            var host = useHost + 'room/export.do';
            $scope.link = host + '?schemaId=' + schemId + '&projectId=' + projectId+'&userId='+userId;
        }

    }

    //下载导入弹窗
    $scope.DownSave = function (projectId, schemId, indx, evt) {
        if(schemId && projectId) {
            var useHost = server.server().host2;
            var host = useHost + 'room/templet.do';
            $scope.link = host + '?schemaId=' + schemId;
        }
    }


}])
