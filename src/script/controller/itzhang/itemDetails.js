'use strict'

angular
  .module('app')
  .controller('itemDetailsCtrl', [
    'server',
    '$http',
    '$scope',
    'dict',
    '$rootScope',
    '$state',
    function(server, $http, $scope, dict, $rootScope, $state) {
      $scope.hostName = server.server().host
      $scope.no = '/'

      var userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      var valueArr = [],
        nameArr = []

      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }
      $scope.listtop = {
        roomId: $state.params.projectid,
        projectId: $state.params.projectid,
        paciId: $scope.pactId,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 1, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }

      server.server().zjprojectprojectDetaileddo(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result === true) {
            $scope.project = data.data.project
            $scope.survey = data.data.survey
            $scope.propertyCount = data.data.propertyCount //房产数量
            $scope.count = data.data.count //附件数量
            $scope.attachment = data.data.attachment
            $scope.salesControl = data.data.salesControl
            for (var key in $scope.salesControl) {
              valueArr.push($scope.salesControl[key])
              nameArr.push(key)
            }
            ecarh(valueArr, nameArr)
            $scope.$apply()
          }
        }
      )

      function ecarh(valueArr, valueName) {
        var myChart = echarts.init(document.getElementById('main'))
        myChart.setOption({
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              data: [
                { value: valueArr[0] ? valueArr[0] : 0, name: '还建' },
                { value: valueArr[1] ? valueArr[1] : 0, name: '移交' },
                { value: valueArr[2] ? valueArr[2] : 0, name: '拆除' },
                { value: valueArr[3] ? valueArr[3] : 0, name: '测绘' },
                { value: valueArr[4] ? valueArr[4] : 0, name: '签约' }
              ]
            }
          ]
        })
        $scope.salesControlArr = [
          {
            value: valueArr[0] ? valueArr[0] : 0,
            name: '还建',
            USName: valueName[0]
          },
          {
            value: valueArr[1] ? valueArr[1] : 0,
            name: '移交',
            USName: valueName[1]
          },
          {
            value: valueArr[2] ? valueArr[2] : 0,
            name: '拆除',
            USName: valueName[2]
          },
          {
            value: valueArr[3] ? valueArr[3] : 0,
            name: '测绘',
            USName: valueName[3]
          },
          {
            value: valueArr[4] ? valueArr[4] : 0,
            name: '签约',
            USName: valueName[4]
          }
        ]
      }
      //项目信息
      server.server().zjprojectdeleteById(
        {
          id: $scope.projectId,
          userId: userId
        },
        function(data) {
          if (data.result === true) {
            $scope.project2 = data.data.project
            $scope.$apply()
          }
        }
      )
      //关注相关////lgc
      //查询状态
      server.server().zjprojectprojectDetaileddo(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result) {
            if (data.data.follow) {
              if (data.data.follow.status == 0) {
                $scope.follow = true
              }
            }
          } else {
            alert(data.message)
          }
        }
      )
      $scope.changeFollow = function(flag) {
        if (flag) {
          var parem = {
            projectId: $scope.projectId,
            creatorUser: userId,
            type: 30
          }
          parem.userJson = JSON.stringify([{ toUserId: userId }])
          server
            .server()
            .lgcMainInfosharedtransferconSave(
              parem,
              function(data) {},
              function() {}
            )
        } else {
        }
      }

      ////////end//////////////

      var usetime = function(UNIX) {
        var a = new Date(UNIX)

        var months = [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12'
        ]

        var year = a.getFullYear()

        var month = months[a.getMonth()]

        var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate()

        var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours()

        var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes()

        var time = year + month + date + hour + min

        return time
      }

      //--------------暂时操作数组(静态用)------------------
      $scope.showData = {}
      //-------------------------------------------------

      //项目列表展示（查询）
      function zjfollowuplistdo() {
        server.server().zjfollowuplistdo(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              //判断ajax里面的值是否存在（避免报错
              if (data.data) {
                // 拿到ajax返回的数据（页面展示ng-repeat）
                $scope.showMes = data.data

                //把时间戳转成时间 2017/10/10/12:00
                for (var i = 0; i < data.data.length; i++) {
                  if (
                    usetime(new Date().getTime()) -
                      usetime(data.data[i].createTime) <=
                    1
                  ) {
                    data.data[i].createTime = '1分钟前'
                  } else if (
                    usetime(new Date().getTime()) -
                      usetime(data.data[i].createTime) <=
                    2
                  ) {
                    data.data[i].createTime = '2分钟前'
                  } else if (
                    usetime(new Date().getTime()) -
                      usetime(data.data[i].createTime) <=
                    3
                  ) {
                    data.data[i].createTime = '3分钟前'
                  } else {
                    data.data[i].createTime = dict.timeConverter(
                      data.data[i].createTime
                    )
                  }
                }

                //------------------把静态需要展示的数据先压入到这个暂时操作数组(静态无刷新用的)，和ajax提交无关-------------
                $scope.showData.photoUrl = data.data[0].photoUrl
                  ? data.data[0].photoUrl
                  : '../image/图层10_34.png'
                $scope.showData.realname = data.data[0].realname
                $scope.showData.projectName = data.data[0].projectName
                //需要id才能操作（）静态发布用
                $scope.showData.id = ''
                $scope.showData.createTime = data.data[0].createTime
                $scope.showData.depict = data.data[0].depict
                //------------------------------------------------------------------------------------------------

                $scope.$apply()
              }
            }
          }
        )
      }
      zjfollowuplistdo()

      //项目管理发布
      $scope.issue = function(val) {
        // ------------------静态无刷新用的，用于静态赋值，和ajax无关-------------------
        if (!val) {
          alert('描述不能为空！')
          return
        }
        var data = '刚刚' // var data = dict.timeConverter(new Date().getTime());
        $scope.showData.createTime = data
        $scope.showData.depict = val
        //-----------------------------------------------------------------------\

        server.server().zjfollowupaddSavedo(
          {
            type: 1, //	跟进类型	是	1项目  2物业
            dataId: $scope.projectId, //	项目  或者 物业id	是
            depict: val ? val : '', //	描述	是
            createUser: userId //	用户id	是
          },
          function(data) {
            if (data.result === true) {
              alert('发布成功！')

              //------------用于发布成功后显示假数据，数组头部插入一条，静态就展示一条,与ajax无关------------
              $scope.showMes.unshift($scope.showData)
              $scope.textareaVal = ''

              //---------------定时器请求ajax一次,页面数据就无刷新显示的是真正的值-----------------------------，
              window.setTimeout(zjfollowuplistdo, 10000)
              //----------------------------------------------------------------------------------

              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //删除
      $scope.delete = function(id, indx) {
        if (!id) {
          alert('发布30秒后才能删除')
          return
        }
        confirm('确认删除该条吗？', function() {
          server.server().zjfollowupdeleteByIddo(
            {
              id: id
            },
            function(data) {
              if (data.result === true) {
                // -------------------页面假数据删除，与ajax无头-----------------------
                $scope.showMes.splice(indx, 1)
                // ----------------------------------------------------------------

                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
      }
    }
  ])
  /*项目信息*/
  .controller('itemInformationCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {
      $scope.no = '/'
      $scope.projectId = $state.params.projectid
      $scope.hostname = server.server().imgHost
      var userId = server.server().userId

      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }
      $scope.listtop = {
        roomId: $state.params.projectid,
        projectId: $state.params.projectid,
        paciId: $scope.pactId,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 1, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }

      //项目信息
      server.server().zjprojectdeleteById(
        {
          id: $scope.projectId,
          userId: userId
        },
        function(data) {
          if (data.result === true) {
            $scope.project = data.data.project
            $scope.count = data.data.count
            $scope.$apply()
          } else {
            alert(data.message)
          }
        },
        function() {}
      )

      //规划图和效果图展示
      function imgList() {
        server.server().watchAttachment(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              $scope.attachList = data.data
              $scope.arr1 = []
              $scope.arr2 = []
              $scope.attachList.forEach(function(item, index) {
                if (item.type == 1) {
                  //规划图
                  $scope.arr1.push(item)
                } else {
                  //效果图
                  $scope.arr2.push(item)
                }
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      imgList()
      //添加规划图和效果图
      //添加附件
      $scope.addannex = function(files, flag) {
        var fd = new FormData()
        var file = files[0]
        $scope.filename = file.name
        fd.append('multipartFile', file)
        $http({
          method: 'POST',
          url: $scope.hostname + 'attachment/fielUpload.do',
          data: fd,
          headers: { 'Content-Type': undefined },
          transformRequest: angular.identity
        }).then(function successCallback(response) {
          // 请求成功执行代码
          $scope.data = response.data.data
          $scope.fileName = $scope.data.fileName
          $scope.filePath = $scope.data.filePath
          $scope.size = $scope.data.size
          var pictureJson = [
            {
              fileName: $scope.fileName,
              fileSize: $scope.size,
              fileUrl: $scope.filePath
            }
          ]
          server.server().addProjectAttachment(
            {
              projectId: $scope.projectId,
              type: flag,
              pictureJson: JSON.stringify(pictureJson)
            },
            function(data) {
              if (data.result === true) {
                alert(data.message, function() {
                  imgList()
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            },
            function(err) {}
          )
        })
      }
    }
  ])
  //物业信息
  .controller('propertyInformationCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    function($http, $scope, server, $state, dict) {
      $scope.projectId = $state.params.projectid
      var userId = server.server().userId
      $scope.casHost = server.server().casHost
      $scope.propertyUrl = server.server().propertyUrl
      $scope.no = '/'
      var storage = window.localStorage
      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }
      $scope.listtop = {
        roomId: $state.params.projectid,
        projectId: $state.params.projectid,
        paciId: $scope.pactId,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 1, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
      $scope.newInforClick = function() {
        storage.setItem('flagindex', 3)
        window.location = $scope.casHost + $scope.propertyUrl
      }

      //分页配置
      $scope.conf = {
        total: 10, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      function serv() {
        server.server().zjroomlistdo(
          {
            userId: userId,
            projectId: $scope.projectId,
            // schemaId:val?val:'',
            pageNo: $scope.conf.currentPage ? $scope.conf.currentPage : 1,
            pageSize: $scope.conf.itemPageLimit ? $scope.conf.itemPageLimit : 10
          },
          function(data) {
            if (data.result === true) {
              // 定义一个数组
              if (data.data.total === 0) {
                $scope.flag == true
              } else {
                $scope.flag = false
                $scope.lists = data.data.rows
                //多少页
                $scope.conf.total = Math.ceil(
                  data.data.total / data.data.pageSize
                )
                //共有多少条数据
                $scope.conf.counts = data.data.total

                $scope.$broadcast('categoryLoaded')
                $scope.$apply()
              }
            } else {
              alert(data.message)
            }
          }
        )
      }
      $scope.$watch('conf.currentPage + conf.itemPageLimit', function(news) {
        serv()
      })

      //搜索
      $scope.inputVal = function() {
        serv($scope.inputVal)
      }
      //编辑
      $scope.edit = function() {
        // serv($scope.inputVal)
      }
      //删除
      $scope.delete = function(id, indx) {
        confirm('确认删除这条数据吗？', function() {
          server.server().zjroomdeleteByIddo(
            {
              id: id,
              userId: userId
            },
            function(data) {
              if (data.result === true) {
                alert(data.message, function() {
                  serv()
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
      }
    }
  ])
  /*<!--b_新增物业-->*/
  .controller('NewHousingStandardsCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$stateParams',
    function($http, $scope, server, dict, $state, $stateParams) {
      var createUser = server.server().userId //用户id
      var schemId = $state.params.id
      var projectId = $state.params.packid
      $scope.projectlocation = $state.params.packid

      //物业跳转
      $scope.locationInformation = function() {
        $state.go('propertyInfo', { projectid: $scope.projectlocation })
      }

      //结构层
      $scope.flag = [
        //是否显示        //提示          //默认值       //下拉框内列表
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        }
      ]

      if (projectId) {
        $scope.interfaces = ''
        server.server().zjroominitAdddo(
          {
            schemId: schemId,
            projectId: projectId
          },
          function(data) {
            if (data.result === true) {
              // 基本信息
              $scope.interfaces = data.data
              // // 是否有文号
              $scope.whether = data.data.isRoom
              // // 属性
              $scope.settingsList = data.data.settingsList
              // 三层
              $scope.topClass = data.data.topClass

              //默认第一层下拉框内容
              $scope.distinguish = data.data.distinguish

              //默认选择显示个数
              $scope.quShowNumber = data.data.topClass.length
              for (var k = 0; k < $scope.topClass.length; k++) {
                //下接框
                $scope.topClass[0].selectvalOnce = $scope.distinguish
                // $scope.schemaList[k].selectval = $scope.topClass[k].topClassList;
                switch ($scope.topClass[k].sort) {
                  case 0:
                    $scope.flag[0].quflag = true
                    $scope.flag[0].selectval = $scope.topClass[k].selectvalOnce
                    $scope.flag[0].titleName = $scope.topClass[k].shemaName

                    break
                  case 1:
                    $scope.flag[1].quflag = true
                    $scope.flag[1].selectval = $scope.topClass[k].selectvalOnce
                    $scope.flag[1].titleName = $scope.topClass[k].shemaName
                    break
                  case 2:
                    $scope.flag[2].quflag = true
                    $scope.flag[2].selectval = $scope.topClass[k].selectvalOnce
                    $scope.flag[2].titleName = $scope.topClass[k].shemaName
                    break
                  case 3:
                    $scope.flag[3].quflag = true
                    $scope.flag[3].selectval = $scope.topClass[k].selectvalOnce
                    $scope.flag[3].titleName = $scope.topClass[k].shemaName
                    break
                  case 4:
                    $scope.flag[4].quflag = true
                    $scope.flag[4].selectval = $scope.topClass[k].selectvalOnce
                    $scope.flag[4].titleName = $scope.topClass[k].shemaName
                    break
                }
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //selel存值  id
      $scope.sendval = [
        { val: '', id: '' },
        { val: '', id: '' },
        { val: '', id: '' },
        { val: '', id: '' },
        { val: '', id: '' }
      ]
      $scope.sumval = []
      $scope.sumid = []

      $scope.tops = {
        code: false,
        address: false,
        landCircumstances: false,
        landCertificate: false,
        propertyOwner: false,
        houseCertificate: false,
        houseUser: false,
        landArea: false,
        registerArea: false,
        settabute: false,
        reportForConstruction: false,
        other: false,
        propertyRightDatumName: false //产权资料名称
      }

      //调用下拉框
      function initAddSubleveldo(id, indx) {
        if (
          indx + 1 != $scope.flag.length &&
          $scope.flag[indx + 1].quflag === true
        ) {
          $scope.flag[indx + 1].selectval = []
          server.server().zjroominitAddSubleveldo(
            {
              parentId: id
            },
            function(data) {
              if (data.result === true) {
                data.data.length > 0
                  ? ($scope.flag[indx + 1].selectval = data.data)
                  : alert('未找到对应的子级结构,请重新选择！')
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
      }

      //失去焦点事件
      $scope.tips = function(val, flag) {
        if (flag === 0) {
          !val
            ? ($scope.flag[0].spanflag = true)
            : (($scope.flag[0].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 1) {
          !val
            ? ($scope.flag[1].spanflag = true)
            : (($scope.flag[1].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 2) {
          !val
            ? ($scope.flag[2].spanflag = true)
            : (($scope.flag[2].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 3) {
          !val
            ? ($scope.flag[3].spanflag = true)
            : (($scope.flag[3].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 4) {
          !val
            ? ($scope.flag[4].spanflag = true)
            : (($scope.flag[4].spanflag = false), initAddSubleveldo(val, flag))
        }

        if (flag == 'code') {
          !val ? ($scope.tops.code = true) : ($scope.tops.code = false)
        }
        if (flag == 'address') {
          !val ? ($scope.tops.address = true) : ($scope.tops.address = false)
        }

        /*//属性
        if(flag=='settabute'){
            !val?$scope.tops.settabute=true:$scope.tops.settabute=false;
        }
        //产权资料名称
        if(flag=='propertyRightDatumName'){
            !val?$scope.tops.propertyRightDatumName=true:$scope.tops.propertyRightDatumName=false;
        }

        if(flag=='landCircumstances'){
            !val?$scope.tops.landCircumstances=true:$scope.tops.landCircumstances=false;
        }
        if(flag=='landCertificate'){
            !val?$scope.tops.landCertificate=true:$scope.tops.landCertificate=false;
        }
        if(flag=='landArea'){
            !val?$scope.tops.landArea=true:$scope.tops.landArea=false;
        }
        if(flag=='propertyOwner'){
            !val?$scope.tops.propertyOwner=true:$scope.tops.propertyOwner=false;
        }
        if(flag=='houseCertificate'){
            !val?$scope.tops.houseCertificate=true:$scope.tops.houseCertificate=false;
        }
        if(flag=='houseUser'){
            !val?$scope.tops.houseUser=true:$scope.tops.houseUser=false;
        }
        if(flag=='registerArea'){
            !val?$scope.tops.registerArea=true:$scope.tops.registerArea=false;
        }*/
      }

      $scope.save = function() {
        if ($scope.flag[0].quflag === true) {
          if (!$scope.flag[0].topselect.id) {
            $scope.flag[0].spanflag = true
            return
          } else {
            $scope.sendval[0].id = $scope.flag[0].topselect.id
            $scope.sendval[0].val = $('.select0')
              .find('option:selected')
              .text()
            $scope.flag[0].spanflag = false
          }
        }

        if ($scope.flag[1].quflag === true) {
          if (!$scope.flag[1].topselect.id) {
            $scope.flag[1].spanflag = true
            return
          } else {
            $scope.sendval[1].id = $scope.flag[1].topselect.id
            $scope.sendval[1].val = $('.select1')
              .find('option:selected')
              .text()

            $scope.flag[1].spanflag = false
          }
        }

        if ($scope.flag[2].quflag === true) {
          if (!$scope.flag[2].topselect.id) {
            $scope.flag[2].spanflag = true
            return
          } else {
            $scope.sendval[2].id = $scope.flag[2].topselect.id
            $scope.sendval[2].val = $('.select2')
              .find('option:selected')
              .text()
            $scope.flag[2].spanflag = false
          }
        }

        if ($scope.flag[3].quflag === true) {
          if (!$scope.flag[3].topselect.id) {
            $scope.flag[3].spanflag = true
            return
          } else {
            $scope.sendval[3].id = $scope.flag[3].topselect.id
            $scope.sendval[3].val = $('.select3')
              .find('option:selected')
              .text()
            $scope.flag[3].spanflag = false
          }
        }
        if ($scope.flag[4].quflag === true) {
          if (!$scope.flag[4].topselect.id) {
            $scope.flag[4].spanflag = true
            return
          } else {
            $scope.sendval[4].id = $scope.flag[4].topselect.id
            $scope.sendval[4].val = $('.select4')
              .find('option:selected')
              .text()
            $scope.flag[4].spanflag = false
          }
        }

        //房号$scope.interfaces.code
        if ($scope.whether === 1) {
          if (!$scope.interfaces.code) {
            $scope.interfaces.code = ''
            $scope.tops.code = true
            return
          } else {
            $scope.tops.code = false
          }
        }

        //地址 interfaces.address
        if (!$scope.interfaces.address) {
          $scope.tops.address = true
          return
        } else {
          $scope.tops.address = false
        }

        /*//属性
        if(!$scope.setval){
            $scope.tops.settabute=true;
            return;
        }else{
            $scope.tops.settabute=false;
        }

        //地址转正情况 interfaces.landCircumstances
        if(!$scope.interfaces.landCircumstances){
            $scope.tops.landCircumstances=true;
            return;
        }else{
            $scope.tops.landCircumstances=false;
        }

        //圭地证 landCertificate
        if(!$scope.interfaces.landCertificate){
            $scope.tops.landCertificate=true;
            return;
        }
        //土地面积 landArea
        if(!$scope.interfaces.landArea){
            $scope.tops.landArea=true;
            return;
        }
        //权属人 propertyOwner
        if(!$scope.interfaces.propertyOwner){
            $scope.tops.propertyOwner=true;
            return;
        }

        //方产证 houseCertificate
        if(!$scope.interfaces.houseCertificate){
            $scope.tops.houseCertificate=true;
            return;
        }
        //方产人  houseUser
        if(!$scope.interfaces.houseCertificate){
            $scope.tops.houseCertificate=true;
            return;
        }

        //登记页面积  registerArea
        if(!$scope.interfaces.registerArea){
            $scope.tops.registerArea=true;
            return;
        }*/
        $scope.number = 0
        for (var i = 0; i < $scope.flag.length; i++) {
          if ($scope.flag[i].quflag == true) {
            $scope.number++
          }
        }
        if ($scope.number < $scope.quShowNumber) {
          alert('未找到对应的所属子级结构！')
          return
        }

        zjroomaddSavedo($scope.interfaces, $scope.sendval, $scope.setval)
      }
      $scope.clickflag = true
      function zjroomaddSavedo(interfaces, sendval, senddata) {
        for (var i = 0; i < sendval.length; i++) {
          if (sendval[i].val) {
            $scope.sumval.push(sendval[i].val)
          }
          if (sendval[i].id) {
            $scope.sumid.push(sendval[i].id)
          }
        }
        if ($scope.clickflag) {
          $scope.clickflag = false
          server.server().zjroomaddSavedoADD(
            {
              createUser: createUser,
              parkId: projectId, //	项目id	是
              // id:interfaces.id,                   //当前数据id
              schemaObjId: $scope.sumid[0], //	楼层id	是
              code: interfaces.code, //	房号	是
              splitJointName: $scope.sumval.join(''), //	拼接参数	是

              address: interfaces.address, //	地址	是
              // propertyOwner:interfaces.propertyOwner,               //	权属人	是
              houseUser: interfaces.houseUser || '', //权利人	房产权属登记人	是
              attribute: senddata || '', //用地性质	属性	是
              propertyRightDatumName: interfaces.propertyRightDatumName || '', //产权资料名称
              landCertificate: interfaces.landCertificate || '', //	土地证	是
              houseCertificate: interfaces.houseCertificate, //	房产证	是
              landArea: interfaces.landArea, //基底面积	土地面积	是
              registerArea: interfaces.registerArea,
              whether: interfaces.isRoom, //	是否有房号	是1，0
              splitJointId: $scope.sumid.join(','), //	层级结构参数拼接id	是

              schemaObjIdTwo: $scope.sumid[1] || '',
              schemaObjIdThree: $scope.sumid[2] || '',
              schemaObjIdFour: $scope.sumid[3] || '',
              schemaObjIdFive: $scope.sumid[4] || '',

              reportForConstruction: interfaces.reportForConstruction, //报建信息
              other: interfaces.other //报建信息
            },
            function(data) {
              $scope.sumid = []
              $scope.sumval = []
              if (data.result === true) {
                $scope.clickflag = true
                // 定义一个数组
                alert('提交成功！', function() {
                  $state.go('propertyInfo', { projectid: projectId })
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
      }
    }
  ])
  /*<!--编缉物业（区栋标准）-->*/
  .controller('NewBuildingStandardCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {
      // var schemId = '1dd1e4c7211f4ddeb5e5471eab2a17d3';
      var projectid = $state.params.projectid
      $scope.projectlocation = $state.params.projectid
      var updateUser = server.server().userId //用户id
      var schemaId = $state.params.schemaId //底层id
      var id = $state.params.id //当前数据id

      //结构层
      $scope.flag = [
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        },
        {
          quflag: false,
          spanflag: false,
          topselect: '',
          selectval: [],
          titleName: ''
        }
      ]

      // information跳转
      //物业跳转
      $scope.locationInformation = function() {
        $state.go('propertyInfo', { projectid: projectid })
      }

      if (schemaId) {
        $scope.interfaces = ''
        server.server().zjroominitUpdatedo(
          {
            id: id,
            schemaId: schemaId
          },
          function(data) {
            if (data.result === true) {
              // 基本信息
              $scope.interfaces = data.data.roomMap

              // 是否有文号
              $scope.whether = $scope.interfaces.whether
              // 属性
              $scope.settingsList = data.data.settingsList
              //默认属性id
              $scope.setval = $scope.interfaces.attribute

              //默认属性id
              // $scope.setval=$scope.interfaces.attribute;

              //是否有栋，层。。。
              $scope.schemaList = data.data.schemaList
              //内容
              $scope.topClass = data.data.topClass
              //默认选中
              $scope.array = data.data.array

              //必须要显示的个娄
              $scope.quShowNumber = data.data.schemaList.length

              for (var i = 0; i < $scope.topClass.length; i++) {
                for (
                  var j = 0;
                  j < $scope.topClass[i].topClassList.length;
                  j++
                ) {
                  if (
                    $scope.array[i] === $scope.topClass[i].topClassList[j].id
                  ) {
                    //topval自定义的
                    $scope.schemaList[i].topval =
                      $scope.topClass[i].topClassList[j]
                  }

                  switch ($scope.schemaList[i].sort) {
                    case 0:
                      $scope.flag[0].topselect = $scope.schemaList[i].topval
                      break
                    case 1:
                      $scope.flag[1].topselect = $scope.schemaList[i].topval
                      break
                    case 2:
                      $scope.flag[2].topselect = $scope.schemaList[i].topval
                      break
                    case 3:
                      $scope.flag[3].topselect = $scope.schemaList[i].topval
                      break
                    case 4:
                      $scope.flag[4].topselect = $scope.schemaList[i].topval
                      break
                  }
                }
              }
              for (var k = 0; k < $scope.schemaList.length; k++) {
                //下接框

                $scope.schemaList[k].selectval = $scope.topClass[k].topClassList
                switch ($scope.schemaList[k].sort) {
                  case 0:
                    $scope.flag[0].quflag = true
                    $scope.flag[0].selectval = $scope.schemaList[k].selectval
                    $scope.flag[0].titleName = $scope.schemaList[k].shemaName
                    break
                  case 1:
                    $scope.flag[1].quflag = true
                    $scope.flag[1].selectval = $scope.schemaList[k].selectval
                    $scope.flag[1].titleName = $scope.schemaList[k].shemaName
                    break
                  case 2:
                    $scope.flag[2].quflag = true
                    $scope.flag[2].selectval = $scope.schemaList[k].selectval
                    $scope.flag[2].titleName = $scope.schemaList[k].shemaName
                    break
                  case 3:
                    $scope.flag[3].quflag = true
                    $scope.flag[3].selectval = $scope.schemaList[k].selectval
                    $scope.flag[3].titleName = $scope.schemaList[k].shemaName
                    break
                  case 4:
                    $scope.flag[4].quflag = true
                    $scope.flag[4].selectval = $scope.schemaList[k].selectval
                    $scope.flag[4].titleName = $scope.schemaList[k].shemaName
                    break
                }
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
      //selel存值  id
      $scope.sendval = [
        { val: '', id: '' },
        { val: '', id: '' },
        { val: '', id: '' },
        { val: '', id: '' },
        { val: '', id: '' }
      ]
      $scope.sumval = []
      $scope.sumid = []

      $scope.tops = {
        code: false,
        address: false,
        landCircumstances: false,
        landCertificate: false,
        propertyOwner: false,
        houseCertificate: false,
        houseUser: false,
        landArea: false,
        registerArea: false,
        settabute: false
      }

      //调用下拉框
      function initAddSubleveldo(id, indx) {
        if (
          indx + 1 != $scope.flag.length &&
          $scope.flag[indx + 1].quflag === true
        ) {
          $scope.flag[indx + 1].selectval = []
          server.server().zjroominitAddSubleveldo(
            {
              parentId: id
            },
            function(data) {
              if (data.result === true) {
                data.data.length > 0
                  ? ($scope.flag[indx + 1].selectval = data.data)
                  : alert('未找到对应的子级结构,请重新选择！')
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
      }

      //失去焦点事件
      $scope.tips = function(val, flag) {
        if (flag === 0) {
          !val
            ? ($scope.flag[0].spanflag = true)
            : (($scope.flag[0].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 1) {
          !val
            ? ($scope.flag[1].spanflag = true)
            : (($scope.flag[1].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 2) {
          !val
            ? ($scope.flag[2].spanflag = true)
            : (($scope.flag[2].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 3) {
          !val
            ? ($scope.flag[3].spanflag = true)
            : (($scope.flag[3].spanflag = false), initAddSubleveldo(val, flag))
        }
        if (flag === 4) {
          !val
            ? ($scope.flag[4].spanflag = true)
            : (($scope.flag[4].spanflag = false), initAddSubleveldo(val, flag))
        }

        if (flag == 'code') {
          !val ? ($scope.tops.code = true) : ($scope.tops.code = false)
        }
        if (flag == 'address') {
          !val ? ($scope.tops.address = true) : ($scope.tops.address = false)
        }

        //属性
        if (flag == 'settabute') {
          !val
            ? ($scope.tops.settabute = true)
            : ($scope.tops.settabute = false)
        }

        if (flag == 'landCircumstances') {
          !val
            ? ($scope.tops.landCircumstances = true)
            : ($scope.tops.landCircumstances = false)
        }
        if (flag == 'landCertificate') {
          !val
            ? ($scope.tops.landCertificate = true)
            : ($scope.tops.landCertificate = false)
        }
        if (flag == 'landArea') {
          !val ? ($scope.tops.landArea = true) : ($scope.tops.landArea = false)
        }
        if (flag == 'propertyOwner') {
          !val
            ? ($scope.tops.propertyOwner = true)
            : ($scope.tops.propertyOwner = false)
        }
        if (flag == 'houseCertificate') {
          !val
            ? ($scope.tops.houseCertificate = true)
            : ($scope.tops.houseCertificate = false)
        }
        if (flag == 'houseUser') {
          !val
            ? ($scope.tops.houseUser = true)
            : ($scope.tops.houseUser = false)
        }
        if (flag == 'registerArea') {
          !val
            ? ($scope.tops.registerArea = true)
            : ($scope.tops.registerArea = false)
        }
      }

      $scope.save = function() {
        if ($scope.flag[0].quflag === true) {
          if (!$scope.flag[0].topselect.id) {
            $scope.flag[0].spanflag = true
            return
          } else {
            $scope.sendval[0].id = $scope.flag[0].topselect.id
            $scope.sendval[0].val = $('.select0')
              .find('option:selected')
              .text()
            $scope.flag[0].spanflag = false
          }
        }

        if ($scope.flag[1].quflag === true) {
          if (!$scope.flag[1].topselect.id) {
            $scope.flag[1].spanflag = true
            return
          } else {
            $scope.sendval[1].id = $scope.flag[1].topselect.id
            $scope.sendval[1].val = $('.select1')
              .find('option:selected')
              .text()

            $scope.flag[1].spanflag = false
          }
        }

        if ($scope.flag[2].quflag === true) {
          if (!$scope.flag[2].topselect.id) {
            $scope.flag[2].spanflag = true
            return
          } else {
            $scope.sendval[2].id = $scope.flag[2].topselect.id
            $scope.sendval[2].val = $('.select2')
              .find('option:selected')
              .text()
            $scope.flag[2].spanflag = false
          }
        }

        if ($scope.flag[3].quflag === true) {
          if (!$scope.flag[3].topselect.id) {
            $scope.flag[3].spanflag = true
            return
          } else {
            $scope.sendval[3].id = $scope.flag[3].topselect.id
            $scope.sendval[3].val = $('.select3')
              .find('option:selected')
              .text()
            $scope.flag[3].spanflag = false
          }
        }
        if ($scope.flag[4].quflag === true) {
          if (!$scope.flag[4].topselect.id) {
            $scope.flag[4].spanflag = true
            return
          } else {
            $scope.sendval[4].id = $scope.flag[4].topselect.id
            $scope.sendval[4].val = $('.select4')
              .find('option:selected')
              .text()
            $scope.flag[4].spanflag = false
          }
        }

        //房号$scope.interfaces.code
        if ($scope.whether === 1) {
          if (!$scope.interfaces.code) {
            $scope.interfaces.code = ''
            $scope.tops.code = true
            return
          } else {
            $scope.tops.code = false
          }
        }

        //地址 interfaces.address
        if (!$scope.interfaces.address) {
          $scope.tops.address = true
          return
        } else {
          $scope.tops.address = false
        }

        // //属性
        // if(!$scope.setval){
        //     $scope.tops.settabute=true;
        //     return;
        // }else{
        //     $scope.tops.settabute=false;
        // }
        //
        // //地址转正情况 interfaces.landCircumstances
        // if(!$scope.interfaces.landCircumstances){
        //     $scope.tops.landCircumstances=true;
        //     return;
        // }else{
        //     $scope.tops.landCircumstances=false;
        // }
        //
        // //圭地证 landCertificate
        // if(!$scope.interfaces.landCertificate){
        //     $scope.tops.landCertificate=true;
        //     return;
        // }
        // //土地面积 landArea
        // if(!$scope.interfaces.landArea){
        //     $scope.tops.landArea=true;
        //     return;
        // }
        // //权属人 propertyOwner
        // if(!$scope.interfaces.propertyOwner){
        //     $scope.tops.propertyOwner=true;
        //     return;
        // }
        //
        // //方产证 houseCertificate
        // if(!$scope.interfaces.houseCertificate){
        //     $scope.tops.houseCertificate=true;
        //     return;
        // }
        // //方产人  houseUser
        // if(!$scope.interfaces.houseCertificate){
        //     $scope.tops.houseCertificate=true;
        //     return;
        // }
        //
        // //登记页面积  registerArea
        // if(!$scope.interfaces.registerArea){
        //     $scope.tops.registerArea=true;
        //     return;
        // }
        $scope.number = 0
        for (var i = 0; i < $scope.flag.length; i++) {
          if ($scope.flag[i].quflag === true) {
            $scope.number++
          }
        }
        if ($scope.number < $scope.quShowNumber) {
          alert('未找到对应的所属子级结构！')
          return
        }

        zjroomaddSavedo($scope.interfaces, $scope.sendval, $scope.setval)
      }
      $scope.clickflag = true
      function zjroomaddSavedo(interfaces, sendval, senddata) {
        for (var i = 0; i < sendval.length; i++) {
          if (sendval[i].val) {
            $scope.sumval.push(sendval[i].val)
          }
          if (sendval[i].id) {
            $scope.sumid.push(sendval[i].id)
          }
        }

        if ($scope.clickflag) {
          $scope.clickflag = false
          server.server().zjroomaddSavedo(
            {
              updateUser: updateUser,
              parkId: interfaces.parkId, //	项目id	是
              id: interfaces.id, //当前数据id
              schemaObjId: $scope.sumid[0], //	楼层id	是
              code: interfaces.code, //	房号	是
              splitJointName: $scope.sumval.join(''), //	拼接参数	是
              attribute: senddata || '', //	属性	是
              address: interfaces.address, //	地址	是
              // landCircumstances:interfaces.landCircumstances,               //	土地转正情况	是
              landCertificate: interfaces.landCertificate || '', //	土地证	是
              landArea: interfaces.landArea || '', //	土地面积	是
              // propertyOwner:interfaces.propertyOwner,               //	权属人	是
              houseCertificate: interfaces.houseCertificate || '', //	房产证	是
              houseUser: interfaces.houseUser || '', //	房产权属登记人	是
              registerArea: interfaces.registerArea || '', //	登记面积	是
              whether: interfaces.whether, //	是否有房号	是1，0
              splitJointId: $scope.sumid.join(','), //	层级结构参数拼接id	是
              propertyRightDatumName: interfaces.propertyRightDatumName || '', //

              schemaObjIdTwo: $scope.sumid[1] || '',
              schemaObjIdThree: $scope.sumid[2] || '',
              schemaObjIdFour: $scope.sumid[3] || '',
              schemaObjIdFive: $scope.sumid[4] || '',

              reportForConstruction: interfaces.reportForConstruction,
              other: interfaces.other
            },
            function(data) {
              $scope.sumid = []
              $scope.sumval = []
              if (data.result === true) {
                $scope.clickflag = true
                // 定义一个数组
                alert(data.message, function() {
                  $state.go('propertyInfo', { projectid: projectid })
                })
              } else {
                alert(data.message)
              }
            },
            function(err) {
              alert(err)
            }
          )
        }
      }
    }
  ])
  // <!--业权人_收款方式（物业管理）-->
  .controller('PropertyManagementPropertyManagementCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {
      $scope.projectId = $state.params.projectid
      $scope.roomId = $state.params.roomId
      $scope.addFlag = true
      // 避免多次点击
      $scope.clickdisabled = true
      $scope.no = '/'
      var createUser = server.server().userId

      $scope.type = $scope.isEffective || 0
      //关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId, //1是项目id 2是物业id
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 跟进跟踪
      $scope.listtop = {
        projectId: $state.params.projectid,
        roomId: $state.params.roomId,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
      // 获取申请合同状态
      $scope.applypact = function(indx) {
        // 李爱军后来加的，没有就是他的事
        var storage = window.localStorage
        storage.setItem('sbstatus', $scope.datas[indx].sbStatus)
      }

      // 新增五个收款方式
      $scope.fiveAmount = [
        {
          chunchinese: '货币补偿金额一期',
          flag: false,
          tip: '*请输入货币补偿金额一期',
          chinese: '*货币补偿金额一期：',
          name: 'oneStageAmount',
          val: ''
        },
        {
          chunchinese: '货币补偿金额二期',
          flag: false,
          tip: '*请输入货币补偿金额二期',
          chinese: '*货币补偿金额二期：',
          name: 'towStageAmount',
          val: ''
        },
        {
          chunchinese: '货币补偿金额三期',
          flag: false,
          tip: '*请输入货币补偿金额三期',
          chinese: '*货币补偿金额三期：',
          name: 'threeStageAmount',
          val: ''
        },
        {
          chunchinese: '临时安置补偿金额(每季度)',
          flag: false,
          tip: '*请输入临时安置补偿金额(每季度)',
          chinese: '*临时安置补偿金额(每季度)：',
          name: 'temporaryAmount',
          val: ''
        },
        {
          chunchinese: '原《房产证》办证补偿',
          flag: false,
          tip: '*请输入原《房产证》办证补偿',
          chinese: ' *原《房产证》办证补偿：',
          name: 'certificatesHandlingAmount',
          val: ''
        }
      ]

      $scope.radios = function(value) {
        $scope.isEffective = value
        console.log(value)
        if (value == 1) {
          $scope.saveObj.cardPeriod = ''
        }
      }

      //添加业权人时间筛选
      function runAsync1(inputval, boxval, flag, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.saveObj.cardPeriod = value
            if (flag) {
              $scope.saveflag.cardPeriod = false
              callback(value)
            }
          }
        })
      }

      // 时间选择
      $scope.adddate = function(child, parent) {
        runAsync1(child, parent, 2, function(val) {
          $scope.saveObj.cardPeriod = val.toString()
          $scope.$apply()
        })
      }

      ////////end//////////////
      //项目信息
      server.server().zjprojectdeleteById(
        {
          id: $scope.projectId,
          userId: createUser
        },
        function(data) {
          if (data.result === true) {
            $scope.project2 = data.data.project

            $scope.$apply()
          } else {
          }
        }
      )

      function setData() {
        // 物业数据
        server.server().zjownershipqueryOwnerAndRecievedo(
          {
            holderId: $scope.roomId
          },
          function(data) {
            if (data.result === true) {
              if (data.data) {
                $scope.data = data.data
                if ($scope.data) {
                  $scope.data.forEach(function(item, i) {
                    $scope.data[i].isType = $scope.data[i].recieveType
                    switch ($scope.data[i].recieveType) {
                      case 1:
                        $scope.data[i].recieveType = '业权人收款'
                        break
                      case 2:
                        $scope.data[i].recieveType = '其他人代收款'
                        break
                      case 3:
                        $scope.data[i].recieveType = '未满18岁监护人待收款'
                        break
                      case 4:
                        $scope.data[i].recieveType = '关联其他业权人收款'
                        break
                    }
                  })
                }
                for (var i = 0; i < data.data.length; i++) {
                  $scope.data[i].indx = i
                }
                $scope.$apply()
              }
            } else {
              alert(data.message)
            }
          }
        )
      }

      setData()
      //关系图谱数据
      $scope.usedata = []
      $scope.links = []
      $scope.uhshifts = {
        relationShip: '业权人',
        relationPersion: ''
      }
      var dta = []
      var link = []

      function myjsondecode($str) {
        //
        $str = preg_replace('/"(w+)"(s*:s*)/is', '$1$2', $str) //去掉key的双引号
        return $str
      }

      //业权人关系图谱
      $scope.editInformation = function(id, indx) {
        $scope.ownerTempName = '业权人关系图谱'
        $scope.usedata = []
        $scope.links = []
        server.server().zjownershipqueryOwnerRelationShipdo(
          {
            // id:'4832c7bbcec740b0a51b3a0118338bf',
            id: id
          },
          function(data) {
            if (data.result === true) {
              $scope.relationdata = data.data
              $scope.relation = data.data.relation
              $scope.uhshifts.relationPersion = $scope.relationdata.holderName

              $scope.relation.unshift($scope.uhshifts)
              for (var i = 0; i < $scope.relation.length; i++) {
                //多少位
                $scope.usedata[i] = {
                  name: $scope.relation[i].relationPersion,
                  category: i === 0 ? 0 : 1,
                  draggable: true
                }
                //关系
                $scope.links[i] = {
                  source: 0,
                  target: i + 1,
                  // category:0,
                  value: $scope.relation[i].relationShip
                }
              }
              echart($scope.usedata, $scope.links)
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
      //联系人关系图谱
      $scope.makecoll = function(id, indx) {
        $scope.ownerTempName = '联系人关系图谱'
        $scope.usedata = []
        $scope.links = []
        server.server().zjmakecollectionsqueryRelationShipdo(
          {
            // id:'4832c7bbcec740b0a51b3a0118338bf',
            id: id
          },
          function(data) {
            if (data.result === true) {
              $scope.relationdata = data.data
              $scope.relation = data.data.relation
              $scope.uhshifts.relationPersion = $scope.relationdata.holderName

              $scope.relation.unshift($scope.uhshifts)
              for (var i = 0; i < $scope.relation.length; i++) {
                //多少位
                $scope.usedata[i] = {
                  name: $scope.relation[i].relationPersion,
                  category: i === 0 ? 0 : 1,
                  draggable: true
                }
                //关系
                $scope.links[i] = {
                  source: 0,
                  target: i + 1,
                  // category:0,
                  value: $scope.relation[i].relationShip
                }
              }
              $scope.$apply()

              echart($scope.usedata, $scope.links)
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }

      function echart(usedata, links) {
        var myChart = echarts.init(document.getElementById('main'))
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
                fontSize: 10
              }
            }
          },
          legend: {
            x: 'center',
            show: false,
            data: ['家人', '朋友', '亲戚']
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              symbolSize: 50,
              focusNodeAdjacency: true,
              roam: true,
              categories: [
                {
                  name: '家人',
                  itemStyle: {
                    normal: {
                      color: '#009800'
                    }
                  }
                },
                {
                  name: '朋友',
                  itemStyle: {
                    normal: {
                      color: '#4592FF'
                    }
                  }
                },
                {
                  name: '亲戚',
                  itemStyle: {
                    normal: {
                      color: '#3592F'
                    }
                  }
                }
              ],
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 12
                  }
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
                    fontSize: 10
                  },
                  formatter: '{c}'
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
        }
        myChart.setOption(option)
      }

      //添加业权人
      $scope.saveObj = {
        id: '',
        holderId: $scope.roomId,
        holderName: '', //业权人姓名	是
        // allocationProportion:'',	        //分配比率	是
        placeOrigin: '', //籍贯	否
        relationPerson: '', //联系人	是
        relationPhone: '', //联系电话	是
        address: '', //	通讯地址	是
        idCard: '', //身份证号码	是
        cardPeriod: '', //身份证有效期	否
        placeIdentity: '',
        permanentAddress: '', //户籍地址：
        houseArea: '', //住宅分配面积：
        commerceArea: '', //商业分配面积：
        industryArea: '', //产业研发用房：
        dormArea: '' //配套单身宿舍：
      }
      $scope.saveflag = {
        holderId: false,
        holderName: false, //业权人姓名	是
        // allocationProportion:false,	        //分配比率	是
        placeOrigin: false, //籍贯	否
        relationPerson: false, //联系人	是
        relationPhone: false, //联系电话	是
        address: false, //	通讯地址	是
        idCard: false, //身份证号码	是
        cardPeriod: false, //身份证有效期	否
        placeIdentity: false,
        permanentAddress: false, //户籍地址：
        houseArea: false, //住宅分配面积：
        commerceArea: false, //商业分配面积：
        industryArea: false, //产业研发用房：
        dormArea: false //配套单身宿舍：
      }

      //失去焦点事件
      $scope.blurs = function(val, flag) {
        // console.log(val,flag)
        if (flag == 'holderName') {
          !val
            ? ($scope.saveflag.holderName = true)
            : ($scope.saveflag.holderName = false)
        }
        // if(flag=='allocationProportion'){
        //     !val?$scope.saveflag.allocationProportion=true:$scope.saveflag.allocationProportion=false;
        // }

        if (flag == 'industryArea') {
          !val
            ? ($scope.saveflag.industryArea = true)
            : ($scope.saveflag.industryArea = false)
        }
        if (flag == 'dormArea') {
          !val
            ? ($scope.saveflag.dormArea = true)
            : ($scope.saveflag.dormArea = false)
        }

        if (flag == 'houseArea') {
          !val
            ? ($scope.saveflag.houseArea = true)
            : ($scope.saveflag.houseArea = false)
        }
        if (flag == 'commerceArea') {
          !val
            ? ($scope.saveflag.commerceArea = true)
            : ($scope.saveflag.commerceArea = false)
        }
        if (flag == 'placeOrigin') {
          !val
            ? ($scope.saveflag.placeOrigin = true)
            : ($scope.saveflag.placeOrigin = false)
        }
        if (flag == 'relationPerson') {
          !val
            ? ($scope.saveflag.relationPerson = true)
            : ($scope.saveflag.relationPerson = false)
        }
        if (flag == 'relationPhone') {
          !val
            ? ($scope.saveflag.relationPhone = true)
            : ($scope.saveflag.relationPhone = false)
        }
        if (flag == 'address') {
          !val
            ? ($scope.saveflag.address = true)
            : ($scope.saveflag.address = false)
        }
        if (flag == 'permanentAddress') {
          !val
            ? ($scope.saveflag.permanentAddress = true)
            : ($scope.saveflag.permanentAddress = false)
        }
        if (flag == 'idCard') {
          !val
            ? ($scope.saveflag.idCard = true)
            : ($scope.saveflag.idCard = false)
        }
        if (flag == 'cardPeriod') {
          !val
            ? ($scope.saveflag.cardPeriod = true)
            : ($scope.saveflag.cardPeriod = false)
        }
        if (flag == 'placeIdentity') {
          !val
            ? ($scope.saveflag.placeIdentity = true)
            : ($scope.saveflag.placeIdentity = false)
        }
        // you ta ma de 新加收款信息5个
        if (flag == $scope.fiveAmount[0].name) {
          !val
            ? ($scope.fiveAmount[0].flag = true)
            : ($scope.fiveAmount[0].flag = false)
        }
        if (flag == $scope.fiveAmount[1].name) {
          !val
            ? ($scope.fiveAmount[1].flag = true)
            : ($scope.fiveAmount[1].flag = false)
        }
        if (flag == $scope.fiveAmount[2].name) {
          !val
            ? ($scope.fiveAmount[2].flag = true)
            : ($scope.fiveAmount[2].flag = false)
        }
        if (flag == $scope.fiveAmount[3].name) {
          !val
            ? ($scope.fiveAmount[3].flag = true)
            : ($scope.fiveAmount[3].flag = false)
        }
        if (flag == $scope.fiveAmount[4].name) {
          !val
            ? ($scope.fiveAmount[4].flag = true)
            : ($scope.fiveAmount[4].flag = false)
        }

        //新加收款信息5个
        if (flag == 'monetaryAmount') {
          !val
            ? ($scope.addTypeflag.monetaryAmount = true)
            : ($scope.addTypeflag.monetaryAmount = false)
        }
        if (flag == 'transitionalAmount') {
          !val
            ? ($scope.addTypeflag.transitionalAmount = true)
            : ($scope.addTypeflag.transitionalAmount = false)
        }
        if (flag == 'relocateCompensateAmount') {
          !val
            ? ($scope.addTypeflag.relocateCompensateAmount = true)
            : ($scope.addTypeflag.relocateCompensateAmount = false)
        }
        if (flag == 'signAwardAmount') {
          !val
            ? ($scope.addTypeflag.signAwardAmount = true)
            : ($scope.addTypeflag.signAwardAmount = false)
        }
        if (flag == 'decorateCompensateAmount') {
          !val
            ? ($scope.addTypeflag.decorateCompensateAmount = true)
            : ($scope.addTypeflag.decorateCompensateAmount = false)
        }

        //添加联系人
        if (flag == 'relationPersion') {
          !val
            ? ($scope.addpresonflag.relationPersion = true)
            : ($scope.addpresonflag.relationPersion = false)
        }
        if (flag == 'relationPhone') {
          !val
            ? ($scope.addpresonflag.relationPhone = true)
            : ($scope.addpresonflag.relationPhone = false)
        }
        if (flag == 'householdRegister') {
          !val
            ? ($scope.addpresonflag.householdRegister = true)
            : ($scope.addpresonflag.householdRegister = false)
        }

        if (
          $('.bianjiselect1')
            .find('option:selected')
            .text() == '请选择'
        ) {
          if (flag == 'relationShip') {
            console.log(val)
            !val
              ? ($scope.addpresonflag.relationShip = true)
              : ($scope.addpresonflag.relationShip = false)
          }
        }

        if (
          $('.bianjiselect2')
            .find('option:selected')
            .text() == '请选择'
        ) {
          if (flag == 'decisionRelation') {
            !val
              ? ($scope.addpresonflag.decisionRelation = true)
              : ($scope.addpresonflag.decisionRelation = false)
          }
        }

        //添加业权人收款type1
        if (flag == 'InformationBank') {
          !val
            ? ($scope.addTypeflag.InformationBank = true)
            : ($scope.addTypeflag.InformationBank = false)
        }
        if (flag == 'bankNo') {
          !val
            ? ($scope.addTypeflag.bankNo = true)
            : ($scope.addTypeflag.bankNo = false)
        }

        //其它业权人收款type2
        if (flag == 'guardian') {
          !val
            ? ($scope.addTypeflag.guardian = true)
            : ($scope.addTypeflag.guardian = false)
        }

        if (flag == 'relationPhone') {
          !val
            ? ($scope.addTypeflag.relationPhone = true)
            : ($scope.addTypeflag.relationPhone = false)
          console.log($scope.addTypeflag.relationPhone)
        }
        if (flag == 'address') {
          !val
            ? ($scope.addTypeflag.address = true)
            : ($scope.addTypeflag.address = false)
        }
        if (flag == 'idCard') {
          !val
            ? ($scope.addTypeflag.idCard = true)
            : ($scope.addTypeflag.idCard = false)
        }
        //监护人代收款type3
        if (flag == 'relationShip') {
          !val
            ? ($scope.addTypeflag.relationShip = true)
            : ($scope.addTypeflag.relationShip = false)
        }

        //types4
        //监护人代收款type4
        if (flag == 'rightvals') {
          !val
            ? ($scope.addTypeflag.rightvals = true)
            : ($scope.addTypeflag.rightvals = false)
        }
      }

      //保存添加业权人
      $scope.addPersonsave = function(flag) {
        if (!$scope.saveObj.holderName) {
          $scope.saveflag.holderName = true
          return
        }
        // if(!$scope.saveObj.allocationProportion){
        //     $scope.saveflag.allocationProportion=true;
        //     return;
        // }
        if (!$scope.saveObj.houseArea) {
          $scope.saveflag.houseArea = true
          return
        }
        if (!$scope.saveObj.commerceArea) {
          $scope.saveflag.commerceArea = true
          return
        }

        if (!$scope.saveObj.industryArea) {
          $scope.saveflag.industryArea = true
          return
        }
        if (!$scope.saveObj.dormArea) {
          $scope.saveflag.dormArea = true
          return
        }

        if (!$scope.saveObj.placeOrigin) {
          $scope.saveflag.placeOrigin = true
          return
        }
        if (!$scope.saveObj.relationPerson) {
          $scope.saveflag.relationPerson = true
          return
        }
        if (!$scope.saveObj.relationPhone) {
          $scope.saveflag.relationPhone = true
          return
        }
        if (!$scope.saveObj.address) {
          $scope.saveflag.address = true
          return
        }
        if (!$scope.saveObj.permanentAddress) {
          $scope.saveflag.permanentAddress = true
          return
        }
        if (!$scope.saveObj.idCard) {
          $scope.saveflag.idCard = true
          return
        }
        if (!$scope.saveObj.placeIdentity) {
          $scope.saveflag.placeIdentity = true
          return
        }

        if ($scope.clickdisabled) {
          $scope.clickdisabled = false
          if (flag == '2') {
            server.server().zjownershipupdateSavedo(
              {
                //修改
                updateUser: createUser,
                holderId: $scope.saveObj.holderId, //物业id	是
                holderName: $scope.saveObj.holderName, //业权人姓名	是
                // allocationProportion:$scope.saveObj.allocationProportion.toString(),	        //分配比率	是
                houseArea: $scope.saveObj.houseArea, //住宅分配面积	是
                commerceArea: $scope.saveObj.commerceArea, //商业分配面积	是
                placeOrigin: $scope.saveObj.placeOrigin, //籍贯	否
                relationPerson: $scope.saveObj.relationPerson, //联系人	是
                relationPhone: $scope.saveObj.relationPhone, //联系电话	是
                address: $scope.saveObj.address, //	通讯地址	是
                idCard: $scope.saveObj.idCard, //身份证号码	是
                cardPeriod: $scope.saveObj.cardPeriod, //身份证有效期	否
                placeIdentity: $scope.saveObj.placeIdentity, //身份证签发地	否
                id: $scope.saveObj.id,
                permanentAddress: $scope.saveObj.permanentAddress, //户籍地址：
                isEffective: $scope.isEffective || 0,
                industryArea: $scope.saveObj.industryArea,
                dormArea: $scope.saveObj.dormArea
              },
              function(data) {
                if (data.result === true) {
                  $('.other').fadeOut(200)
                  setData()
                  alert('修改成功！')
                  $scope.$apply()
                }
                if (data.result == false) {
                  alert(data.message)
                }
              }
            )
          } else {
            server.server().zjownershipaddSave(
              {
                createUser: createUser,
                holderId: $scope.roomId, //物业id	是
                holderName: $scope.saveObj.holderName, //业权人姓名	是
                // allocationProportion:$scope.saveObj.allocationProportion.toString(),	        //分配比率	是
                houseArea: $scope.saveObj.houseArea, //住宅分配面积	是
                commerceArea: $scope.saveObj.commerceArea, //商业分配面积	是
                placeOrigin: $scope.saveObj.placeOrigin, //籍贯	否
                relationPerson: $scope.saveObj.relationPerson, //联系人	是
                relationPhone: $scope.saveObj.relationPhone, //联系电话	是
                address: $scope.saveObj.address, //	通讯地址	是
                idCard: $scope.saveObj.idCard, //身份证号码	是
                cardPeriod: $scope.saveObj.cardPeriod, //身份证有效期	否
                placeIdentity: $scope.saveObj.placeIdentity, //身份证签发地	否
                permanentAddress: $scope.saveObj.permanentAddress, //户籍地址：
                isEffective: $scope.isEffective || 0, //身份证type 长期1 时间是0
                industryArea: $scope.saveObj.industryArea,
                dormArea: $scope.saveObj.dormArea
              },
              function(data) {
                if (data.result === true) {
                  $('.other').fadeOut(200)
                  setData()
                  alert('添加成功！')
                  $scope.$apply()
                }
                if (data.result == false) {
                  alert(data.message)
                }
              }
            )
          }
        }
        dict.timeouts(false, $scope.clicktimeoutdata, function() {
          $scope.clickdisabled = true
          $scope.$apply()
        })
      }

      //添加业权人alert
      $scope.addovwen = function() {
        $scope.addOrUpdateTitleName = '添加业权人'
        $scope.addOrUpdatefalg = 1
        $scope.saveflag = {}
        $scope.saveObj = {}
      }
      // 编缉业权人alert
      $scope.updateOwnerAlert = function(id, indx) {
        $scope.saveObj = {}
        $scope.addOrUpdateTitleName = ' 编缉业权人'
        $scope.addOrUpdatefalg = 2
        server.server().zjownershipinitUpdatedo(
          {
            id: id
          },
          function(data) {
            if (data.result) {
              $scope.saveObj.id = data.data.id
              $scope.saveObj.holderId = data.data.holderId
              $scope.saveObj.holderName = data.data.holderName //业权人姓名	是
              // $scope.saveObj.allocationProportion=data.data.allocationProportion;	        //分配比率	是
              $scope.saveObj.houseArea = data.data.houseArea //
              $scope.saveObj.commerceArea = data.data.commerceArea //
              $scope.saveObj.placeOrigin = data.data.placeOrigin //籍贯	否
              $scope.saveObj.relationPerson = data.data.relationPerson //联系人	是
              $scope.saveObj.relationPhone = data.data.relationPhone //联系电话	是
              $scope.saveObj.address = data.data.address //	通讯地址	是
              $scope.saveObj.idCard = data.data.idCard //身份证号码	是
              $scope.saveObj.cardPeriod = data.data.cardPeriod //身份证有效期	否
              $scope.saveObj.placeIdentity = data.data.placeIdentity
              $scope.saveObj.permanentAddress = data.data.permanentAddress //户籍地址：
              $scope.saveObj.industryArea = data.data.industryArea //户籍地址：
              $scope.saveObj.dormArea = data.data.dormArea //户籍地址：
              $scope.type = $scope.isEffective = data.data.isEffective
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      //

      //取消添加业权人
      $scope.addPersoncance = function() {
        $scope.saveObj = {}
      }

      // 联系人
      $scope.addpreson = {
        relationPersion: '',
        relationPhone: '',
        householdRegister: '',
        relationShip: '',
        decisionRelation: '',
        InformationId: '',
        indxId: '',
        ownershipId: ''
      }
      //联系人falg
      $scope.addpresonflag = {
        relationPersion: false,
        relationPhone: false,
        householdRegister: false,
        relationShip: false,
        decisionRelation: false,
        ownershipId: false
      }

      //联系人弹窗
      $scope.addpresontips = function(id, indx, flag, parentId) {
        $scope.addpreson.indxId = indx
        // $scope.data[indx].makeCollectionsList=
        $scope.addpreson.InformationId = id

        $scope.parentIdbianjiIndex = parentId
        //1联系人亲属关系下拉菜单初始化化
        server.server().zjkinsfolkinitKinsfolkListdo(
          {
            propertyId: $scope.roomId
          },
          function(data) {
            if (data.result === true) {
              $scope.relation = data.data.relation
              $scope.makePolicy = data.data.makePolicy
              $scope.ownershipList = data.data.ownershipList
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )

        // 联系人编织
        if (flag === 1) {
          server.server().zjmakecollectionsinitUpdatedo(
            {
              id: id
            },
            function(data) {
              if (data.result === true) {
                $scope.addpreson.relationPersion = data.data.relationPersion
                $scope.addpreson.relationPhone = data.data.relationPhone
                $scope.addpreson.householdRegister = data.data.householdRegister
                $scope.addpreson.relationShip = data.data.relationShip
                $scope.addpreson.decisionRelation = data.data.decisionRelation
                $scope.bianjiflag = flag
                $scope.$apply()
              } else {
                alert(data.message)
              }
            },
            function(err) {
              alert(err)
            }
          )
        } else {
          $scope.addpreson.relationPersion = ''
          $scope.addpreson.relationPhone = ''
          $scope.addpreson.householdRegister = ''
          $scope.addpreson.relationShip = ''
          $scope.addpreson.decisionRelation = ''
          $scope.bianjiflag = ''
        }
      }

      // 添加联系人
      $scope.AddContact = function(id, parentindx) {
        if ($scope.types == 2) {
          if (!$scope.addpreson.relationPersion) {
            $scope.addpresonflag.relationPersion = true
            return
          }
          if (!$scope.addpreson.relationPhone) {
            $scope.addpresonflag.relationPhone = true
            return
          }
          if (!$scope.addpreson.householdRegister) {
            $scope.addpresonflag.householdRegister = true
            return
          }
        }

        //select
        if (
          $('.bianjiselect1')
            .find('option:selected')
            .text() == '请选择'
        ) {
          if (!$scope.addpreson.relationShip) {
            $scope.addpresonflag.relationShip = true
            return
          } else {
            $scope.addpresonflag.relationShip = false
          }
        }
        if (
          $('.bianjiselect2')
            .find('option:selected')
            .text() == '请选择'
        ) {
          if (!$scope.addpreson.decisionRelation) {
            $scope.addpresonflag.decisionRelation = true
            return
          } else {
            $scope.addpresonflag.decisionRelation = false
          }
        }
        if ($scope.bianjiflag) {
          zjmakecollectionsupdateSavedo($scope.addpreson, parentindx)
        } else {
          zjmakecollectionsaddSave($scope.addpreson)
        }
      }

      $scope.types = '1'
      $scope.radiosowne = function(val) {
        console.log(val)
        if (val == 1) {
          $scope.addpreson.decisionRelation = ''
          $scope.addpreson.relationPersion = ''
          $scope.addpreson.relationPhone = ''
        } else {
          $scope.addpreson.ownershipId = ''
        }
      }

      $scope.xialayequan = function(val) {}

      //添加成功
      function zjmakecollectionsaddSave(addpreson) {
        server.server().zjmakecollectionsaddSave(
          {
            createUser: createUser,
            InformationId: addpreson.InformationId, //业权人id	是
            relationPersion: addpreson.relationPersion, //联系人姓名	是
            relationPhone: addpreson.relationPhone, //联系电话	是
            householdRegister: addpreson.householdRegister, //户籍	否
            relationShip: addpreson.relationShip, //亲属关系	否
            decisionRelation: addpreson.decisionRelation, //决策关系	否
            type: $scope.types,
            ownershipId: $scope.addpreson.ownershipId,
            propertyId: $scope.roomId
          },
          function(data) {
            if (data.result === true) {
              $('.supperme').hide()
              $scope.addpreson.relationPersion = '' //联系人姓名	是
              $scope.addpreson.relationPhone = '' //联系电话	是
              $scope.addpreson.householdRegister = '' //户籍	否
              $scope.addpreson.relationShip = '' //户籍	否
              $scope.addpreson.decisionRelation = '' //户籍	否
              alert('添加联系人成功!', function() {
                setData()
              })
              $scope.$apply()
            }
            if (data.result === false) {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }

      //编辑成功
      function zjmakecollectionsupdateSavedo(addpreson, parentindx) {
        server.server().zjmakecollectionsupdateSavedo(
          {
            id: addpreson.InformationId, //	当前数据id	是
            relationPersion: addpreson.relationPersion, //	联系人姓名	是
            relationPhone: addpreson.relationPhone, //	联系电话	是
            householdRegister: addpreson.householdRegister, //	户籍	否
            relationShip: addpreson.relationShip, //	亲属关系	否
            decisionRelation: addpreson.decisionRelation, //	决策关系	否
            InformationId: $scope.data[parentindx].id, //	业权人id	是
            updateUser: createUser //	  用户id	是
          },
          function(data) {
            if (data.result === true) {
              $('.supperme').hide()
              $scope.addType = {}
              $scope.addpreson.relationPersion = ''
              $scope.addpreson.relationPhone = ''
              $scope.addpreson.householdRegister = ''
              $scope.addpreson.relationShip = ''
              $scope.addpreson.decisionRelation = ''
              alert('修改联系人成功!', function() {
                setData()
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }

      $scope.delectsrecieve = function(id, indx, flag) {
        confirm('确认删除该条收款信息吗？', function() {
          //删除业权人
          server.server().zjmakerecievedeleteById(
            {
              id: id,
              updateUser: createUser
            },
            function(data) {
              if (data.result === true) {
                setData()
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
      }

      //delects删除业权人
      $scope.delects = function(id, indx, flag, parentIndx) {
        if (flag === 2) {
          confirm('确认删除该条业权人吗？', function() {
            //删除业权人
            server.server().zjownershipdeleteByIddo(
              {
                id: id
              },
              function(data) {
                if (data.result === true) {
                  $scope.data.splice(indx, 1)
                  $scope.$apply()
                  setData()
                } else {
                  alert(data.message)
                }
              }
            )
          })
        } else {
          confirm('确认删除该条联系人吗？', function() {
            //删除联系人
            server.server().zjmakecollectionsdeleteByIddo(
              {
                id: id
              },
              function(data) {
                if (data.result === true) {
                  $scope.data[parentIndx].makeCollectionsList.splice(indx, 1)
                  $scope.$apply()
                  setData()
                } else {
                  alert(data.message)
                }
              }
            )
          })
        }
      }

      //4个添加方试
      function type4(addType, type, ownershipId, level) {
        // 新增五个
        if (!$scope.addType.monetaryAmount) {
          $scope.addTypeflag.monetaryAmount = true
          return
        }
        if (!$scope.addType.transitionalAmount) {
          $scope.addTypeflag.transitionalAmount = true
          return
        }
        if (!$scope.addType.relocateCompensateAmount) {
          $scope.addTypeflag.relocateCompensateAmount = true
          return
        }
        if (!$scope.addType.signAwardAmount) {
          $scope.addTypeflag.signAwardAmount = true
          return
        }
        if (!$scope.addType.decorateCompensateAmount) {
          $scope.addTypeflag.decorateCompensateAmount = true
          return
        }
        if (!$scope.fiveAmount[0].val) {
          $scope.fiveAmount[0].flag = true
          return
        }
        if (!$scope.fiveAmount[1].val) {
          $scope.fiveAmount[1].flag = true
          return
        }
        if (!$scope.fiveAmount[2].val) {
          $scope.fiveAmount[2].flag = true
          return
        }
        if (!$scope.fiveAmount[3].val) {
          $scope.fiveAmount[3].flag = true
          return
        }
        if (!$scope.fiveAmount[4].val) {
          $scope.fiveAmount[4].flag = true
          return
        }

        if ($scope.addFlag) {
          server.server().zjmakerecieveaddRecieveWaydo(
            {
              createUser: createUser,
              ownershipId: ownershipId, //	业权人id	是
              recieveType: type, //	收款方式	是	1表示业权人收款，2其他人代收，3监护人代收 4其他业权人代收
              InformationBank: addType.InformationBank
                ? addType.InformationBank
                : '', //	付款银行	是
              bankNo: addType.bankNo ? addType.bankNo : '', //	银行账号	是
              recievePerson: addType.guardian ? addType.guardian : '', //	代收人姓名	是
              relationPhone: addType.relationPhone ? addType.relationPhone : '', //	联系电话	否
              address: addType.address ? addType.address : '', //	通讯地址	否
              idCard: addType.idCard ? addType.idCard : '', //	身份证号码	是
              relationShip: addType.relationShip ? addType.relationShip : '', //	关系	否
              agencyFundForm: level || '', //	代收形式	是	1表示代关联人收款 2关联人代业权人收款
              agencyFundId: addType.agencyFundId ? addType.agencyFundId : '', //数组字符串
              recieveGuardian: addType.recieveGuardian
                ? addType.recieveGuardian
                : '',
              // 新增五个
              monetaryAmount: addType.monetaryAmount
                ? addType.monetaryAmount
                : '',
              transitionalAmount: addType.transitionalAmount
                ? addType.transitionalAmount
                : '',
              relocateCompensateAmount: addType.relocateCompensateAmount
                ? addType.relocateCompensateAmount
                : '',
              signAwardAmount: addType.signAwardAmount
                ? addType.signAwardAmount
                : '',
              decorateCompensateAmount: addType.decorateCompensateAmount
                ? addType.decorateCompensateAmount
                : '',
              //you ta ma de 新增五个
              oneStageAmount: $scope.fiveAmount[0].val || '',
              towStageAmount: $scope.fiveAmount[1].val || '',
              threeStageAmount: $scope.fiveAmount[2].val || '',
              temporaryAmount: $scope.fiveAmount[3].val || '',
              certificatesHandlingAmount: $scope.fiveAmount[4].val || ''
            },
            function(data) {
              if (data.result === true) {
                $('.dialog').hide()
                $scope.addType = {}
                $scope.rightvals = []
                $scope.rightvalsId = []
                $scope.fiveAmount.forEach(function(item, index) {
                  item.val = ''
                })
                setData()
                alert(data.message)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            },
            function(err) {
              alert(err)
            }
          )
        } else {
          server.server().zjmakerecieveaddRecieveWaydoEdit(
            {
              //编缉
              updateUser: createUser,
              ownershipId: ownershipId, //	业权人id	是
              recieveType: type, //	收款方式	是	1表示业权人收款，2其他人代收，3监护人代收 4其他业权人代收
              InformationBank: addType.InformationBank
                ? addType.InformationBank
                : '', //	付款银行	是
              bankNo: addType.bankNo ? addType.bankNo : '', //	银行账号	是
              recievePerson: addType.guardian ? addType.guardian : '', //	代收人姓名	是
              relationPhone: addType.relationPhone ? addType.relationPhone : '', //	联系电话	否
              address: addType.address ? addType.address : '', //	通讯地址	否
              idCard: addType.idCard ? addType.idCard : '', //	身份证号码	是
              relationShip: addType.relationShip ? addType.relationShip : '', //	关系	否
              agencyFundForm: level || 1, //	代收形式	是	1表示代关联人收款 2关联人代业权人收款
              agencyFundId: addType.agencyFundId ? addType.agencyFundId : '', //数组字符串
              id: $scope.recieveId,
              // 新增五个
              monetaryAmount: addType.monetaryAmount
                ? addType.monetaryAmount
                : '',
              transitionalAmount: addType.transitionalAmount
                ? addType.transitionalAmount
                : '',
              relocateCompensateAmount: addType.relocateCompensateAmount
                ? addType.relocateCompensateAmount
                : '',
              signAwardAmount: addType.signAwardAmount
                ? addType.signAwardAmount
                : '',
              decorateCompensateAmount: addType.decorateCompensateAmount
                ? addType.decorateCompensateAmount
                : '',
              //you ta ma de 新增五个
              oneStageAmount: $scope.fiveAmount[0].val || '',
              towStageAmount: $scope.fiveAmount[1].val || '',
              threeStageAmount: $scope.fiveAmount[2].val || '',
              temporaryAmount: $scope.fiveAmount[3].val || '',
              certificatesHandlingAmount: $scope.fiveAmount[4].val || ''
            },
            function(data) {
              if (data.result === true) {
                $('.dialog').hide()
                ;($scope.addType.InformationBank = ''),
                  ($scope.addType.bankNo = ''),
                  ($scope.addType.guardian = ''), //  //	代收人姓名	是
                  ($scope.addType.relationPhone = ''), //            //	联系电话	否
                  ($scope.addType.address = ''), ////	通讯地址	否
                  ($scope.addType.idCard = ''), //	身份证号码	是
                  ($scope.addType.relationShip = ''), //          //	关系	否
                  ($scope.addType.agencyFundForm = '') //
                $scope.addType.agencyFundId = '' //
                // $scope.rightvals=[];
                // $scope.rightvalsId = [];
                $scope.fiveAmount.forEach(function(item, index) {
                  item.val = ''
                })
                setData()
                alert(data.message)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            },
            function(err) {
              alert(err)
            }
          )
        }
      }

      //添加业权人收款方式
      $scope.addType = {
        InformationBank: '',
        bankNo: '',
        guardian: '', //  //	代收人姓名	是
        relationPhone: '', //            //	联系电话	否
        address: '', ////	通讯地址	否
        idCard: '', //	身份证号码	是
        relationShip: '', //          //	关系	否
        agencyFundForm: '', //
        agencyFundId: '', //字符串总拼接
        person: '',

        monetaryAmount: '',
        transitionalAmount: '',
        relocateCompensateAmount: '',
        signAwardAmount: '',
        decorateCompensateAmount: ''
      }
      $scope.addTypeflag = {
        InformationBank: false,
        bankNo: false,
        guardian: false,
        relationPhone: false,
        address: false,
        idCard: false,
        relationShip: false,
        agencyFundForm: false,
        relevanceOwner: false,
        rightvals: false,

        monetaryAmount: false,
        transitionalAmount: false,
        relocateCompensateAmount: false,
        signAwardAmount: false,
        decorateCompensateAmount: false
      }

      //编辑收款信息 id拿到业权人ID
      $scope.editmoneyInformation = function(item, flag) {
        $scope.ownershipId = item.id
        $scope.isType = item.isType
        $scope.recieveId = item.recieveId //编缉id
        $scope.addFlag = flag
        if (!flag) {
          server.server().zjmakerecievequeryRecieveInfodo(
            {
              id: item.recieveId
            },
            function(data) {
              if (data.result === true) {
                $scope.addType.InformationBank = data.data.InformationBank
                $scope.addType.bankNo = data.data.bankNo
                $scope.addType.guardian = data.data.recievePerson
                $scope.addType.relationPhone = data.data.relationPhone
                $scope.addType.idCard = data.data.idCard
                $scope.addType.address = data.data.address
                $scope.addType.relationShip = data.data.relationShip

                $scope.addType.monetaryAmount = data.data.monetaryAmount
                $scope.addType.transitionalAmount = data.data.transitionalAmount
                $scope.addType.relocateCompensateAmount =
                  data.data.relocateCompensateAmount
                $scope.addType.signAwardAmount = data.data.signAwardAmount
                $scope.addType.decorateCompensateAmount =
                  data.data.decorateCompensateAmount

                // you ta ma de xin zen 5 ge
                $scope.fiveAmount[0].val = data.data.oneStageAmount
                $scope.fiveAmount[1].val = data.data.towStageAmount
                $scope.fiveAmount[2].val = data.data.threeStageAmount
                $scope.fiveAmount[3].val = data.data.temporaryAmount
                $scope.fiveAmount[4].val = data.data.certificatesHandlingAmount

                $scope.level = data.data.agencyFundForm || 1
                $scope.addType.agencyFundId = data.data.agencyFundId
                // if(data.data.recieveType=='4' && data.data.relevanceList){
                //     for(var j = 0;j<data.data.relevanceList.length;j++){
                //         $scope.rightvalsId[j]={ownershipId:data.data.relevanceList[j].relevanceOwnershipId};
                //         $scope.rightvals[j]={id:data.data.relevanceList[j].relevanceOwnershipId};
                //         $scope.rightvals[j]={holderName:data.data.relevanceList[j].holderName};
                //     }
                //     $scope.addType.relevanceOwner=JSON.stringify($scope.rightvalsId);
                // }

                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }

        if (!flag) {
          //编缉
          // $scope.addType=item;
          if ($scope.isType == 1) {
            $('.hopmainopen').dialog()
          } else if ($scope.isType == 2) {
            $('.otherhopmainopen').dialog()
          } else if ($scope.isType == 3) {
            $('.guardianhopmainopen').dialog()
          } else if ($scope.isType == 4) {
            $scope.fouraboustAsmoney($scope.ownershipId, 1)
          }
        } else {
          //添加
          $scope.addType = {}
          $scope.addTypeflag = {}
          $scope.rightvals = []
          $scope.rightvalsId = []
          $scope.fiveAmount.forEach(function(item, list) {
            item.val = ''
          })
        }
      }

      //

      //业权人收款type1
      $scope.moneysave = function(ownershipId, type) {
        console.log()
        if (!$scope.addType.InformationBank) {
          $scope.addTypeflag.InformationBank = true
          return
        }
        if (!$scope.addType.bankNo) {
          $scope.addTypeflag.bankNo = true
          return
        }

        type4($scope.addType, type, ownershipId)
      }

      //其它业权人收款type2
      $scope.moneysave2 = function(ownershipId, type) {
        if (!$scope.addType.guardian) {
          $scope.addTypeflag.guardian = true
          return
        }
        if (!$scope.addType.relationPhone) {
          $scope.addTypeflag.relationPhone = true
          return
        }
        if (!$scope.addType.address) {
          $scope.addTypeflag.address = true
          return
        }
        if (!$scope.addType.idCard) {
          $scope.addTypeflag.idCard = true
          return
        }

        if (!$scope.addType.InformationBank) {
          $scope.addTypeflag.InformationBank = true
          return
        }
        if (!$scope.addType.bankNo) {
          $scope.addTypeflag.bankNo = true
          return
        }
        type4($scope.addType, type, ownershipId)
      }

      //监护人代收款type3
      $scope.moneysave3 = function(ownershipId, type) {
        if (!$scope.addType.guardian) {
          $scope.addTypeflag.guardian = true
          return
        }
        if (!$scope.addType.relationShip) {
          $scope.addTypeflag.relationShip = true
          return
        }
        if (!$scope.addType.relationPhone) {
          $scope.addTypeflag.relationPhone = true
          return
        }
        if (!$scope.addType.address) {
          $scope.addTypeflag.address = true
          return
        }
        if (!$scope.addType.idCard) {
          $scope.addTypeflag.idCard = true
          return
        }

        if (!$scope.addType.InformationBank) {
          $scope.addTypeflag.InformationBank = true
          return
        }
        if (!$scope.addType.bankNo) {
          $scope.addTypeflag.bankNo = true
          return
        }
        type4($scope.addType, type, ownershipId)
      }

      //type4
      $scope.level = 1

      ////关联其他业权人初始化下拉选择接口
      $scope.fouraboustAsmoney = function(ownershipId, flag) {
        //1.	关联其他业权收款信息新增初始化
        server.server().zjmakerecieveinitAdddo(
          {
            roomId: $scope.roomId, //物业id	是
            ownershipId: ownershipId //当前业权人id	是
          },
          function(data) {
            if (data.result === true) {
              $scope.ablutePreson = data.data
              $scope.$apply()
              $('.h-luohui').dialog()
            } else {
              confirm(data.message, function() {
                $('.h-luohui').dialog()
              })
            }
          }
        )
      }

      // $scope.rightvals=[];  //右边的框id,name
      // $scope.rightvalsId = [];
      // $scope.ablutePresonselect=function(val){
      //     if(val){
      //         $scope.rightvals.push(val)
      //         // $scope.rightvalsId.push(val.id)
      //         for(var i = 0;i< $scope.ablutePreson.length;i++){
      //             if(val.id==$scope.ablutePreson[i].id){
      //                 $scope.ablutePreson.splice(i,1)
      //             }
      //         }
      //     }
      //     for(var j = 0;j<$scope.rightvals.length;j++){
      //         $scope.rightvalsId[j]={ownershipId:$scope.rightvals[j].id};
      //     }
      //     $scope.addType.relevanceOwner = JSON.stringify($scope.rightvalsId);

      // }
      //去除seleect东西
      // $scope.ablutePresonselectjian=function(val,rightvals){
      //     if(rightvals.length>0){
      //         $scope.ablutePreson.push($scope.rightvals[$scope.rightvals.length-1]);
      //         $scope.rightvals.pop();
      //     }

      // }

      // $scope.levels=function(val){
      //     $scope.level = val;
      // }

      //关联其他业权人收款保存
      $scope.moneysave4 = function(ownershipId, type) {
        // if($scope.rightvals.length<=0){
        //     $scope.addTypeflag.rightvals=true;
        //     return
        // }
        // if(!$scope.addType.InformationBank){
        //     $scope.addTypeflag.InformationBank=true;
        //     return
        // }
        // if(!$scope.addType.bankNo){
        //     $scope.addTypeflag.bankNo=true;
        //     return
        // }
        if (!$scope.addType.agencyFundId) {
          $scope.addTypeflag.rightvals = true
          return
        }
        type4($scope.addType, type, ownershipId, $scope.level)
      }
    }
  ])
  // <!--业权人_收款方式（合同管理）-->
  .controller('ContractManagementContractManagementCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    function($http, $scope, server, dict) {
      //已做
    }
  ])
  // <!--关联物业（物业管理）-->
  .controller('LostPropertyManagementPropertyManagementCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {
      $scope.no = '/'
      $scope.nothingTips = false
      $scope.roomId = $state.params.roomId
      $scope.projectId = $state.params.projectid
      var userId = server.server().userId

      //已关联数据

      //关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 跟进跟踪
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }

      $scope.action = {}
      $scope.dataFollowUp = function(roomIdss) {
        $scope.action.reset(roomIdss)
      }

      //跟进页面刷新
      $scope.myajax = function() {
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
      }
      //跟进页面跳转
      $scope.mylocation = function() {
        // $state.go('propertyDetail',{projectid:$scope.projectId,roomId:$scope.roomId})
      }

      setData()
      function setData() {
        server.server().zjrelatedlistdo(
          {
            roomId: $scope.roomId
          },
          function(data) {
            if (data.result === true) {
              $scope.datas = data.data
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
      //删除
      $scope.dataDelete = function(id, indx) {
        confirm('确认删除吗？', function() {
          server.server().zjrelateddeleteByIddo(
            {
              id: id
            },
            function(data) {
              if (data.result === true) {
                setData()
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
      }

      //搜索按钮副代表
      function zjroomsearchForConditiondo() {
        server.server().zjroomsearchForConditiondo(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              $scope.dataCheckbox = data.data
              for (var i = 0; i < $scope.dataCheckbox.length; i++) {
                $scope.dataCheckbox[i].state = false
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //分页
      $scope.conf = {
        total: 10, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      $scope.searchKeys = ''
      $scope.$watch('conf.currentPage + conf.itemPageLimit', function(news) {
        zjroompropertyListdo($scope.selected.join(','), $scope.conf.currentPage)
      })
      //分页结束

      $scope.selected = []
      $scope.selectAll = true
      // 单选
      $scope.updateSelection = function(eve, id, state) {
        var checkbox = eve.target
        var checked = checkbox.checked
        if (checked) {
          $scope.selected.push(id)
        } else {
          var idx = $scope.selected.indexOf(id)
          $scope.selected.splice(idx, 1)
        }
        //子元素一个都没选，就选则全部                        //选中单个后，取消全选，
        $scope.selected.length === 0
          ? ($scope.selectAll = true)
          : ($scope.selectAll = false)
        zjroompropertyListdo($scope.selected.join(','), $scope.conf.currentPage)
      }

      //全选
      $scope.checkobxAll = function(m, n) {
        //取消全选，如果子元素都求没有选则，就不能取消全选
        if (m === false) {
          if ($scope.selected.length === 0) {
            $scope.selectAll = true
          }
        }
        //全选后数组空，子元素取消选则
        if (m === true) {
          $scope.selected = []
          for (var i = 0; i < $scope.dataCheckbox.length; i++) {
            $scope.dataCheckbox[i].state = false
          }
        }
        zjroompropertyListdo($scope.selected.join(','), $scope.conf.currentPage)
      }

      function useidliss(romId) {
        server.server().zjrelatedqueryRelevancePropertydo(
          {
            roomId: romId
          },
          function(data) {
            if (data.result === true) {
              $scope.datauseid = data.data
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      $scope.searchInput = function() {
        zjroompropertyListdo($scope.selected.join(','), $scope.conf.currentPage)
      }

      //获取关联数据弹窗的
      function zjroompropertyListdo(schemaId, pageCount, flag) {
        server.server().zjroompropertyListdo(
          {
            projectId: $scope.projectId,
            searchKeys: $scope.searchKeys,
            schemaId: schemaId ? schemaId : '', //搜索id
            pageNo: pageCount ? pageCount : 1, //当前页娄
            pageSize: 8,
            roomId: $scope.roomId
          },
          function(data) {
            if (data.result === true) {
              $scope.rows = data.data.rows

              useidliss($scope.roomId)
              let number = $scope.datauseid ? $scope.datauseid.length : 0
              for (var i = 0; i < $scope.rows.length; i++) {
                $scope.rows[i].state = false
                if ($scope.datauseid && $scope.datauseid.length > 0) {
                  for (var j = 0; j < number; j++) {
                    if ($scope.rows[i].id == $scope.datauseid[j]) {
                      $scope.rows.splice(i, 1)
                      $scope.flags = true
                      break
                    }
                  }
                }
              }
              if ($scope.flags && $scope.rows.length <= 0) {
                $scope.conf.currentPage++
                zjroompropertyListdo(
                  $scope.selected.join(','),
                  $scope.conf.currentPage
                )
              }
              //共多少页
              $scope.conf.total = Math.ceil(
                (data.data.total - number) / data.data.pageSize
              )
              //共有多少条数据
              $scope.conf.counts = data.data.total - number
              $scope.$broadcast('categoryLoaded')
              $scope.$apply()
              if ($scope.rows && flag) {
                setTimeout(function() {
                  $('.letbox').dialog()
                }, 20)
              }
            } else {
              alert(data.message)
            }
          }
        )
      }
      // zjroompropertyListdo('',1)
      // 查询已关连id;

      //显示弹窗
      $scope.showBox = function() {
        zjroomsearchForConditiondo()
        zjroompropertyListdo('', '', true)
      }
      //保存成功
      function zjrelatedaddSavedo(relatedRoomId) {
        server.server().zjrelatedaddSavedo(
          {
            userId: userId,
            roomId: $scope.roomId,
            relatedRoomId: relatedRoomId,
            remaker: $scope.noteText
          },
          function(data) {
            if (data.result === true) {
              //保存成功
              $('.letbox').hide(200)
              alert(data.message, function() {
                $scope.noteText = ''
                setData()
                $scope.$apply()
              })
            } else {
              alert(data.message)
            }
          }
        )
      }
      //下面列表
      $scope.childSelected = [] //压入数据
      $scope.childSelectAll = false //全选model
      //全选
      $scope.childCheckobxAll = function(m) {
        $scope.childSelected = []
        if (m === true) {
          for (var i = 0; i < $scope.rows.length; i++) {
            $scope.rows[i].state = true
            $scope.childSelected.push($scope.rows[i].id)
          }
        } else {
          for (var j = 0; j < $scope.rows.length; j++) {
            $scope.rows[j].state = false
          }
          $scope.childSelected = []
        }
        return $scope.childSelected
      }
      //单选
      $scope.childUpdateSelection = function(eve, id, state) {
        var checkbox = eve.target
        var checked = checkbox.checked
        if (checked) {
          $scope.childSelected.push(id)
        } else {
          var idx = $scope.childSelected.indexOf(id)
          $scope.childSelected.splice(idx, 1)
        }
        if ($scope.childSelected.length < $scope.rows.length) {
          $scope.childSelectAll = false
        } else {
          $scope.childSelectAll = true
        }
      }

      //保存
      $scope.save = function() {
        $('.letbox').fadeOut(200)
        $('.notealert').dialog()
      }

      $scope.notevalue = function(val) {
        // if(!val){alert('请输入描述信息');return;}else{
        $('.notealert').fadeOut()
        zjrelatedaddSavedo($scope.childSelected.join(','))

        // }
      }
    }
  ])
  // <!--基本信息 物业管理-->
  .controller('BasicInformationPropertyManagementCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    '$rootScope',
    function($http, $scope, server, $state, dict, $rootScope) {
      $scope.projectId = $state.params.projectid
      $scope.submitTime = {}
      $scope.roomId = $state.params.roomId
      let userId = server.server().userId
      var roomId = $state.params.roomId
      var propertyId = $state.params.roomId
      var cause = ''
      var type = ''
      $scope.no = '/'

      var createUser = server.server().userId
      //关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId, //1是项目id 2是物业id
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业

        // 跟进跟踪
      }
      $scope.listtop = {
        projectId: $state.params.projectid,
        roomId: $state.params.roomId,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
      server.server().zjprojectdeleteById(
        {
          id: $scope.projectId,
          userId: userId
        },
        data => {
          if (data.result === true) {
            if (data.data.project) {
              $scope.project2 = data.data.project

              $scope.$apply()
              // resolve(data.data.project)
            } else {
              alert(data.message)
            }
          } else {
            alert(data.message)
          }
        }
      )

      // 发起任务
      //input单选获取
      server.server().zjtaskinitOrderSignNodedo({}, data => {
        if (data.result) {
          $scope.initOrder = data.data

          $scope.$apply()
        } else {
          alert(data.message)
        }
      })
      //star时间筛选
      function runAsync1(inputval, boxval, flag, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.beginTime = value
            if (flag) {
              callback(value)
            }
          }
        })
      }
      //end时间筛选
      function runAsync2(inputval, boxval, stardata, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            callback(value)
          }
        })
      }
      $scope.regCreatetaskist = function(sub, list) {
        $scope.add.parentOption = list.orderSignId
        $scope.parentOption = list.name
        if (sub) {
          $scope.add.childOption = sub.orderSignId
          $scope.childOption = sub.name
        }
        $scope.registFlag = 1
        $scope.add.peopel = ''
        $scope.peopelArr = ''
        $scope.personArr = ''
        $scope.add.person = ''
        $scope.add.date = ''
        $scope.add.things = ''
        choooseArr = []
        $('.addchildData1').val('')
        $('.h-liebiaoone').dialog()
        $scope.bodyDataArr.forEach((item, i) => {
          $scope.bodyDataArr[i].clickClass = false
        })
        console.log($scope.bodyDataArr)
      }

      //
      $scope.add = {
        peopel: '', //peopel input 人
        person: '', //peopel input 人
        parentOption: '', //select parent
        childOption: '', //select child
        date: '', //选择时间
        things: '' //事件
      } //名字
      $scope.peopelArr = '' //peopel id数组
      $scope.personArr = '' //peopel id数组
      $scope.dimArrFlag = false //模糊ul显示
      $scope.personarrFlag = false //模糊ul显示

      $scope.addflag = {
        peopel: false, //警告提示
        person: false, //指派人
        select: false,
        things: false
      }

      // 模糊输入ajax
      function initAdddo(param) {
        $scope.dimArr = []
        var p = new Promise((resolve, reject) => {
          server.server().zjtaskqueryRoomNamedo(
            {
              param: param,
              projectId: $scope.projectId
            },
            data => {
              if (data.result) {
                $scope.dimArr = data.data
                resolve(data.data)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }
      //被指派的人
      function UserNamedo(param) {
        $scope.personarr = []
        var p = new Promise((resolve, reject) => {
          server.server().zjtaskqueryUserNamedo(
            {
              realname: param
            },
            data => {
              if (data.result) {
                $scope.personarr = data.data
                resolve(data.data)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }

      //获取焦点事件
      $scope.addfocus = function(val, flag) {
        !flag
          ? (initAdddo(val).then(function(data) {
              data.length > 0
                ? ($scope.dimArrFlag = true)
                : ($scope.dimArrFlag = false)
              $scope.addflag.peopel = false
              $scope.$apply()
            }),
            ($scope.addflag.peopel = false))
          : UserNamedo(val).then(function(data) {
              data.length > 0
                ? ($scope.personarrFlag = true)
                : ($scope.personarrFlag = false)
              $scope.addflag.person = false
              $scope.$apply()
            })
      }

      //失去焦点
      $scope.addblur = function(val, flag) {
        if (flag) {
          setTimeout(function() {
            $scope.personarrFlag = false
            !$scope.add.person
              ? ($scope.addflag.person = true)
              : ($scope.addflag.person = false)
            $scope.$apply()
          }, 200)
        } else {
          setTimeout(function() {
            $scope.dimArrFlag = false
            !$scope.add.peopel
              ? ($scope.addflag.peopel = true)
              : ($scope.addflag.peopel = false)
            $scope.$apply()
          }, 200)
        }
      }

      // 模糊输入
      $scope.addchange = function(val, flag) {
        flag
          ? (UserNamedo(val).then(function(data) {
              data.length > 0
                ? ($scope.personarrFlag = true)
                : ($scope.personarrFlag = false)
              $scope.$apply()
            }),
            ($scope.addflag.person = false))
          : (initAdddo(val).then(function(data) {
              data.length > 0
                ? ($scope.dimArrFlag = true)
                : ($scope.dimArrFlag = false)
              $scope.$apply()
            }),
            ($scope.addflag.peopel = false))
      }
      //点击选择
      $scope.alertliAdd = function(ind, flag) {
        !flag
          ? (($scope.add.peopel = $scope.dimArr[ind].splitJointName),
            ($scope.peopelArr = $scope.dimArr[ind].id))
          : (($scope.add.person = $scope.personarr[ind].realname),
            ($scope.personArr = $scope.personarr[ind].id))
      }

      //事件blur事件
      $scope.addsBlur = function(val) {
        !val ? ($scope.addflag.things = true) : ($scope.addflag.things = false)
      }

      // 时间选择
      $scope.adddate = function(child, parent) {
        runAsync1(child, parent, 2, function(val) {
          $scope.add.date = val
          BuyUseTime($scope.add.person, val)
          $scope.$apply()
        })
      }

      $scope.bodyDataArr = [
        { id: 8, name: '08:00', flagClass: false, msg: '', clickClass: false },
        { id: 9, name: '09:00', flagClass: false, msg: '', clickClass: false },
        { id: 10, name: '10:00', flagClass: false, msg: '', clickClass: false },
        { id: 11, name: '11:00', flagClass: false, msg: '', clickClass: false },
        { id: 12, name: '12:00', flagClass: false, msg: '', clickClass: false },
        { id: 13, name: '13:00', flagClass: false, msg: '', clickClass: false },
        { id: 14, name: '14:00', flagClass: false, msg: '', clickClass: false },
        { id: 15, name: '15:00', flagClass: false, msg: '', clickClass: false },
        { id: 16, name: '16:00', flagClass: false, msg: '', clickClass: false },
        { id: 17, name: '17:00', flagClass: false, msg: '', clickClass: false },
        { id: 18, name: '18:00', flagClass: false, msg: '', clickClass: false },
        { id: 19, name: '19:00', flagClass: false, msg: '', clickClass: false },
        { id: 20, name: '20:00', flagClass: false, msg: '', clickClass: false }
      ]

      //点击时间添加任务
      let choooseArr = []

      //任务发起查询占用时间
      function BuyUseTime(userId, val) {
        $scope.threeshowArr = []
        choooseArr = []
        $scope.bodyDataArr.forEach((item, i) => {
          $scope.bodyDataArr[i].clickClass = false
        })
        server.server().zjtaskqueryUserInfoByUserIddo(
          {
            userId: server.server().userId,
            time: val
          },
          data => {
            if (data.result) {
              $scope.taskquery = data.data
              if ($scope.taskquery) {
                $scope.yearmonthdata = dict.timeConverter3(
                  $scope.taskquery[0].startTime,
                  1
                )

                for (var i = 0; i < $scope.taskquery.length; i++) {
                  $scope.taskquery[i].startTime = dict.timeConverter3(
                    $scope.taskquery[i].startTime
                  )
                  $scope.taskquery[i].endTime = dict.timeConverter3(
                    $scope.taskquery[i].endTime
                  )
                  for (
                    var Q = $scope.taskquery[i].startTime;
                    Q < $scope.taskquery[i].endTime + 1;
                    Q++
                  ) {
                    $scope.threeshowArr.push(Q)
                  }
                }

                for (var j = 0; j < $scope.bodyDataArr.length; j++) {
                  for (var k = 0; k < $scope.threeshowArr.length; k++) {
                    if ($scope.bodyDataArr[j].id === $scope.threeshowArr[k]) {
                      $scope.bodyDataArr[j].flagClass = true
                    }
                  }
                }
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //数组删除指定元素
      Array.prototype.removeByValue = function(val) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == val) {
            this.splice(i, 1)
            break
          }
        }
      }
      //sort排序
      function sortfunc(a, b) {
        return a - b
      }

      $scope.datachoose = function(indx) {
        if ($scope.bodyDataArr[indx].flagClass === false) {
          $scope.bodyDataArr[indx].clickClass = !$scope.bodyDataArr[indx]
            .clickClass //true
          if ($scope.bodyDataArr[indx].clickClass === true) {
            choooseArr.push(indx)
          } else {
            choooseArr.removeByValue(indx)
          }
          if (choooseArr.length >= 2) {
            choooseArr = choooseArr.sort(sortfunc)
            for (
              var i = choooseArr[0];
              i < choooseArr[choooseArr.length - 1] + 1;
              i++
            ) {
              if ($scope.bodyDataArr[i].flagClass === true) {
                $scope.bodyDataArr[indx].clickClass = false
                choooseArr.pop()
                return
              }
              $scope.bodyDataArr[i].clickClass = true
            }
          }
        }
      }

      //发布
      $scope.addsave = function(indx, flag) {
        if (flag === 2) {
          if (!$scope.add.person) {
            $scope.addflag.person = true
            return
          } else {
            $scope.addflag.person = false
          }
          if (!$scope.add.date) {
            alert('请选择指派时间！')
            return
          } else {
            $scope.addflag.date = false
          }

          if (choooseArr.length <= 0) {
            alert('请选择可用时间段！')
            return
          } else {
            $scope.startDate =
              $scope.add.date + ' ' + $scope.bodyDataArr[choooseArr[0]].name
            $scope.endDate =
              $scope.add.date +
              ' ' +
              $scope.bodyDataArr[choooseArr[choooseArr.length - 1]].name
          }

          if (!$scope.add.things) {
            $scope.addflag.things = true
            return
          } else {
            $scope.addflag.things = false
          }

          server.server().zjtaskupdateTaskdo(
            {
              toUser: $scope.add.person, //指派给
              startDate: $scope.startDate, //开始时间
              endDate: $scope.endDate, //结束时间
              eventDesc: $scope.add.things, //事件说明
              userId: $scope.personArr, //指派人id
              id: $scope.rows[indx].id //创建人id
            },
            data => {
              data.result
                ? ($('.h-liebiaoone').fadeOut(200),
                  ($scope.add.peopel = ''),
                  ($scope.peopelArr = ''),
                  ($scope.add.childOption = ''),
                  ($scope.add.parentOption = ''),
                  ($scope.personArr = ''),
                  ($scope.add.person = ''),
                  ($scope.add.date = ''),
                  ($scope.add.things = ''),
                  (choooseArr = []),
                  alert('发布成功！', function() {
                    setStageListDo()
                  }),
                  $scope.$apply())
                : alert(data.message)
            }
          )
        } else {
          if (!$scope.add.peopel) {
            $scope.addflag.peopel = true
            return
          } else {
            $scope.addflag.peopel = false
          }
          if (!$scope.add.person) {
            $scope.addflag.person = true
            return
          } else {
            $scope.addflag.person = false
          }
          if (!$scope.add.date) {
            alert('请选择指派时间！')
            return
          } else {
            $scope.addflag.date = false
          }

          if (choooseArr.length <= 0) {
            alert('请选择可用时间段！')
            return
          } else {
            $scope.startDate =
              $scope.add.date + ' ' + $scope.bodyDataArr[choooseArr[0]].name
            $scope.endDate =
              $scope.add.date +
              ' ' +
              $scope.bodyDataArr[choooseArr[choooseArr.length - 1]].name
          }

          if (!$scope.add.things) {
            $scope.addflag.things = true
            return
          } else {
            $scope.addflag.things = false
          }

          server.server().zjtaskaddTask(
            {
              roomId: $scope.peopelArr, //物业id	是
              processId: $scope.add.childOption, //签约阶段子id
              toUser: $scope.add.person, //指派给
              startDate: $scope.startDate, //开始时间
              endDate: $scope.endDate, //结束时间
              eventDesc: $scope.add.things, //事件说明
              userId: $scope.personArr, //指派人id
              createUser: userId, //创建人id
              eventNode: $scope.add.parentOption //签约阶段父id
              //	时间说明
            },
            data => {
              data.result
                ? (($scope.add.peopel = ''),
                  ($scope.peopelArr = ''),
                  ($scope.add.childOption = ''),
                  ($scope.add.parentOption = ''),
                  ($scope.personArr = ''),
                  ($scope.add.person = ''),
                  ($scope.add.date = ''),
                  ($scope.add.things = ''),
                  (choooseArr = []),
                  alert('发布成功！', function() {
                    setStageListDo()
                  }),
                  $('.h-liebiaoone').fadeOut(200),
                  $scope.$apply())
                : alert(data.message)
            }
          )
        }
      }

      //物业新增信息
      server.server().zjroomessentialInformationdo(
        {
          roomId: $scope.roomId
        },
        function(data) {
          if (data.result === true) {
            //业权人
            $scope.ownership = data.data.ownership
            // 右上和右下两块
            $scope.room = data.data.room
            $scope.room.createTime = dict.timeConverter($scope.room.createTime)
            $scope.room.updateTime = dict.timeConverter($scope.room.updateTime)
            //物业
            if (data.data.surveyData) {
              $scope.grossArea = data.data.surveyData.grossArea
              $scope.areaOfBase = data.data.surveyData.areaOfBase
              $scope.single = data.data.surveyData.single
              $scope.survey = data.data.surveyData.survey
            }
            // 数组来着

            $scope.$apply()
          } else {
            alert(data.message)
          }
        },
        function(err) {
          alert(err)
        }
      )
      //完成时间
      $scope.showTime = function(item, flag) {
        $('.hopbntshare2').dialog()
        $scope.submitTime.id = item.id

        $scope.submitTime.completeTime = item.accomplishTime
          ? dict.timeConverter3(item.accomplishTime, 4)
          : ''
        $scope.timeflag = item.accomplishTime
        console.log(flag, item.accomplishTime)
        if (flag && !$scope.timeflag) {
          $scope.textareaTextflag = true
        } else {
          $scope.textareaTextflag = false
        }
      }
      $scope.addTime = function() {
        laydate.render({
          elem: '.childData1',
          //,value: new Date().toLocaleDateString() //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.parentData1', //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          //,position: 'static'
          done: function(value) {
            $scope.submitTime.accomplishTime = value
          }
        })
      }
      // 保存时间
      $scope.submitTime = function(flag) {
        console.log(flag)
        if (!flag) {
          server.server().lgcSetDataUpdateAccomplishTime(
            {
              roomId: $scope.roomId,
              id: $scope.submitTime.id,
              accomplishTime: $scope.submitTime.accomplishTime,
              cause: $scope.submitTime.textareaText || '',
              userId: createUser
            },
            function(data) {
              if (data.result) {
                setStageListDo()
                alert(data.message, function() {
                  $scope.submitTime.accomplishTime = ''
                  $('.childData1').val('')
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        } else {
          server.server().zjpropertystageupdateTimedo(
            {
              id: $scope.submitTime.id,
              accomplishTime: $scope.submitTime.accomplishTime
            },
            function(data) {
              if (data.result) {
                setStageListDo()
                alert(data.message, function() {
                  $scope.submitTime.accomplishTime = ''
                  $('.childData1').val('')
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
      }
      // 补偿
      server.server().zjbasicCompensateInfodo(
        {
          propertyId: $scope.roomId,
          cause: cause || ''
        },
        function(data) {
          if (data.result === true) {
            $scope.monthlyInterimCompensate = data.data.monthlyInterimCompensate
            $scope.totalMoneyCompensate = data.data.totalMoneyCompensate

            $scope.compensateItemList = data.data.compensateItemList
            $scope.builtInAreaList = data.data.builtInAreaList
            $scope.$apply()
          } else {
            alert(data.message)
          }
        },
        function(err) {
          alert(err)
        }
      )

      //物业查找签约阶段公共接口
      // 补偿
      setStageListDo()
      function setStageListDo() {
        server.server().zjpropertystagelistdo(
          {
            roomId: $scope.roomId,
            type: type
          },
          function(data) {
            if (data.result === true) {
              $scope.signList = data.data
              $scope.signList.forEach(function(item, i) {
                if ($scope.signList[i].name == '签约') {
                  if (
                    $scope.signList[i].sublevel &&
                    $scope.signList[i].sublevel.length > 0
                  ) {
                    $scope.signList[i].sublevel.forEach((item, j) => {
                      if ($scope.signList[i].sublevel[j].name == '未签约') {
                        $scope.signList[i].sublevel[j].flag = true
                      } else if (
                        $scope.signList[i].sublevel[j].name == '已签约'
                      ) {
                        $scope.signList[i].sublevel[j].flag = true
                      } else {
                        $scope.signList[i].sublevel[j].flag = false
                      }
                    })
                  }
                } else {
                  return false
                }
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
    }
  ])

  //物业管理列表 totalPropertyList  liaijunGG
  .controller('totalPropertyListCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$rootScope',
    function($http, $scope, server, dict, $state, $rootScope) {
      $scope.projectId = $state.params.projectid //项目的id
      var userId = server.server().userId
      var schemaId = '' //搜索条件
      var searchKeys = '' //搜索条件
      var areaArr = [] //存放选中的区域
      var nodeArr = [] //存放阶段的节点
      $scope.projectnameinput = ''
      $scope.nos = '/'

      //选中导航
      let timed = setInterval(function() {
        if ($('.l-nav>li').length > 0) {
          $('.l-nav>li')
            .eq(4)
            .addClass('cur')
          clearInterval(timed)
        }
      }, 10)

      //关注
      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }
      // 跟进跟踪
      $scope.listtop = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }

      // 获取申请合同状态
      $scope.applypact = function(indx) {
        // 李爱军后来加的，没有就是他的事
        var storage = window.localStorage
        storage.setItem('sbstatus', $scope.datas[indx].sbStatus)
      }

      $scope.action = {}
      $scope.dataFollowUp = function(roomId) {
        $scope.roomId = roomId
        $scope.action.reset(roomId)
      }
      //转移共享
      $scope.transferclick = {}
      $scope.gcShowWin = function(flag) {
        $scope.transferclick.reset(flag)
      }

      //跟进页面刷新
      $scope.myajax = function() {
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
      }
      //跟进页面跳转
      $scope.mylocation = function() {
        // $state.go('propertyDetail',{projectid:$scope.projectId,roomId:$scope.roomId})
      }

      $scope.selectAll = false
      //批量选中
      $scope.checkAll = function(val) {
        if (val) {
          $scope.datas.forEach(function(item, index) {
            $scope.datas[index].status = true
          })
        } else {
          $scope.datas.forEach(function(item, index) {
            $scope.datas[index].status = false
          })
        }
      }
      // 单选
      $scope.check = function(val, index) {
        $scope.selectAll = false
        if (val) {
          let m = 0
          $scope.datas.forEach(function(item, inde) {
            if ($scope.datas[inde].status) {
              m++
            }
          })
          if (m === $scope.datas.length) {
            $scope.selectAll = true
          }
        } else {
          let n = 0
          $scope.datas.forEach(function(item, inde) {
            if (!$scope.datas[inde].status) {
              n++
            }
          })
          if (n === $scope.datas.length) {
            $scope.selectAll[index].status = true
          }
        }
      }

      // 批量删除
      $scope.allotrole = function() {
        $scope.piliangarr = []
        $scope.datas.forEach(function(item, inde) {
          if ($scope.datas[inde].status) {
            $scope.piliangarr.push($scope.datas[inde].id)
          }
        })
        if ($scope.piliangarr.length > 0) {
          confirm('确认批量删除吗？', function() {
            server.server().zjroomdeleteByIddo(
              {
                id: $scope.piliangarr.toString(),
                userId: userId
              },
              function(data) {
                if (data.result === true) {
                  alert(data.message, function() {
                    //删除之后进行刷新页面
                    sev()
                    topnumber()
                    $scope.$apply()
                  })
                } else {
                  alert(data.message)
                }
              }
            )
          })
        } else {
          alert('请选择删除列表')
        }
      }

      //关注相关////lgc
      //查询状态
      server.server().zjprojectprojectDetaileddo(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result) {
            if (data.data.follow) {
              if (data.data.follow.status == 0) {
                $scope.follow = true
              }
            }
          }
        }
      )
      $scope.changeFollow = function(flag) {
        if (flag) {
          var parem = {
            projectId: $scope.projectId,
            creatorUser: userId,
            type: 30
          }
          parem.userJson = JSON.stringify([{ toUserId: userId }])
          server
            .server()
            .lgcMainInfosharedtransferconSave(
              parem,
              function(data) {},
              function() {}
            )
        } else {
        }
      }

      ////////end//////////////
      ////////////////////共享和移交选择角色弹窗从这里开始

      ///////////////////end/////////////////////////////////

      //物业是否关注
      // server.server().zjroomessentialInformationdo({
      //     schemaId:$scope.projectId
      // },function (data) {
      // });

      //分页配置
      $scope.conf = {
        total: 10, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false,
        counts: 10
      }
      //通过项目id查询名字和物业个数
      function topnumber() {
        server.server().projectnamesel(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              $scope.projectname = data.data.projectName
              $scope.number = data.data.number
              $scope.$apply()
            }
          }
        )
      }
      topnumber()

      //搜索
      $scope.searchInput = function(e) {
        sev()
      }
      //监听事件
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit+projectnameinput',
        function() {
          // sev($scope.projectnameinput);
          sev()
        }
      )
      //获取选中的数据的节点
      $scope.getSelectCheckBox = function() {
        $('input[name="nodeIds"]:checked').each(function() {
          areaArr.push($(this)[0].id)
        })
        $('input[name="area"]:checked').each(function() {
          nodeArr.push($(this)[0].id)
        })
        console.log(nodeArr, areaArr)
      }

      //初始化页面，加载数据
      function sev() {
        //获取选中的条件
        $scope.getSelectCheckBox()
        var signId = nodeArr.toString()
        schemaId = areaArr.toString()
        //清空数组
        nodeArr.length = 0
        areaArr.length = 0
        console.log(signId, schemaId)
        server.server().showPropertyByAreado(
          {
            userId: userId,
            projectId: $scope.projectId,
            schemaId: schemaId,
            signId: signId,
            searchKeys: $scope.projectnameinput || '',
            pageNo: $scope.conf.currentPage || 1,
            pageSize: $scope.conf.itemPageLimit || 10,
            schemaObjId: $scope.schemaObjId || '', //一级区域
            schemaObjIdTwo: $scope.schemaObjIdTwo || '', //二级区域
            schemaObjIdThree: $scope.schemaObjIdThree || '' //三级区域
          },
          function(data) {
            if (data.result) {
              $scope.datas = data.data.rows
              $scope.datas.forEach(function(item, index) {
                $scope.datas[index].status = false
              })
              $scope.selectAll = false
              $scope.conf.total = data.data.pageCount
              $scope.total = data.data.total
              $scope.conf.counts = data.data.total
              $scope.$broadcast('categoryLoaded')
              $scope.$apply()
            }
          },
          function(data) {
            alert(data)
          }
        )
      }

      //加载搜索条件
      server.server().showPropertyConditionsdo(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result === true) {
            $scope.porpertyConditions = data.data
          }
          $scope.$apply()
        }
      )
      //测绘阶段的所有子阶段，签约阶段的所有子阶段
      server.server().showSignNodedo({}, function(data) {
        if (data.result === true) {
          $scope.nodeSign = data.data.signList
        }
        $scope.$apply()
      })
      //点击事件
      $scope.doChange = function(name, names) {
        //去掉全选
        var checkLength = $('input[name="' + name + '"]:checkbox').length
        var checkedLength = $('input[name="' + name + '"]:checked').length
        if (checkLength != checkedLength) {
          $('input[name="' + names + '"]:checkbox')[0].checked = false
        } else {
          $('input[name="' + names + '"]:checkbox')[0].checked = true
        }
        sev()
      }
      //全选和反选操作
      $scope.selectedAll = function(name) {
        if ($('input[name="' + name + 's"]:checkbox').is(':checked')) {
          $('input[name="' + name + '"]:checkbox').each(function(index) {
            this.checked = true
          })
        } else {
          $('input[name="' + name + '"]:checkbox').each(function(index) {
            this.checked = false
          })
        }
        sev()
      }

      // 新增下拉三级全选
      $scope.nodeId = ''
      $scope.radios = function(value, flag) {
        console.log(value)
        $scope.midididididididididididididid = value
        if (flag == 1) {
          ajaxssss(value ? '0' : '', flag)
          // ajaxssss((value),flag)
        } else if (flag == 2) {
          ajaxssss(value, flag)
        } else if (flag == 3) {
          ajaxssss(value, flag)
        } else if (flag == 4) {
          ajaxssss(value, flag)
        }
        // else if(flag==5){
        //     ajaxssss(value,flag)
        // }else if(flag==6){
        //     ajaxssss(value,flag)
        // }
      }
      function ajaxssss(value, flag) {
        server.server().querySchemaSublevel(
          {
            parentId: value,
            projecrId: $scope.projectId,
            schemaId: $scope.midididididididididididididid
          },
          function(data) {
            if (data.result === true) {
              if (flag == 1) {
                $scope.firstradio = data.data
                $scope.seccendradio = ''
                $scope.threeradio = ''
                $scope.fourradio = ''
                $scope.fiveradio = ''
                $scope.sixradio = ''
                $scope.schemaObjId = ''
                $scope.schemaObjIdTwo = ''
                $scope.schemaObjIdThree = ''
                sev()
              } else if (flag == 2) {
                $scope.seccendradio = data.data
                $scope.threeradio = ''
                $scope.fourradio = ''
                $scope.fiveradio = ''
                $scope.sixradio = ''
                $scope.schemaObjId = value
                $scope.schemaObjIdTwo = ''
                $scope.schemaObjIdThree = ''
                sev()
              } else if (flag == 3) {
                $scope.threeradio = data.data
                $scope.fourradio = ''
                $scope.fiveradio = ''
                $scope.sixradio = ''
                $scope.schemaObjIdTwo = value
                $scope.schemaObjIdThree = ''
                sev()
              } else if (flag == 4) {
                // $scope.fourradio = data.data;
                $scope.fiveradio = ''
                $scope.sixradio = ''
                $scope.schemaObjIdThree = value
                sev()
              }
              //  else if(flag==5){
              //     $scope.fiveradio = data.data;
              //     $scope.sixradio = ''
              //     sev()
              //  }else if(flag==6){
              //     $scope.sixradio = data.data;
              //     sev()
              //  }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      //执行删除当前物业
      $scope.dopropertyDelete = function(id) {
        confirm('删除当前物业？', function() {
          //执行删除操作
          server.server().zjroomdeleteByIddo(
            {
              id: id,
              userId: userId
            },
            function(data) {
              if (data.result === true) {
                alert(data.message, function() {
                  //删除之后进行刷新页面
                  sev()
                  topnumber()
                  $scope.$apply()
                })
              } else {
                alert(data.message)
              }
            }
          )
        })
      }
    }
  ])
  //风门坳项目物业 未签约统计表 totalPropertyList
  .controller('projectManagementExportCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {
      $scope.projectId = $state.params.projectid
      //通过项目id查询名字和物业个数
      server.server().projectnamesel(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result === true) {
            $scope.projectname = data.data.projectName
            $scope.number = data.data.number
            $scope.$apply()
          }
        }
      )

      //查找数据
      server.server().showNoSignPropertydo(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result === true) {
            $scope.datas = data.data.rows
            $scope.$apply()
          } else {
            alert(data.message)
          }
        }
      )
      //获取搜索条件
      server.server().showNoSignCasesdo(
        {
          projectId: $scope.projectId
        },
        function(data) {
          if (data.result === true) {
            $scope.conditions = data.data.causeList
          } else {
            alert(data.message)
          }
        }
      )

      //点击事件
      $scope.doChange = function() {
        //去掉全选
        if (
          $('input[name="cause"]:checkbox').length !=
          $('input[name="cause"]:checked').length
        ) {
          $('input[name="causes"]:checkbox')[0].checked = false
        } else {
          $('input[name="causes"]:checkbox')[0].checked = true
        }
        var arr = []
        $('input[name="cause"]:checked').each(function(index) {
          arr.push($(this)[0].id)
        })
        $scope.dosearcher(arr.toString())
        arr = [] //数据进行回收处理
      }
      //全选操作
      $scope.selectedAll = function() {
        if ($('input[name="causes"]:checkbox').is(':checked')) {
          $('input[name="cause"]:checkbox').each(function(index) {
            this.checked = false
          })
        } else {
          $('input[name="cause"]:checkbox').each(function(index) {
            this.checked = true
          })
        }
        //获取所有的id
        var arr = []
        $('input[name="cause"]:checked').each(function(index) {
          arr.push($(this)[0].id)
        })
        $scope.dosearcher(arr.toString())
        arr = [] //数据进行回收处理
      }
      //数据的操作
      $scope.dosearcher = function(arrs) {
        server.server().showNoSignPropertydo(
          {
            projectId: $scope.projectId,
            cause: arrs
          },
          function(data) {
            if (data.result === true) {
              $scope.datas = data.data.rows
            }
            $scope.$apply()
          },
          function(data) {
            alert(data)
          }
        )
      }
    }
  ])
  //延迟支付补偿  .state('DeferredCompensation', {
  .controller('DeferredCompensationCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {}
  ])
  //佣金项目.state('CommissionProject', {
  .controller('CommissionProjectCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    function($http, $scope, server, dict, $state) {}
  ])

  //物业拆除.PropertyDismantle
  .controller('PropertyDismantleCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      //选中导航
      // let timed=setInterval(function(){
      //     if($('.l-nav>li').length>0)
      //     {
      //         $('.l-nav>li').eq(9).addClass('cur');
      //         clearInterval(timed)
      //     }
      // },10)
      $scope.projectId = $state.params.projectid //项目的id
      // $scope.projectId = '261e554de2f3493ebed1e4b6567818d1';//项目的id
      var userId = server.server().userId

      $scope.isAccomplish = 2
      $scope.searchVal = ''
      $scope.no = '/'
      $scope.PullUpShow = true //收起
      $scope.PullUpText = '收起'
      //收起
      $scope.pullUp = function() {
        if ($scope.PullUpShow) {
          $scope.PullUpShow = false
          $scope.PullUpText = '展开'
        } else {
          $scope.PullUpShow = true
          $scope.PullUpText = '收起'
        }
      }

      // 关注
      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }

      // 跟进跟踪
      $scope.listtop = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 1, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
      //跟踪
      $scope.action = {}
      $scope.dataFollowUp = function(roomId) {
        $scope.roomId = roomId
        $scope.action.reset(roomId)
      }
      //转移共享
      $scope.transferclick = {}
      $scope.gcShowWin = function(flag) {
        $scope.transferclick.reset(flag)
      }

      //跟进页面刷新
      $scope.myajax = function() {
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
      }
      //跟进页面跳转
      $scope.mylocation = function() {
        $state.go('DemolitionDetails', {
          projectid: $scope.projectId,
          roomId: $scope.roomId
        })
      }

      ////////////////////共享和移交选择角色弹窗从这里开始

      ///////////////////end/////////////////////////////////

      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      function titleajax() {
        //查询出物业名字和物业个数\
        var def = $q.defer()
        server.server().projectnamesel(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              def.resolve(data.data)
            }
          }
        )

        return def.promise
      }

      function getPosition() {
        var def = $q.defer()
        // 物业拆除（初始化签约阶段信息）
        server.server().zjroominitOrderSigndo(
          {},
          function(data) {
            if (data.result === true) {
              $scope.nameid = data.data.id
              def.resolve(data.data.id)
            }
          },
          function(err) {
            def.reject(err)
            alert(err)
          }
        )
        return def.promise
      }

      getPosition()
        .then(function(obj) {
          zjroompropertyListdo('', 1, 2, obj)
          $scope.itemdetailflag = true
          return titleajax()
        })
        .then(obj => {
          $scope.projectname = obj.projectName
          $scope.number = obj.number
        })

      //筛选
      $scope.search = function() {
        zjroompropertyListdo(
          $scope.searchVal.trim(),
          $scope.conf.currentPage,
          $scope.isAccomplish,
          $scope.nameid
        )
      }

      //分页
      $scope.$watch('conf.currentPage + conf.itemPageLimit+searchVal', function(
        news
      ) {
        zjroompropertyListdo(
          $scope.searchVal,
          $scope.conf.currentPage,
          $scope.isAccomplish,
          $scope.nameid
        )
      })

      //单选
      $scope.radios = function(val) {
        zjroompropertyListdo(
          $scope.searchVal,
          $scope.conf.currentPage,
          val,
          $scope.nameid
        )
      }

      //列表初始化
      function zjroompropertyListdo(schemaId, pageNo, isAccomplish, nameid) {
        // $scope.rows=[];
        server.server().zjroomqueryPropertyDismanInfodo(
          {
            projectId: $scope.projectId,
            schemaId: schemaId ? schemaId : '', //搜索id
            pageNo: pageNo ? pageNo : 1, //当前页娄
            pageSize: 10,
            isAccomplish: isAccomplish, //是否完成 2 0 1
            id: nameid //阶段id
          },
          function(data) {
            if (data.result === true) {
              $scope.rows = data.data.rows
              //共多少页
              $scope.conf.total = Math.ceil(
                data.data.total / data.data.pageSize
              )
              //共有多少条数据
              $scope.conf.counts = data.data.total
              $scope.$apply()
              $scope.$broadcast('categoryLoaded')
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
    }
  ])
  //拆除详情
  .controller('DemolitionDetailsCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.no = '/'
      //var id = '261e554de2f3493ebed1e4b6567818d1';
      var userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        projectflag: 2 //项目id1 物业id2
      }
    }
  ])
  //拆除信息
  .controller('DemolitioninformationCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      var userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.no = '/'

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }

      function getPosition() {
        var def = $q.defer()
        // 物业拆除（初始化签约阶段信息）
        server.server().zjroomqueryPropertyDismantledo(
          {
            propertyId: $scope.roomId
          },
          data => {
            data.result === true ? def.resolve(data) : def.reject(data.message)
            $scope.$apply()
          }
        )
        return def.promise
      }

      getPosition().then(data => {
        $scope.showdate = data.data[0]
      })

      function runAsync(inputval, boxval) {
        var ps = new Promise((resolve, reject) => {
          laydate.render({
            elem: '.' + inputval,
            type: 'datetime',
            value: new Date(), //必须遵循format参数设定的格式
            format: 'yyyy-MM-dd HH:mm:ss', //可任意组合
            show: true, //直接显示
            closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            done: value => {
              resolve(value)
            }
          })
        })
        return ps
      }
      //添加

      $scope.addTime = function(inputval, boxval) {
        $('.' + boxval).show()
        runAsync(inputval, boxval).then(data => {})
      }
      // 提交
      $scope.submitTime = function(flag, inputval) {
        // runAsync()data=>{
        var data = $('.' + inputval).val()
        if (!data) {
          alert('请选择时间！')
          return
        }
        switch (flag) {
          case 'waterNetCancelTime':
            var dataobj = {
              propertyId: $scope.roomId,
              createUser: userId,
              waterNetCancelTime: data
            }
            break
          case 'hosueCancelTime':
            var dataobj = {
              propertyId: $scope.roomId,
              createUser: userId,
              hosueCancelTime: data
            }
            break
          case 'earthCancelTime':
            var dataobj = {
              propertyId: $scope.roomId,
              createUser: userId,
              earthCancelTime: data
            }
            break
        }
        server
          .server()
          .zjpropertydismantleaddPropertyDismantledo(dataobj, data => {
            data.result === true
              ? (alert(data.message),
                getPosition().then(data => {
                  $scope.showdate = data.data[0]
                }))
              : alert(data.message)
            $scope.$apply()
          })
      }
    }
  ])
  //拆除测绘信息
  .controller('DemolitionMapingInfromationCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.no = '/'
      $scope.projectId = $state.params.projectid
      $scope.roomId = $state.params.roomId
      $scope.hostname = server.server().host
      var createUser = server.server().userId

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])
  //拆除业权人
  .controller('DemolitionOwnerCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.roomId = $state.params.roomId
      $scope.projectId = $state.params.projectid
      $scope.no = '/'
      var createUser = server.server().userId
      //获取上面数据

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])
  //拆除附件
  .controller('DemolitionAttachmentCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      let userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.no = '/'
      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])

  //物业移交
  .controller('handOverPropertyCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      //选中导航
      // let timed=setInterval(function(){
      //     if($('.l-nav>li').length>0)
      //     {
      //         $('.l-nav>li').eq(8).addClass('cur');
      //         clearInterval(timed)
      //     }
      // },10)
      $scope.projectId = $state.params.projectid //项目的id
      var userId = server.server().userId

      $scope.PullUpShow = true //收起
      $scope.PullUpText = '收起'
      //收起
      $scope.pullUp = function() {
        if ($scope.PullUpShow) {
          $scope.PullUpShow = false
          $scope.PullUpText = '展开'
        } else {
          $scope.PullUpShow = true
          $scope.PullUpText = '收起'
        }
      }

      // 关注
      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }

      // 跟进跟踪
      $scope.listtop = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 1, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
      //跟踪
      $scope.action = {}
      $scope.dataFollowUp = function(roomId) {
        $scope.roomId = roomId
        $scope.action.reset(roomId)
      }
      //转移共享
      $scope.transferclick = {}
      $scope.gcShowWin = function(flag) {
        $scope.transferclick.reset(flag)
      }

      //跟进页面刷新
      $scope.myajax = function() {
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
      }
      //跟进页面跳转
      $scope.mylocation = function() {
        $state.go('handOverDetails', {
          projectid: $scope.projectId,
          roomId: $scope.roomId
        })
      }

      ////////////////////共享和移交选择角色弹窗从这里开始

      ///////////////////end/////////////////////////////////

      $scope.isAccomplish = '2' //物业移交
      $scope.iswater = '2' //水电移交
      $scope.searchVal = ''
      $scope.no = '/'

      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      function titleajax() {
        //查询出物业名字和物业个数
        var def = $q.defer()
        server.server().projectnamesel(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              def.resolve(data.data)
            }
          }
        )

        return def.promise
      }

      function getPosition() {
        var def = $q.defer()
        // 物业移交（初始化签约阶段信息）
        server.server().zjroomgetInitProTrando({}, function(data) {
          if (data.result === true) {
            $scope.nameid = data.data[0].id
            $scope.roomName = data.data[0].name
            $scope.waterid = data.data[1].id
            $scope.waterName = data.data[1].name
            def.resolve(data.data)
          } else {
            alert(data.message)
          }
        })
        return def.promise
      }

      getPosition()
        .then(function(obj) {
          zjroompropertyListdo('', 1, obj[0].id, obj[1].id, 2, 2)
          return titleajax()
        })
        .then(obj => {
          $scope.projectname = obj.projectName
          $scope.number = obj.number
        })

      //筛选
      $scope.search = function() {
        zjroompropertyListdo(
          $scope.searchVal.trim(),
          $scope.conf.currentPage,
          $scope.nameid,
          $scope.waterid,
          $scope.isAccomplish,
          $scope.iswater
        )
      }

      //分页
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit+searchVal',
        function() {
          zjroompropertyListdo(
            $scope.searchVal,
            $scope.conf.currentPage,
            $scope.nameid,
            $scope.waterid,
            $scope.isAccomplish,
            $scope.iswater
          )
        }
      )

      //物业单选
      $scope.radios = function(val, flag) {
        $scope.isAccomplish = val
        if (flag && $scope.iswater != 2) {
          $scope.iswater = '2'
        }

        zjroompropertyListdo(
          $scope.searchVal,
          $scope.conf.currentPage,
          $scope.nameid,
          $scope.waterid,
          val,
          $scope.iswater
        )
      }
      //水电单选
      $scope.watchradio = function(val, flag) {
        $scope.iswater = val
        console.log($scope.isAccomplish)
        if (flag && $scope.isAccomplish != 2) {
          $scope.isAccomplish = '2'
        }
        zjroompropertyListdo(
          $scope.searchVal,
          $scope.conf.currentPage,
          $scope.nameid,
          $scope.waterid,
          $scope.isAccomplish,
          val
        )
      }

      //列表初始化
      function zjroompropertyListdo(
        schemaId,
        pageNo,
        nameid,
        waterid,
        isAccomplish,
        iswater
      ) {
        // $scope.rows=[];
        server.server().zjqueryPropertyTransferdo(
          {
            projectId: $scope.projectId,
            schemaId: schemaId ? schemaId : '', //搜索id
            pageNo: pageNo ? pageNo : 1, //当前页娄
            pageSize: 10,
            proTransfferId: nameid, //	物业移交id
            waterTransfferId: waterid, //	水电移交id
            proTransfferType: isAccomplish, //	物业移交类型
            waterTransfferType: iswater //	水电移交类型
          },
          function(data) {
            if (data.result === true) {
              $scope.rows = data.data.rows
              //共多少页
              $scope.conf.total = Math.ceil(
                data.data.total / data.data.pageSize
              )
              //共有多少条数据
              $scope.conf.counts = data.data.total

              $scope.$broadcast('categoryLoaded')
              $scope.$apply()
            }
          }
        )
      }
    }
  ])
  //移交详情
  .controller('handOverDetailsCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.no = '/'
      var userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }

      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
    }
  ])
  //移交信息
  .controller('handOverInformationCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      var userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.no = '/'

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }

      // 物业拆除（初始化签约阶段信息）
      function getPosition() {
        var def = $q.defer()

        server.server().zjqueryTransferInfodo(
          {
            propertyId: $scope.roomId
          },
          data => {
            data.result === true ? def.resolve(data) : alert(data.message)
            $scope.$apply()
          }
        )
        return def.promise
      }

      getPosition().then(data => {
        $scope.showdate = data.data[0]
      })

      function runAsync(inputval, boxval) {
        var ps = new Promise((resolve, reject) => {
          laydate.render({
            elem: '.' + inputval,
            type: 'datetime',
            value: new Date(), //必须遵循format参数设定的格式
            format: 'yyyy-MM-dd HH:mm:ss', //可任意组合
            show: true, //直接显示
            closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            done: value => {
              resolve(value)
            }
          })
        })
        return ps
      }
      //添加

      $scope.addTime = function(inputval, boxval, eve) {
        let _this = eve.target
        $(_this)
          .next()
          .fadeIn(200)
        if (inputval != 1) {
          runAsync(inputval, boxval).then(data => {})
        }
      }
      // 提交
      $scope.submitTime = function(flag, inputval) {
        let data = $('.' + inputval).val()
        let dataobj = {}
        switch (flag) {
          case 'waterAccount': //用水账户
            if (!data) {
              alert('未输入账户名！')
              return
            }
            dataobj.propertyId = $scope.roomId
            dataobj.waterAccount = data
            dataobj.createUser = userId
            break
          case 'powerAccount': //用电账户
            if (!data) {
              alert('未输入账户名！')
              return
            }
            dataobj.propertyId = $scope.roomId
            dataobj.powerAccount = data
            dataobj.createUser = userId
            break
          case 'waterPowerTime': //水电移交时间
            if (!data) {
              alert('请选择时间！')
              return
            }
            dataobj.propertyId = $scope.roomId
            dataobj.waterPowerTime = data
            dataobj.createUser = userId
            break
          case 'propertyTransferTime': //水电移交时间
            if (!data) {
              alert('请选择时间！')
              return
            }
            dataobj.propertyId = $scope.roomId
            dataobj.propertyTransferTime = data
            dataobj.createUser = userId
            break
        }
        server.server().zjpropertyinfoaddWaterPowerTransferdo(dataobj, data => {
          data.result === true
            ? (alert(data.message),
              getPosition().then(data => {
                $scope.showdate = data.data[0]
              }))
            : alert(data.message)
          $scope.$apply()
        })
      }
    }
  ])
  //移交测绘信息
  .controller('handOverMapCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.no = '/'
      $scope.projectId = $state.params.projectid
      $scope.roomId = $state.params.roomId
      $scope.hostname = server.server().host
      var createUser = server.server().userId

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }

      //右侧测绘进度
      function runAsync2() {
        var p = new Promise((resolve, reject) => {
          server.server().surveyingList(
            {
              roomId: $scope.roomId,
              type: 2
            },
            data => {
              if (data.result === true) {
                $scope.surveyingList = data.data
                $scope.$apply()
                resolve($scope.surveyingList)
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }

      Promise.all([runAsync2()]).then(results => results, err => {})
    }
  ])
  //移交业权人
  .controller('handOverOwnerCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.roomId = $state.params.roomId
      $scope.projectId = $state.params.projectid
      $scope.no = '/'
      var createUser = server.server().userId
      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])
  //移交附件
  .controller('handOverAttachmentCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      let userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.no = '/'
      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])

  //物业还建
  .controller('propertyBuiltCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.projectId = $state.params.projectid //项目的id
      var userId = server.server().userId

      $scope.isAccomplish = '' //
      $scope.searchVal = ''
      $scope.no = '/'
      $scope.PullUpShow = true //收起
      $scope.PullUpText = '收起'
      //收起
      $scope.pullUp = function() {
        if ($scope.PullUpShow) {
          $scope.PullUpShow = false
          $scope.PullUpText = '展开'
        } else {
          $scope.PullUpShow = true
          $scope.PullUpText = '收起'
        }
      }
      // 关注
      $scope.list = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 1 //类型 1 项目 2物业
      }

      // 跟进跟踪
      $scope.listtop = {
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 1, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
      //跟踪
      $scope.action = {}
      $scope.dataFollowUp = function(roomId) {
        $scope.roomId = roomId
        $scope.action.reset(roomId)
      }
      //转移共享
      $scope.transferclick = {}
      $scope.gcShowWin = function(flag) {
        $scope.transferclick.reset(flag)
      }

      //跟进页面刷新
      $scope.myajax = function() {
        // zjtaskqueryTrackingInformationdo(1,'','','',1)
      }
      //跟进页面跳转
      $scope.mylocation = function() {
        $state.go('builtDetails', {
          projectid: $scope.projectId,
          roomId: $scope.roomId
        })
      }

      ////////////////////共享和移交选择角色弹窗从这里开始
      ///////////////////end/////////////////////////////////

      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      function titleajax() {
        //查询出物业名字和物业个数\
        server.server().projectnamesel(
          {
            projectId: $scope.projectId
          },
          function(data) {
            if (data.result === true) {
              $scope.projectname = data.data.projectName
              $scope.number = data.data.number
            }
          }
        )
      }
      titleajax()
      $scope.chockboxArr = []
      function getPosition(flag, callback) {
        server.server().zjroominitBuildOrderSigndo(
          {},
          function(data) {
            if (data.result === true) {
              $scope.nameid = data.data.orderSign.id
              $scope.myarr = data.data.stillBuiltList
              if ($scope.myarr && $scope.myarr.length > 0) {
                $scope.myarr.forEach(function(item, index) {
                  $scope.chockboxArr[index] = {
                    status: false,
                    name: $scope.myarr[index]
                  }
                })
              }

              // $scope.chockboxArr[0].status = true;
              // $scope.isAccomplish = $scope.chockboxArr[0].name;

              if (flag) {
                callback($scope.nameid)
              }
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
      getPosition()

      //筛选
      $scope.search = function() {
        zjroompropertyListdo(
          $scope.searchVal.trim(),
          $scope.conf.currentPage,
          $scope.isAccomplish,
          $scope.nameid
        )
      }

      //分页
      // if($scope.nameid){
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit +searchVal',
        function(news) {
          zjroompropertyListdo(
            $scope.searchVal,
            $scope.conf.currentPage,
            $scope.isAccomplish,
            $scope.nameid
          )
        }
      )
      // }

      //单选
      $scope.radios = function(val, inde) {
        $scope.isAccomplish = $scope.chockboxArr[inde].name || ''

        zjroompropertyListdo(
          $scope.searchVal,
          $scope.conf.currentPage,
          $scope.isAccomplish,
          $scope.nameid
        )
      }

      // 全选
      $scope.radiosall = function() {
        zjroompropertyListdo(
          $scope.searchVal,
          $scope.conf.currentPage,
          '',
          $scope.nameid
        )
      }

      //列表初始化
      function zjroompropertyListdo(schemaId, pageNo, isAccomplish, nameid) {
        server.server().zjroomqueryPropertyBuildInfodo(
          {
            projectId: $scope.projectId,
            searchKeys: schemaId ? schemaId : '', //搜索id
            pageNo: pageNo ? pageNo : 1, //当前页娄
            pageSize: 10,
            period: isAccomplish //期数
            // ordeSignId:nameid||''	//阶段id
          },
          function(data) {
            if (data.result === true) {
              $scope.rows = data.data.rows
              //共多少页
              $scope.conf.total = Math.ceil(
                data.data.total / data.data.pageSize
              )
              //共有多少条数据
              $scope.conf.counts = data.data.total
              $scope.$apply()
              $scope.$broadcast('categoryLoaded')
            } else {
              alert(data.message)
            }
          },
          function(err) {
            alert(err)
          }
        )
      }
    }
  ])
  //还建总览
  .controller('builtDetailsCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.no = '/'
      var userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.imgHost = server.server().imgHost
      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1 //需要跳转到某页面就填写 1 or ''
      }
    }
  ])
  //还建信息
  .controller('builtInformationCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      var userId = server.server().userId //用户id
      var propertyId = $state.params.roomId
      var type
      $scope.hostname = server.server().imgHost
      $scope.checkbox = []
      $scope.agreeTime = null
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId //物业id
      $scope.rows = []
      $scope.no = '请添加'
      $scope.obj = {}
      $scope.nos = '/'

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }

      $scope.edit = function(i, o) {
        for (var index in $scope.rows) {
          $scope.rows[index].flagArr = [false, false, false, false]
        }
        if (o != null) {
          $scope.rows[i].flagArr[o] = true
        }
      }
      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      $scope.$watch('conf.currentPage + conf.itemPageLimit', function() {
        setDate($scope.conf.currentPage)
      })

      //查看
      $scope.look = function(indx) {
        $scope.repayingStartTime =
          $scope.rows[indx].repayingStartTime || $scope.nos
        $scope.repayingEndTime = $scope.rows[indx].repayingEndTime || $scope.nos
        $scope.movingInventory = $scope.rows[indx].movingInventory || $scope.nos
        $scope.assetEvaluation = $scope.rows[indx].assetEvaluation || $scope.nos
        $scope.fileArr = $scope.rows[indx].attachmentList
        $('.industrialshow').dialog()
      }
      //修改
      $scope.fileArrNew = []
      $scope.editupdate = function(indx) {
        $scope.builtInfoId = $scope.rows[indx].builtInfoId
        $scope.adduseId = $scope.rows[indx].id
        $scope.repayingStartTime =
          $scope.rows[indx].repayingStartTime || $scope.nos
        $scope.repayingEndTime = $scope.rows[indx].repayingEndTime || $scope.nos
        $scope.movingInventory = $scope.rows[indx].movingInventory || $scope.nos
        $scope.assetEvaluation = $scope.rows[indx].assetEvaluation || $scope.nos
        $scope.fileArr = $scope.rows[indx].attachmentList
        $('.editupdate').dialog()
      }

      //工业厂房节点
      $scope.addupdate = function(indx) {
        $scope.adduseId = $scope.rows[indx].id
        $scope.fileArr = []
        $scope.repayingStartTime = ''
        $scope.repayingEndTime = ''
        $scope.movingInventory = ''
        $scope.assetEvaluation = ''
        $('.industrialPlant').dialog()
      }

      //star时间筛选
      function runAsync1(inputval, boxval) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.repayingStartTime = value
            $scope.$apply()
          }
        })
      }
      //end时间筛选
      function runAsync2(inputval, boxval, stardata, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            callback(value)
          }
        })
      }

      // end时间调接口筛选
      $scope.alertData = function(child, parent, flag) {
        if (flag === 1) {
          runAsync1(child, parent)
        } else {
          !$scope.repayingStartTime
            ? alert('请选择开始时间')
            : runAsync2(child, parent, $scope.repayingStartTime, value => {
                value
                  ? (($scope.repayingStartTime = $scope.repayingStartTime.toString()),
                    ($scope.repayingEndTime = value.toString()),
                    $scope.$apply())
                  : alert('请选择结束时间')
              })
        }
      }

      //附件上传
      //上传添加文件数组返回src
      $scope.fileArr = []
      $scope.fileNameChanged = function(e) {
        var files = e.target.files
        var eve = e.target
        for (var i = 0; i < files.length; i++) {
          filesupdate(files[i], eve)
        }
      }
      function filesupdate(file, eve) {
        var fd = new FormData()
        if (file) {
          var ext = file.name
            .slice(file.name.lastIndexOf('.') + 1)
            .toLowerCase()
          if (ext == 'xls' || ext == 'xlsx' || ext == 'csv') {
            fd.append('multipartFile', file)
            $http({
              method: 'POST',
              url: server.server().imgHost + 'attachment/fielUpload.do',
              data: fd,
              headers: { 'Content-Type': undefined },
              transformRequest: angular.identity
            }).then(function successCallback(data) {
              eve.value = ''
              if (data.data.result) {
                $scope.fileArr.push(data.data.data)
              } else {
                alert(data.message)
              }
            })
            $scope.$apply()
          } else {
            eve.value = ''
            alert('只能上传Excle文件')
            return false
          }
        }
      }

      //input上传文件删除
      $scope.fileArrDel = function(ind) {
        $scope.fileArr.splice(ind, 1)
      }

      //保存
      $scope.addsave = function() {
        $scope.attachments = []
        if ($scope.fileArr.length > 0) {
          $scope.fileArr.forEach(function(item, i) {
            $scope.attachments[i] = {
              filePath: $scope.fileArr[i].filePath,
              fileName: $scope.fileArr[i].fileName,
              size: $scope.fileArr[i].size
            }
          })
        }

        server.server().lgcMainInfoAddBuiltInfo(
          {
            createUser: userId,
            type: $scope.adduseId,
            propertyId: propertyId,
            repayingTenantsStartTime: $scope.repayingStartTime || '',
            repayingTenantsEndTime: $scope.repayingEndTime || '',
            movingInventory: $scope.movingInventory || '',
            assetEvaluation: $scope.assetEvaluation || '',
            urls:
              $scope.attachments.length > 0
                ? JSON.stringify($scope.attachments)
                : '',
            id: $scope.builtInfoId ? $scope.builtInfoId : ''
          },
          function(data) {
            if (data.result) {
              alert(data.message, function() {
                $scope.fileArr = []
                $scope.repayingStartTime = ''
                $scope.repayingEndTime = ''
                $scope.movingInventory = ''
                $scope.assetEvaluation = ''
                $('.zjchildData2').val('')
                $('.zjchildData1').val('')
                setDate()
                $scope.$apply()
              })
              $('.industrialPlant').fadeOut(200)
              $('.editupdate').fadeOut(200)
            } else {
              alert(data.message, function() {
                $scope.fileArr = []
              })
            }
          }
        )
      }
      //假数据
      let rowss = {
        result: true,
        message: '查询成功',
        data: {
          pageNo: 1,
          pageCount: 1,
          pageSize: 10,
          pageStartOffset: 0,
          total: 2,
          rows: [
            {
              assetEvaluation: null,
              houseBuilt: null,
              builtCompensateMoney: null,
              agreeTime: null,
              spare: null,
              builtHouseArea: null,
              type: '商业',
              period: 1,
              financialName: '',
              builtHousePrice: null,
              id: '319c06160d334dc8a4645e8dbc621d1a',
              builtInfoId: null,
              retentProjectMoney: null,
              repayingEndTime: null,
              builtArea: 107.14,
              retentionName: null,
              movingInventory: null,
              settlementMoney: null,
              repayingStartTime: null
            },
            {
              assetEvaluation: null,
              houseBuilt: null,
              builtCompensateMoney: null,
              agreeTime: null,
              spare: null,
              builtHouseArea: null,
              type: '住宅',
              period: 1,
              financialName: '',
              builtHousePrice: null,
              id: '342e571d7f214c30a72aea24309611cf',
              builtInfoId: null,
              retentProjectMoney: null,
              repayingEndTime: null,
              builtArea: 294.01,
              retentionName: null,
              movingInventory: null,
              settlementMoney: null,
              repayingStartTime: null
            }
          ]
        }
      }

      //还建信息列表
      function setDate(pageNo) {
        server.server().lgcMainInfobuiltinfo(
          {
            propertyId,
            pageSize: 10,
            pageNo: pageNo ? pageNo : 1
          },
          function(data) {
            if (data.result) {
              $scope.rows = data.data.rows
              // $scope.rows=JSON.stringify(rowss).data.data.rows;
              $scope.conf.total = Math.ceil(
                data.data.total / data.data.pageSize
              )
              //共有多少条数据
              $scope.conf.counts = data.data.total

              $scope.$broadcast('categoryLoaded')
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      //添加物建信息
      $scope.submit = function(value, id) {
        let parems = {
          propertyId,
          createUser: userId,
          type: id
        }
        if (!$scope.obj[value]) {
          alert('请输入添加内容')
          return
        }
        parems[value] = $scope.obj[value]
        server.server().lgcMainInfoAddBuiltInfo(
          parems,
          function(data) {
            if (data.result) {
              setDate()
              alert(data.message)
              $scope.obj = {}
            } else {
              alert(data.message)
            }
          },
          function() {
            alert('网络请求失败')
          }
        )
      }
      //时间选择弹窗
      $scope.selTime = function(id) {
        $('.hopbntshare2').dialog()
        //截留款项目信息列表
        server.server().lgcMainInfoInitFinancialInfo(
          {
            propertyId
          },
          function(data) {
            $scope.financialList = data.data
            $scope.$apply()
          },
          function() {
            alert('网络请求失败')
          }
        )
        type = id
      }
      function runAsync(inputval, boxval) {
        var ps = new Promise((resolve, reject) => {
          laydate.render({
            elem: '.' + inputval,
            type: 'datetime',
            value: new Date(), //必须遵循format参数设定的格式
            format: 'yyyy-MM-dd HH:mm:ss', //可任意组合
            show: true, //直接显示
            closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
            done: value => {
              resolve(value)
            }
          })
        })
        return ps
      }
      //添加
      $scope.addTime = function(inputval, boxval) {
        $('.' + boxval).show()
        runAsync(inputval, boxval).then(data => {})
      }
      // 确定时间
      $scope.isTime = function(inputval) {
        var data = $('.' + inputval).val()
        $scope.agreeTime = data
      }
      //弹窗保存
      $scope.submitFinancial = function() {
        let parems = {
          propertyId,
          createUser: userId,
          type,
          retentionName: []
        }
        if (!$scope.agreeTime) {
          alert('请选择时间')
          return
        }
        for (let t of $scope.financialList) {
          if (t.checkbox) {
            parems.retentionName.push({ id: t.financialId })
          }
        }
        if (parems.retentionName.length == 0) {
          alert('请选择截留款项目')
          return
        }
        parems.retentionName = JSON.stringify(parems.retentionName)
        //查询截留款当前金额
        server.server().lgcMainInfoInitAmount(
          {
            jsonId: parems.retentionName
          },
          function(data) {
            parems.retentProjectMoney = data.data
            submitPro()
          },
          function() {
            alert('请求失败')
          }
        )

        function submitPro() {
          parems.agreeTime = $scope.agreeTime
          server.server().lgcMainInfoAddBuiltInfo(
            parems,
            function(data) {
              $('.hopbntshare2').hide()
              if (data.result) {
                setDate()
                alert(data.message)
                $scope.agreeTime = null
              } else {
                alert(data.message)
              }
            },
            function() {
              alert('网络请求失败')
            }
          )
        }
      }
    }
  ])
  //还建业权人
  .controller('builtOwnerCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.roomId = $state.params.roomId
      $scope.projectId = $state.params.projectid
      $scope.no = '/'
      var createUser = server.server().userId

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])
  //还建补偿方案
  .controller('builtCompensateCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    '$rootScope',
    function($http, $scope, server, $state, dict, $rootScope) {
      $scope.roomId = $state.params.roomId
      $scope.projectId = $state.params.projectid
      var createUser = server.server().userId //用户id
      $scope.no = '/'

      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])
  //还建附件
  .controller('builtAttachmentCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      let userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.no = '/'
      // 关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId,
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      // 头部和时间
      $scope.listtop = {
        roomId: $state.params.roomId,
        projectId: $state.params.projectid,
        createUser: server.server().userId,
        imgHost: server.server().imgHost
      }
    }
  ])

  //我的工作
  .controller('myJobCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    '$cookieStore',
    '$rootScope',
    function(
      $http,
      $scope,
      server,
      dict,
      $state,
      $q,
      $cookieStore,
      $rootScope
    ) {
      let storage = window.localStorage
      $scope.projectId = storage.getItem('a')
      console.log($scope.projectId)
      let loginHost = server.server().loginHost
      $scope.imgHost = server.server().imgHost
      let mainurl = window.location.hash
      $scope.localhostImg = $rootScope.localhostimg
      $scope.headImg = server.server().headImg
      let userId = server.server().userId
      $scope.userId = server.server().userId
      if (!$scope.projectId) {
        storage.setItem('flagindex', 1)
        server.server().zjprojectprojectListdo({}, function(data) {
          if (data.result === true) {
            if (data.data && data.data.length > 0) {
              $scope.leftdata = data.data
              // storage.clear();//在赋值前先清除所有storage的缓存值
              if (!storage.getItem('a')) {
                storage.setItem('a', $scope.leftdata[0].id)
              }
              $scope.projectId = $scope.leftdata[0].id
            }

            $scope.$apply()
          } else {
            alert(data.message)
          }
        })
      }

      server.server().zjaffichelistdo(
        {
          pageNo: 1,
          pageSize: 5,
          searchKeys: ''
        },
        function(data) {
          if (data.result === true) {
            $scope.gruplist = data.data.rows
            $scope.totalgrup = data.data.total
            $scope.$apply()
          } else {
            alert(data.message)
          }
        },
        function(err) {}
      )
      $scope.typetrue = null
      console.log($scope.userId)
      if (!$scope.userId) {
        let indexxx = window.location.href.indexOf('=')
        let twoindex = window.location.href.indexOf('&')
        let lasgindex = window.location.href.indexOf('=')
        $scope.userId = window.location.href.substr(indexxx + 1, twoindex)
        let type = window.location.href.substr(lasgindex)
        $scope.typetrue = type
        if ($scope.typetrue) {
          storage.setItem('flagindex', 1)
        }
      } else {
        let lasgindex = window.location.href.indexOf('=')
        let type = window.location.href.substr(lasgindex)
        $scope.typetrue = type
        if ($scope.typetrue) {
          storage.setItem('flagindex', 1)
        }
      }
      // 跟进跟踪
      $scope.listtop = {
        projectId: $scope.projectId,
        createUser: $scope.userId,
        imgHost: server.server().imgHost,
        questiontype: 4, //1属性 2还建期数 3土地证基础数据 4跟进问题类型
        projectflag: 2, //项目id1  物业id2
        reloadajax: 1, //需要调用函数就传1 or ''
        locationflag: 1, //需要跳转到某页面就填写 1 or ''
        myMobFlag: true //是专门给myjob加上物业头的
      }
      $scope.action = {}
      $scope.dataFollowUp = function() {
        $scope.action.reset()
      }
      //跟进页面刷新
      $scope.myajax = function() {
        zjtaskqueryTrackingInformationdo(1, '', '', '', 1)
      }

      // 跳转存值
      $scope.shenpi = function(flag) {
        var storage = window.localStorage
        storage.setItem('f', 'examine')
        if (flag === 6) {
          storage.setItem('flagindex', 6)
        }
      }

      $scope.type = 1 //input值
      $scope.flag = true //物业跟进
      $scope.isActive = true //class切换
      ;($scope.dayCount = ''), //7天一个月
        ($scope.no = '--')
      $scope.hosturl = server.server().host
      $scope.solutionfalg = false //input提示警告
      //用户名和用户头像放
      if ($scope.userId) {
        server.server().zjmUserImg(
          {
            userId: $scope.userId
          },
          function(data) {
            if (data.result) {
              $scope.nickname = data.data.nickname //昵称
              $scope.realname = data.data.realname //真实名字
              $scope.photoUrl = data.data.photoUrl //用户头像
            } else {
              alert(data.message)
            }
          }
        )
      }

      //列表分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      $scope.searchKeys = '' //弹窗筛选
      $scope.searchAddVal = '' //弹窗添加筛选
      $scope.dimArrFlag = false //模糊搜索flag
      let timeout

      //收起
      $scope.PullUpShow = true //收起
      $scope.PullUpText = '收起'
      $scope.pullUp = function() {
        if ($scope.PullUpShow) {
          $scope.PullUpShow = false
          $scope.PullUpText = '展开'
        } else {
          $scope.PullUpShow = true
          $scope.PullUpText = '收起'
        }
      }

      // 弹窗关键业务指标列表获取
      $scope.goalSetting = function() {
        $('.myworktwo').dialog()
        $scope.goalSettingflag = true
        indexass($scope.searchKeys, 1)
        $scope.alertUpdateArr = [] //添加数组
        $scope.conf.currentPage = 1
      }
      //关闭弹窗
      $scope.addtrue = function() {
        $scope.conf.currentPage = 1
        $scope.goalSettingflag = false
        zjtaskqueryTrackingInformationdo(
          $scope.type,
          $scope.beginTime,
          $scope.endTimeendTime,
          $scope.dayCount,
          1
        )
      }
      //弹窗筛选
      $scope.alertSearch = function(val) {
        indexass(val, $scope.conf.currentPage)
      }

      //弹窗列表编缉
      $scope.alertUpdate = function(id, indx) {
        $scope.alertUpdateArr = $scope.alertRows[indx]
        $scope.alertRows.splice(indx, 1)
      }

      //弹窗修改(保存)
      $scope.alertsave = function(eve, indx) {
        // 还要做非空判断
        let _this = eve.target
        let childs = $(_this)
          .parents('tr')
          .find('td')
        for (let i = 2; i < childs.length - 1; i++) {
          if (
            childs
              .eq(i)
              .find('input')
              .val() === ''
          ) {
            alert('数值不能为空！')
            return
          }
        }
        $scope.alertUpdateArr.flag === 1
          ? updateindexass($scope.alertUpdateArr, indx)
          : Addsave($scope.alertUpdateArr, indx)
      }

      //模糊搜索列表添加
      $scope.alertliAdd = function(val, ind) {
        $scope.alertUpdateArr.organizationName = $scope.dimArr[ind].name
        $scope.alertUpdateArr.userName = $scope.dimArr[ind].realname
        $scope.alertUpdateArr.organizationId = $scope.dimArr[ind].deptId
        $scope.alertUpdateArr.userId = $scope.dimArr[ind].id
        $scope.alertUpdateArr.january = ''
        $scope.alertUpdateArr.february = ''
        $scope.alertUpdateArr.march = ''
        $scope.alertUpdateArr.april = ''
        $scope.alertUpdateArr.may = ''
        $scope.alertUpdateArr.june = ''
        $scope.alertUpdateArr.july = ''
        $scope.alertUpdateArr.august = ''
        $scope.alertUpdateArr.september = ''
        $scope.alertUpdateArr.october = ''
        $scope.alertUpdateArr.november = ''
        $scope.alertUpdateArr.december = ''
        $scope.alertUpdateArr.flag = 2

        $scope.searchAddVal = val //input值
        $scope.dimArrFlag = false //模糊值
        timeout = ''
      }

      //模糊搜索获取焦点事件
      $scope.addfocus = function(val) {
        $scope.dimArrFlag = true
        initAdddo() //模糊搜索
      }
      //模糊搜索失去焦点事件
      $scope.addblur = function(val) {
        timeout = setTimeout(function() {
          $scope.dimArrFlag = false
        }, 100)
      }
      //模糊搜索改变事件
      $scope.addchange = function(val) {
        initAdddo(val.toString())
      }

      // 模糊搜索ajax
      function initAdddo(searchKeys) {
        $scope.dimArr = []
        server.server().zjindexassignmentinitAdddo(
          {
            searchKeys: searchKeys || '' //搜索条件
          },
          data => {
            data.result ? (($scope.dimArr = data.data), $scope.$apply()) : ''
          }
        )
      }

      //模糊搜索保存
      function Addsave(arr, indx) {
        server.server().zjindexassignmentaddSavedo(
          {
            createUser: $scope.userId, //创建人
            organizationId: arr.organizationId, //组织结构id
            userId: arr.userId, //指派用户id
            january: arr.january, //一月
            february: arr.february, //二月
            march: arr.march, //三月
            april: arr.april, //四月
            may: arr.may, //五月
            june: arr.june, //六月
            july: arr.july, //七月
            august: arr.august, //八月
            september: arr.september, //九月
            october: arr.october, //十月
            november: arr.november, //十一月
            december: arr.december //十二月
          },
          data => {
            data.result
              ? ($scope.alertUpdateArr.flag === 1,
                $scope.alertRows.unshift($scope.alertUpdateArr),
                ($scope.alertUpdateArr = []),
                $scope.$apply(),
                alert('保存成功！', function() {
                  indexass($scope.searchKeys, $scope.conf.currentPage)
                  $scope.$apply()
                }))
              : alert(data.message)
          }
        )
      }

      // 弹窗关键业务指标列表展示
      function indexass(searchKeys, pageNo) {
        server.server().zjindexassignmentlistdo(
          {
            userId: $scope.userId,
            searchKeys: searchKeys || '', //搜索条件
            pageNo: pageNo || 1,
            pageSize: 10
          },
          data => {
            data.result
              ? (($scope.alertRows = data.data.rows),
                $scope.alertRows.forEach((item, i) => {
                  $scope.alertRows[i].flag = 1
                }),
                ($scope.conf.total = Math.ceil(
                  data.data.total / data.data.pageSize
                )),
                ($scope.conf.counts = data.data.total),
                $scope.$apply(),
                $scope.$broadcast('categoryLoaded'))
              : alert(data.message)
          }
        )
      }

      // 弹窗关键业务指标列表修改
      function updateindexass(arr) {
        server.server().zjindexassignmentupdateSavedo(
          {
            id: arr.id, //id
            updateUser: $scope.userId, //创建人
            organizationId: arr.organizationId, //组织结构id
            userId: arr.userId, //指派用户id
            january: arr.january, //一月
            february: arr.february, //二月
            march: arr.march, //三月
            april: arr.april, //四月
            may: arr.may, //五月
            june: arr.june, //六月
            july: arr.july, //七月
            august: arr.august, //八月
            september: arr.september, //九月
            october: arr.october, //十月
            november: arr.november, //十一月
            december: arr.december //十二月
          },
          data => {
            data.result
              ? (alert('修改成功！'),
                $scope.alertUpdateArr.flag === 1,
                $scope.alertRows.unshift($scope.alertUpdateArr),
                ($scope.alertUpdateArr = []),
                $scope.$apply())
              : alert(data.message)
          }
        )
      }
      $scope.bodyDataArr = [
        { id: 8, name: '08:00', flagClass: false, msgs: '', if: false },
        { id: 9, name: '09:00', flagClass: false, msgs: '', if: false },
        { id: 10, name: '10:00', flagClass: false, msgs: '', if: false },
        { id: 11, name: '11:00', flagClass: false, msgs: '', if: false },
        { id: 12, name: '12:00', flagClass: false, msgs: '', if: false },
        { id: 13, name: '13:00', flagClass: false, msgs: '', if: false },
        { id: 14, name: '14:00', flagClass: false, msgs: '', if: false },
        { id: 15, name: '15:00', flagClass: false, msgs: '', if: false },
        { id: 16, name: '16:00', flagClass: false, msgs: '', if: false },
        { id: 17, name: '17:00', flagClass: false, msgs: '', if: false },
        { id: 18, name: '18:00', flagClass: false, msgs: '', if: false },
        { id: 19, name: '19:00', flagClass: false, msgs: '', if: false },
        { id: 20, name: '20:00', flagClass: false, msgs: '', if: false }
      ]
      //今日工作提醒
      function async3() {
        if ($scope.userId) {
          $scope.threeshowArr = [] //黄色显示
          let p = new Promise((resolve, reject) => {
            server.server().zjtaskqueryTaskInfodo(
              {
                userId: $scope.userId
              },
              data => {
                if (data.result) {
                  $scope.taskquery = data.data
                  if (data.data.timeList.length > 0) {
                    $scope.yearmonthdata = dict.timeConverter3(
                      data.data.timeList[0].startDate,
                      1
                    )

                    for (var i = 0; i < data.data.timeList.length; i++) {
                      data.data.timeList[i].startDate = dict.timeConverter3(
                        data.data.timeList[i].startDate
                      )
                      data.data.timeList[i].endDate = dict.timeConverter3(
                        data.data.timeList[i].endDate
                      )
                      // hover
                      for (
                        var Q = data.data.timeList[i].startDate;
                        Q < data.data.timeList[i].endDate + 1;
                        Q++
                      ) {
                        $scope.threeshowArr.push(Q)

                        for (var k = 0; k < $scope.bodyDataArr.length; k++) {
                          if ($scope.bodyDataArr[k].id === Q) {
                            data.data.timeList[i].splitJointName
                              ? data.data.timeList[i].splitJointName
                              : (data.data.timeList[i].splitJointName = '/')
                            data.data.timeList[i].code
                              ? data.data.timeList[i].code
                              : (data.data.timeList[i].code = '/')
                            $scope.bodyDataArr[k].msgs =
                              data.data.timeList[i].splitJointName +
                              ' ' +
                              data.data.timeList[i].code
                          }
                        }
                      }
                    }
                    //颜色赋值
                    for (var j = 0; j < $scope.bodyDataArr.length; j++) {
                      for (var k = 0; k < $scope.threeshowArr.length; k++) {
                        if (
                          $scope.bodyDataArr[j].id === $scope.threeshowArr[k]
                        ) {
                          $scope.bodyDataArr[j].flagClass = true
                        }
                      }
                    }
                  }
                  $scope.$apply()
                  resolve(data.data)
                }
              }
            )
          })
          return p
        }
      }

      //移出
      $scope.mouseenters = function(ind) {
        if ($scope.bodyDataArr[ind].msgs) {
          $scope.stringleng = {
            width: dict.GetLength($scope.bodyDataArr[ind].msgs) * 14 + 'px'
          }
          $scope.bodyDataArr[ind].if = true
        }
      }
      //移入
      $scope.mouseleaves = function(ind) {
        if ($scope.bodyDataArr[ind].msgs) {
          $scope.bodyDataArr[ind].if = false
        }
      }

      //关键业务指标列表
      function async1() {
        let p = new Promise((resolve, reject) => {
          server.server().zjindexassignmenttaskCountdo(
            {
              // userId:userId
            },
            data => {
              data.result
                ? (($scope.taskCount = data.data),
                  $scope.$apply(),
                  resolve(data.data))
                : alert(data.message)
            }
          )
        })
        return p
      }

      //关键业务指标柱状图
      let datakey = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
      ]
      function async2() {
        $scope.okNumber = []
        $scope.totalNumber = []
        $scope.noNumber = []
        let p = new Promise((resolve, reject) => {
          server.server().zjindexassignmenttaskColumnardo(
            {
              userId: $scope.userId
            },
            data => {
              if (data.result) {
                datakey.forEach((item, j) => {
                  for (var i in data.data.taskNumber) {
                    if (i == datakey[j]) {
                      $scope.totalNumber.push(data.data.taskNumber[i])
                      $scope.okNumber.push(data.data.accomplishNumber[i])
                      delete data.data.taskNumber[i]
                    }
                  }
                })
                $scope.totalNumber.forEach((item, ind) => {
                  let numbers = $scope.totalNumber[ind] - $scope.okNumber[ind]
                  if (numbers < 0) {
                    numbers = 0
                  }
                  $scope.noNumber.push(numbers)
                })
                // echart($scope.okNumber,$scope.noNumber)
                resolve(data.data)
              }
            }
          )
        })
        return p
      }

      Promise.all([async3(), async1(), async2()]).then(data => {})

      //柱状图
      function echart(ok, no) {
        let myChart = echarts.init(document.getElementById('main'))
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            // feature: {
            //     dataView: {show: false, readOnly: false},
            //     magicType: {show: true, type: ['line', 'bar']},
            //     restore: {show: true},
            //     saveAsImage: {show: false}
            // }
          },
          legend: {
            data: ['签约目标达成', '签约目标未达成']
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月'
              ],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '',
              min: 0,
              max: 150,
              interval: 100,
              axisLabel: {
                formatter: '{value} '
              }
            }
          ],
          series: [
            {
              name: '签约目标达成',
              type: 'bar',
              data: ok
            },
            {
              name: '签约目标未达成',
              type: 'bar',
              data: no
            }
          ]
        }
        myChart.setOption(option)
      }

      // radio切换
      $scope.radios = function(val) {
        $scope.type = val
        val == 1 ? ($scope.flag = true) : ($scope.flag = !$scope.flag)
        !$scope.endTimeendTime
          ? $('.childData1').val('')
          : ($scope.dayCount = '')
        zjtaskqueryTrackingInformationdo(val, '', '', $scope.dayCount, 1)
      }

      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit+searchKeys',
        function(news) {
          $scope.goalSettingflag
            ? indexass($scope.searchKeys, $scope.conf.currentPage)
            : $scope.type == '1'
              ? zjtaskqueryTrackingInformationdo(
                  1,
                  $scope.beginTime,
                  $scope.endTimeendTime,
                  $scope.dayCount,
                  $scope.conf.currentPage
                )
              : zjtaskqueryTrackingInformationdo(
                  2,
                  $scope.beginTime,
                  $scope.endTimeendTime,
                  $scope.dayCount,
                  $scope.conf.currentPage
                )
        }
      )

      //star时间筛选
      function runAsync1(inputval, boxval, flag, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          min: '2010-8-11',
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.beginTime = value
            if (flag) {
              callback(value)
            }
          }
        })
      }
      //end时间筛选
      function runAsync2(inputval, boxval, stardata, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            callback(value)
          }
        })
      }

      // end时间调接口筛选
      $scope.alertData = function(child, parent, flag) {
        if (flag === 1) {
          runAsync1(child, parent, 1, function(time) {
            if ($scope.endTimeendTime && $scope.beginTime) {
              zjtaskqueryTrackingInformationdo(
                $scope.type,
                time,
                $scope.endTimeendTime,
                $scope.dayCount,
                $scope.conf.currentPage
              )
            }
          })
        } else {
          !$scope.beginTime
            ? alert('请选择开始时间')
            : runAsync2(child, parent, $scope.beginTime, function(value) {
                value
                  ? (($scope.dayCount = ''),
                    ($scope.endTimeendTime = value),
                    zjtaskqueryTrackingInformationdo(
                      $scope.type,
                      $scope.beginTime,
                      value,
                      $scope.dayCount,
                      $scope.conf.currentPage
                    ))
                  : alert('请选择结束时间')
              })
        }
      }

      //7天 一个月筛选
      $scope.isActive = false
      $scope.isActive2 = false
      $scope.monthData = function(val) {
        $scope.beginTime = ''
        $('.childData1').val('')
        $scope.endTimeendTime = ''
        $('.childData2').val('')

        val == 7
          ? (($scope.isActive = !$scope.isActive),
            $scope.isActive
              ? (($scope.isActive2 = false), ($scope.dayCount = 7))
              : ($scope.dayCount = ''))
          : (($scope.isActive2 = !$scope.isActive2),
            $scope.isActive2
              ? (($scope.isActive = false), ($scope.dayCount = 30))
              : ($scope.dayCount = ''))
        zjtaskqueryTrackingInformationdo(
          $scope.type,
          $scope.beginTime,
          $scope.endTimeendTime,
          $scope.dayCount,
          $scope.conf.currentPage
        )
      }

      //导出
      $scope.edit = function() {
        let host = $scope.hosturl + 'task/queryTrackingInformation.do'
        $scope.link =
          host +
          '?createUser=' +
          $scope.userId +
          '&type=' +
          $scope.type +
          '&beginTime=' +
          ($scope.beginTime || '') +
          '&endTime=' +
          ($scope.endTimeendTime || '') +
          '&dayCount=' +
          $scope.dayCount +
          '&export=' +
          $scope.type +
          '&pageNo=' +
          $scope.conf.currentPage +
          '&pageSize=' +
          5
      }

      //失去焦点事件
      $scope.focuss = function(val) {
        !val ? ($scope.solutionfalg = true) : ($scope.solutionfalg = false)
      }

      //添加
      $scope.addmethod = function(id, indx) {
        $('.myworkthree').dialog()
        $scope.addId = id
        $scope.addarr = $scope.rows1[indx]
        $scope.index = indx
      }
      //添加保存
      $scope.addsave = function(id, val, indx) {
        if (!val) {
          $scope.solutionfalg = true
          return
        }
        server.server().zjtaskaddSolutiondo(
          {
            id: id, //跟踪id	是
            solution: val //解决办法	是
          },
          data => {
            if (data.result === true) {
              $('.myworkthree').fadeOut(200)
              $scope.rows1[indx].solution = val
              $scope.solution = ''
              $scope.$apply()
              alert('添加保存成功！')
            } else {
              alert(data.message)
            }
          }
        )
      }

      //删除
      $scope.genjindel = function(id, indx) {
        confirm('确认删除吗？', function() {
          server.server().zjtaskdeleteTrackStatusdo(
            {
              id: id
            },
            data => {
              data.result
                ? ($scope.rows1.splice(indx, 1), $scope.$apply())
                : alert(data.message)
            }
          )
        })
      }

      // 物业跟进 列表ajax
      function zjtaskqueryTrackingInformationdo(
        type,
        beginTime,
        endTimeendTime,
        dayCount,
        pageNo
      ) {
        $scope.rows1 = ''
        $scope.rows2 = ''
        server.server().zjtaskqueryTrackingInformationdo(
          {
            createUser: $scope.userId, //用户id
            type: type, //类型
            beginTime: beginTime || '', //开始时间
            endTime: endTimeendTime || '', //结束时间
            dayCount: dayCount || '', //天数
            export: '', //导出操作
            pageNo: pageNo || 1, //页数
            pageSize: 5 //每页条数
          },
          data => {
            if (data.result === true) {
              if (data.data.rows) {
                if (type == '1') {
                  $scope.rows1 = data.data.rows
                  $scope.conf.total = Math.ceil(
                    data.data.total / data.data.pageSize
                  )
                  $scope.conf.counts = data.data.total
                  $scope.$broadcast('categoryLoaded')
                } else {
                  $scope.rows2 = data.data.rows
                  $scope.rows2.forEach(function(item, index) {
                    $scope.rows2[index].totalMoneyCompensate = Number(
                      $scope.rows2[index].totalMoneyCompensate
                    ).toFixed(2)
                  })
                  $scope.conf.total = Math.ceil(
                    data.data.total / data.data.pageSize
                  )
                  $scope.conf.counts = data.data.total
                  $scope.$broadcast('categoryLoaded')
                }

                $scope.$apply()
              }
            }
          }
        )
      }
    }
  ])
  //事件列表
  .controller('jobEventListCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    '$cookieStore',
    function($http, $scope, server, dict, $state, $q, $cookieStore) {
      $scope.projectId = $state.params.projectid //项目的id
      let userId = server.server().userId
      $scope.userId = userId
      $scope.type = '' //会议
      $scope.operaterType = '' //发起
      $scope.theme = '' //搜索
      $scope.time = '' //默认7天
      $scope.beginTime = '' //开始时间
      $scope.endTime = '' //结束时间
      $scope.isActive = true //7天一个月反选
      $scope.no = '--'
      $scope.host = server.server().host //下载
      let useurl = $cookieStore.get('mainurl')
      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      $scope.PullUpShow = true //收起
      $scope.PullUpText = '收起'
      $scope.pullUp = function() {
        if ($scope.PullUpShow) {
          $scope.PullUpShow = false
          $scope.PullUpText = '展开'
        } else {
          $scope.PullUpShow = true
          $scope.PullUpText = '收起'
        }
      }

      //单选
      $scope.radios = function(val, flag) {
        flag === 1
          ? EventListdo(
              $scope.operaterType,
              val,
              $scope.theme,
              $scope.time,
              $scope.beginTime,
              $scope.endTime,
              $scope.conf.currentPage
            )
          : EventListdo(
              val,
              $scope.type,
              $scope.theme,
              $scope.time,
              $scope.beginTime,
              $scope.endTime,
              $scope.conf.currentPage
            )
      }

      //事件主题筛选
      $scope.search = function(val) {
        EventListdo(
          $scope.operaterType,
          $scope.type,
          val,
          $scope.time,
          $scope.beginTime,
          $scope.endTime,
          $scope.conf.currentPage
        )
      }

      // 完成
      $scope.done = function(index) {
        server.server().zpersoneventupdateStatusdo(
          {
            id: $scope.rows[index].id
          },
          data => {
            if (data.result) {
              EventListdo(
                $scope.operaterType,
                $scope.type,
                $scope.theme,
                $scope.time,
                $scope.beginTime,
                $scope.endTime,
                $scope.conf.currentPage
              )
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //7天 一个月筛选
      $scope.isActive2 = false
      $scope.isActive = false
      $scope.monthData = function(val) {
        $scope.beginTime = ''
        $('.childData1').val('')
        $scope.endTime = ''
        $('.childData2').val('')
        val == 1
          ? (($scope.isActive = !$scope.isActive),
            $scope.isActive
              ? (($scope.isActive2 = false), ($scope.time = 1))
              : ($scope.time = ''))
          : (($scope.isActive2 = !$scope.isActive2),
            $scope.isActive2
              ? (($scope.isActive = false), ($scope.time = 2))
              : ($scope.time = ''))
        EventListdo(
          $scope.operaterType,
          $scope.type,
          $scope.theme,
          $scope.time,
          $scope.beginTime,
          $scope.endTime,
          $scope.conf.currentPage
        )
      }

      //star时间筛选
      function runAsync1(inputval, boxval) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          min: '2010-8-11',
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.beginTime = value
          }
        })
      }
      //end时间筛选
      function runAsync2(inputval, boxval, stardata, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            callback(value)
          }
        })
      }

      // end时间调接口筛选
      $scope.alertData = function(child, parent, flag) {
        if (flag === 1) {
          runAsync1(child, parent)
        } else {
          !$scope.beginTime
            ? alert('请选择开始时间')
            : runAsync2(child, parent, $scope.beginTime, value => {
                value
                  ? (($scope.dayCount = ''),
                    ($scope.beginTime = $scope.beginTime.toString()),
                    ($scope.endTime = value.toString()),
                    ($scope.time = ''),
                    EventListdo(
                      $scope.operaterType,
                      $scope.type,
                      $scope.theme,
                      $scope.time,
                      $scope.beginTime,
                      value,
                      $scope.conf.currentPage
                    ),
                    $scope.$apply())
                  : alert('请选择结束时间')
              })
        }
      }
      //分页
      $scope.$watch('conf.currentPage + conf.itemPageLimit + theme', function(
        news
      ) {
        EventListdo(
          $scope.type,
          $scope.operaterType,
          $scope.theme,
          $scope.time,
          $scope.beginTime,
          $scope.endTime,
          $scope.conf.currentPage
        )
      })
      //列表获取ajax
      function EventListdo(
        operaterType,
        type,
        theme,
        time,
        beginTime,
        endTime,
        pageNO
      ) {
        $scope.rows = []
        server.server().zjpersoneventserachPersonEventListdo(
          {
            userId: server.server().userId,
            operaterType: operaterType, //标题名称	否 默认null	参与方式 1我发起的   2我参与的
            type: type, //类型	否  默认null 	事件类型   1会议   2培训
            theme: theme || '', //事件主题	否 默认null	根据主题搜索相关信息
            time: time || '', //时间	否	1近7天事件    2近30天事件
            beginTime: beginTime || '',
            endTime: endTime || '',
            pageNO: pageNO || 1,
            pageSize: 10
          },
          data => {
            data.result
              ? data.data.rows
                ? (($scope.rows = data.data.rows),
                  $scope.rows.sort(function(p1, p2) {
                    return (
                      new Date(p2.startTime).getTime() -
                      new Date(p1.startTime).getTime()
                    )
                  }),
                  ($scope.conf.total = Math.ceil(
                    data.data.total / data.data.pageSize
                  )),
                  ($scope.conf.counts = data.data.total),
                  $scope.$broadcast('categoryLoaded'),
                  $scope.$apply())
                : ''
              : alert(data.message)
          }
        )
      }

      //时间选择ajax
      function addAsync(inputval, boxval, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: function(val) {
            callback(val)
          }
        })
      }

      $scope.add = {
        theme: '',
        time: '',
        address: '',
        things: '',
        peopel: ''
      }
      $scope.addflag = {
        theme: false,
        time: false,
        address: false,
        things: false,
        peopel: false
      }
      $scope.peopleId = []
      $scope.peoplename = [] //联系人数组
      $scope.updateanme = [] //修改

      // 模糊输入ajax
      function initAdddo(searchKeys, flag, back) {
        $scope.dimArr = []
        server.server().zjindexassignmentinitAdddo(
          {
            projectId: $scope.projectId,
            searchKeys: searchKeys || '' //搜索条件
          },
          data => {
            if (data.result) {
              $scope.dimArr = data.data
              if (flag) {
                back(data.data)
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //获取焦点事件
      $scope.addfocus = function(val, flag) {
        initAdddo(val)
        $scope.dimArrFlag = true
      }
      //失去焦点
      $scope.addblur = function(val, flag) {
        if (flag) {
          $scope.updateanme.length >= 0
            ? ($scope.updateflag.participate = false)
            : ($scope.updateflag.participate = true)
        } else {
          $scope.peoplename.length >= 0
            ? ($scope.addflag.people = false)
            : ($scope.addflag.people = true)
        }

        setTimeout(function() {
          $scope.dimArrFlag = false
          $scope.$apply()
        }, 200)
      }

      //点击选择
      $scope.alertliAdd = function(name, id, ind, flag) {
        $scope.myflag = true
        if (flag) {
          if ($scope.updateanme.length > 0) {
            $scope.updateanme.forEach(function(itemm, i) {
              if (id == $scope.updateanme[i].id) {
                $scope.myflag = false
                return
              }
            })
          }
          if ($scope.myflag) {
            $scope.updateanme.push($scope.dimArr[ind])
            $scope.participate = ''
          }
        } else {
          if ($scope.peoplename.length > 0) {
            $scope.peoplename.forEach(function(itemm, i) {
              if (id == $scope.peoplename[i].id) {
                $scope.myflag = false
                return
              }
            })
          }
          if ($scope.myflag) {
            $scope.peoplename.push($scope.dimArr[ind])
            $scope.add.peopel = ''
          }
        }
      }

      // 模糊输入
      $scope.addchange = function(val, flag) {
        initAdddo(val, 1, function(data) {
          if (data.length <= 0) {
            $scope.dimArrFlag = false
          }
          $scope.dimArrFlag = true
          $scope.$apply()
        })
      }

      //模糊删除
      $scope.peopeldel = function(indx, flag) {
        if (flag) {
          $scope.updateanme.splice(indx, 1) //修改
        } else {
          $scope.peoplename.splice(indx, 1) //联系人数组
        }
      }

      $scope.addtype = 1 //添加类型
      $scope.dimArrFlag = false //模糊显示
      //add单选
      $scope.addradios = function(val) {
        $scope.addtype = val
      }
      //时间选择
      $scope.adddataclick = function(inputval, boxval) {
        addAsync(inputval, boxval, val => {
          $scope.add.time = val
          $scope.addflag.time = false
          $scope.$apply()
        })
      }

      //上传添加文件数组返回src
      $scope.fileArr = []
      $scope.fileNameChanged = function(e) {
        var files = e.target.files
        var eve = e.target
        for (var i = 0; i < files.length; i++) {
          filesupdate(files[i], eve)
        }
      }
      function filesupdate(file, eve) {
        var fd = new FormData()
        if (file) {
          var ext = file.name
            .slice(file.name.lastIndexOf('.') + 1)
            .toLowerCase()
          if (ext == 'xls' || ext == 'xlsx' || ext == 'csv') {
            fd.append('multipartFile', file)
            $http({
              method: 'POST',
              url: $scope.host + 'attachment/fielUpload.do',
              data: fd,
              headers: { 'Content-Type': undefined },
              transformRequest: angular.identity
            }).then(function successCallback(data) {
              eve.value = ''
              if (data.data.result) {
                $scope.fileArr.push(data.data.data)
              } else {
                alert(data.message)
              }
            })
            $scope.$apply()
          } else {
            eve.value = ''
            alert('只能上传Excle文件')
            return false
          }
        }
      }

      //input上传文件删除
      $scope.fileArrDel = function(ind) {
        $scope.fileArr.splice(ind, 1)
      }

      //失去焦点事件
      $scope.addsBlur = function(val, flag) {
        addsblurval(val, flag)
      }

      function addsblurval(val, flag) {
        if (flag == 'theme') {
          !val ? ($scope.addflag.theme = true) : ($scope.addflag.theme = false)
        }
        if (flag == 'time') {
          !val ? ($scope.addflag.time = true) : ($scope.addflag.time = false)
        }
        if (flag == 'address') {
          !val
            ? ($scope.addflag.address = true)
            : ($scope.addflag.address = false)
        }

        // if(flag == 'things'){
        //     !val?$scope.addflag.things=true:$scope.addflag.things=false
        // }
      }
      //添加保存
      $scope.addsave = function() {
        let addpeopels = []
        if (!$scope.add.theme) {
          $scope.addflag.theme = true
          return
        } else {
          $scope.addflag.theme = false
        }
        if (!$scope.add.time) {
          $scope.addflag.time = true
          return
        } else {
          $scope.addflag.time = false
        }
        if (!$scope.add.address) {
          $scope.addflag.address = true
          return
        } else {
          $scope.addflag.address = false
        }
        // if(!$scope.add.things){$scope.addflag.things=true;return;}else{$scope.addflag.things=false;}
        if ($scope.peoplename.length <= 0) {
          $scope.addflag.people = true
          return
        } else {
          $scope.addflag.people = false
        }
        //人
        $scope.peoplename.forEach(function(item, i) {
          addpeopels.push($scope.peoplename[i].id)
        })

        //附件
        $scope.attachments = []
        if ($scope.fileArr.length > 0) {
          $scope.fileArr.forEach(function(item, i) {
            $scope.attachments[i] = {
              filePath: $scope.fileArr[i].filePath,
              fileName: $scope.fileArr[i].fileName,
              size: $scope.fileArr[i].size
            }
          })
        }

        server.server().zjpersoneventaddSavePersonEventdo(
          {
            createUser: userId, //创建者id	是
            theme: $scope.add.theme,
            type: $scope.addtype, //状态	是
            startTime: $scope.add.time, //开始时间	是
            address: $scope.add.address, //是地址
            description: $scope.add.theme, //会议内容	是
            participateUser: addpeopels.join(','), //参与者id	是
            attachments:
              $scope.attachments.length > 0
                ? JSON.stringify($scope.attachments)
                : '' //	附件名称	否
          },
          data => {
            data.result
              ? (($scope.add.theme = ''),
                ($scope.add.time = ''),
                ($scope.add.address = ''),
                ($scope.add.things = ''),
                ($scope.add.peopel = ''),
                $('.addchild1').val(''),
                ($scope.fileArr = []),
                ($scope.peopleId = []),
                ($scope.peoplename = []),
                alert('添加成功！', function() {
                  EventListdo(
                    $scope.type,
                    $scope.operaterType,
                    $scope.theme,
                    $scope.time,
                    $scope.beginTime,
                    $scope.endTime,
                    $scope.conf.currentPage
                  )
                }),
                $('.h-myworkone').fadeOut(200),
                $scope.$apply())
              : alert(data.message)
          }
        )
      }

      // 查看ajax
      function getajaxval(id, flag) {
        $scope.seedata = '' //显示对象
        $scope.participate = '' //联系人名字
        $scope.participateid = []
        $scope.updateanme = []
        $scope.fileArr = []
        $scope.peopleId = []
        server.server().zjpersoneventfindPersonEventByIddo(
          {
            id: id
          },
          data => {
            data.result
              ? (($scope.seedata = data.data),
                //主题
                ($scope.seedata.theme = data.data.theme),
                // 类型
                ($scope.seedata.type = data.data.type),
                //描述内容
                ($scope.seedata.description = data.data.description),
                //地址
                ($scope.seedata.address = data.data.address),
                //开始时间
                ($scope.seedata.startTime = dict.timeConverter3(
                  $scope.seedata.startTime,
                  4
                )),
                //标志位
                ($scope.seedata.flag = flag),
                data.data.participateUser.forEach((item, i) => {
                  $scope.updateanme[i] = {
                    id: data.data.participateUser[i].join_user_id,
                    realname: data.data.participateUser[i].realname
                  }
                }),
                //附件数组
                ($scope.seedata.attachment = data.data.attachment),
                $scope.$apply(),
                $('.h-myworktwo').dialog())
              : alert(data.message)
          }
        )
      }

      //查看下载
      $scope.seeFileDown = function(file, name) {
        let downhost = $scope.host + file
        $scope.link = downhost
        $scope.linkName = name
      }

      //修改删除下载
      $scope.updatedel = function(indx) {
        confirm('确认删除吗?', function() {
          $scope.seedata.attachment.splice(indx, 1)
          $scope.$apply()
        })
      }

      //修改时间选择
      $scope.updateataclick = function(inputval, boxval) {
        addAsync(inputval, boxval, val => {
          $scope.seedata.startTime = val
          $scope.updateflag.time = false
          $scope.$apply()
        })
      }

      $scope.updateflag = {
        theme: false,
        startTime: false,
        address: false,
        description: false, //描述
        participate: false //联第人
      }

      //失去焦点
      $scope.updatesBlur = function(val, flag) {
        if (flag == 'theme') {
          !val
            ? ($scope.updateflag.theme = true)
            : ($scope.updateflag.theme = false)
        }
        if (flag == 'address') {
          !val
            ? ($scope.updateflag.address = true)
            : ($scope.updateflag.address = false)
        }
        if (flag == 'startTime') {
          !val
            ? ($scope.updateflag.startTime = true)
            : ($scope.updateflag.startTime = false)
        }
        // if(flag == 'description'){
        //     !val?$scope.updateflag.description=true:$scope.updateflag.description=false
        // }
      }

      //查看弹窗
      $scope.see = function(id, ind) {
        for (var key in $scope.updateflag) {
          $scope.updateflag[key] = false
        }
        $scope.seeeditflag = false
        getajaxval(id, 1)
      }

      //编缉修改弹窗
      $scope.edit = function(id, ind) {
        $scope.getid = id
        $scope.seeeditflag = true
        getajaxval(id, 2)
      }

      //修改保存
      $scope.updatesave = function(getid, flag) {
        let updatepeopel = []
        let updatefujian = []
        if (flag == 2) {
          if (!$scope.seedata.theme) {
            $scope.updateflag.theme = true
            return
          } else {
            $scope.updateflag.theme = false
          }
          if (!$scope.seedata.startTime) {
            $scope.updateflag.startTime = true
            return
          } else {
            $scope.updateflag.startTime = false
          }
          if (!$scope.seedata.address) {
            $scope.updateflag.address = true
            return
          } else {
            $scope.updateflag.address = false
          }
          // if(!$scope.seedata.description){$scope.updateflag.description=true;return}else{$scope.updateflag.description=false};
          if ($scope.updateanme.length <= 0) {
            $scope.updateflag.participate = true
            return
          } else {
            $scope.updateflag.participate = false
          }
          $scope.updateanme.forEach(function(item, i) {
            updatepeopel.push($scope.updateanme[i].id)
          })

          if ($scope.seedata.attachment.length > 0) {
            $scope.seedata.attachment.forEach(function(item, i) {
              updatefujian.push($scope.seedata.attachment[i].id)
            })
          }
          //附件
          $scope.attachments = []
          if ($scope.fileArr.length > 0) {
            $scope.fileArr.forEach(function(item, i) {
              $scope.attachments[i] = {
                filePath: $scope.fileArr[i].filePath,
                fileName: $scope.fileArr[i].fileName,
                size: $scope.fileArr[i].size
              }
            })
          }

          server.server().zjpersoneventupdateSavePersonEventdo(
            {
              theme: $scope.seedata.theme,
              updateUser: userId, //创建者id	是
              type: $scope.seedata.type, //状态	是	1 会议2               //培训
              startTime: $scope.seedata.startTime, //开始时间	是
              address: $scope.seedata.address, //地址	是
              description: $scope.seedata.description, //会议内容	是
              participateUser: updatepeopel.join(','), //参与者id	是	采用拼接的方式'
              enclosure: updatefujian.length > 0 ? updatefujian.join(',') : '', //附件	是	附件地址采用拼接的方式
              attachments:
                $scope.attachments.length > 0
                  ? JSON.stringify($scope.attachments)
                  : '',
              id: getid //事件id
            },
            data => {
              data.result
                ? (($scope.seedata.theme = ''),
                  ($scope.seedata.startTime = ''),
                  ($scope.seedata.address = ''),
                  ($scope.seedata.description = ''),
                  ($scope.updateanme = []),
                  ($scope.seedata.attachment = []),
                  $scope.$apply(),
                  alert('修改成功！', function() {
                    EventListdo(
                      $scope.type,
                      $scope.operaterType,
                      $scope.theme,
                      $scope.time,
                      $scope.beginTime,
                      $scope.endTime,
                      $scope.conf.currentPage
                    )
                  }),
                  $('.h-myworktwo').fadeOut(200))
                : alert(data.message)
            }
          )
        }
      }

      //删除列表
      $scope.del = function(id, ind) {
        confirm('确认要删除吗？', function() {
          server.server().zjpersoneventdeletePersonEventByIddo(
            {
              id: id,
              userId: userId
            },
            data => {
              data.result
                ? ($scope.rows.splice(ind, 1), $scope.$apply())
                : alert(data.message)
            }
          )
        })
      }

      //新增
      $scope.adds = function() {
        $('.h-myworkone').dialog()
        $scope.add.theme = ''
        $scope.add.time = ''
        $scope.add.address = ''
        $scope.add.things = ''
        $scope.add.peopel = ''
        $scope.fileArr = []
        $scope.peopleId = []
        $('.addchild1').val('')
      }
    }
  ])
  //任务列表
  .controller('jobTaskListCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.projectId = $state.params.projectid //项目的id
      let userId = server.server().userId

      $scope.PullUpShow = true //收起
      $scope.PullUpText = '收起'
      $scope.type = '' //参与方式
      $scope.nodeId = '' //任务节点
      $scope.theme = '' //搜索
      $scope.dayCount = '' //默认7天
      $scope.beginTime = '' //开始时间
      $scope.endTime = '' //结束时间
      $scope.isActive = true //7天一个月反选
      $scope.no = '--'
      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      //收起
      $scope.pullUp = function() {
        if ($scope.PullUpShow) {
          $scope.PullUpShow = false
          $scope.PullUpText = '展开'
        } else {
          $scope.PullUpShow = true
          $scope.PullUpText = '收起'
        }
      }
      //input单选获取
      server.server().zjtaskinitOrderSignNodedo({}, data => {
        if (data.result) {
          $scope.initOrder = data.data
          $scope.$apply()
        } else {
          alert(data.message)
        }
      })

      //单选 参与方式
      $scope.radios = function(val, flag) {
        if (flag == 1) {
          $scope.firstId = $scope.initOrder[val].id
          EventListdo(
            $scope.initOrder[val].id,
            $scope.type,
            $scope.dayCount,
            $scope.beginTime,
            $scope.endTime,
            $scope.conf.currentPage,
            $scope.theme
          )
        } else if (flag == 2) {
          EventListdo(
            $scope.firstId,
            val,
            $scope.dayCount,
            $scope.beginTime,
            $scope.endTime,
            $scope.conf.currentPage,
            $scope.theme
          )
        } else {
          $scope.firstId = ''
          EventListdo(
            $scope.firstId,
            $scope.type,
            $scope.dayCount,
            $scope.beginTime,
            $scope.endTime,
            $scope.conf.currentPage,
            $scope.theme
          )
        }
      }

      //事件主题筛选
      $scope.search = function(val) {
        EventListdo(
          $scope.firstId,
          $scope.type,
          $scope.dayCount,
          $scope.beginTime,
          $scope.endTime,
          $scope.conf.currentPage,
          val
        )
      }

      //7天 一个月筛选
      $scope.isActive = false
      $scope.isActive2 = false
      $scope.monthData = function(val) {
        $scope.beginTime = ''
        $('.childData1').val('')
        $scope.endTime = ''
        $('.childData2').val('')
        val == 1
          ? (($scope.isActive = !$scope.isActive),
            $scope.isActive
              ? (($scope.isActive2 = false), ($scope.dayCount = 1))
              : ($scope.dayCount = ''))
          : (($scope.isActive2 = !$scope.isActive2),
            $scope.isActive2
              ? (($scope.isActive = false), ($scope.dayCount = 2))
              : ($scope.dayCount = ''))
        EventListdo(
          $scope.firstId,
          $scope.type,
          $scope.dayCount,
          $scope.beginTime,
          $scope.endTime,
          $scope.conf.currentPage,
          $scope.theme
        )
      }

      //star时间筛选
      function runAsync1(inputval, boxval, flag, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          min: '2010-8-11',
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.beginTime = value
            if (flag) {
              callback(value)
            }
          }
        })
      }
      //end时间筛选
      function runAsync2(inputval, boxval, stardata, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          format: 'yyyy-MM-dd', //可任意组合
          show: true, //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            callback(value)
          }
        })
      }

      // end时间调接口筛选
      $scope.alertData = function(child, parent, flag) {
        if (flag === 1) {
          runAsync1(child, parent)
        } else {
          !$scope.beginTime
            ? alert('请选择开始时间')
            : runAsync2(child, parent, $scope.beginTime, value => {
                value
                  ? (($scope.dayCount = ''),
                    ($scope.beginTime = $scope.beginTime.toString()),
                    ($scope.endTime = value.toString()),
                    EventListdo(
                      $scope.firstId,
                      $scope.type,
                      $scope.dayCount,
                      $scope.beginTime,
                      $scope.endTime,
                      $scope.conf.currentPage,
                      $scope.theme
                    ),
                    $scope.$apply())
                  : alert('请选择结束时间')
              })
        }
      }
      //分页
      $scope.$watch('conf.currentPage + conf.itemPageLimit + theme', function(
        news
      ) {
        EventListdo(
          $scope.firstId,
          $scope.type,
          $scope.dayCount,
          $scope.beginTime,
          $scope.endTime,
          $scope.conf.currentPage,
          $scope.theme
        )
      })

      //列表查询ajax
      function EventListdo(
        nodeId,
        type,
        dayCount,
        beginTime,
        endTime,
        pageNO,
        theme
      ) {
        $scope.rows = []
        server.server().zjtaskqueryTaskEventListdo(
          {
            userId: userId, //当前用户id	是
            nodeId: nodeId, //节点id	是	全部传空
            type: type, //类型	参与方式		1.表示我发布的 2表示我执行的 全部传空
            dayCount: dayCount || '', ////天数	否	1近7天事件    2近30天事件
            beginTime: beginTime || '',
            endTime: endTime || '',
            pageNO: pageNO || 1,
            pageSize: 10,
            theme: theme || ''
          },
          data => {
            if (data.result) {
              $scope.rows = data.data.rows
              if ($scope.rows.length > 0) {
                $scope.rows.sort(function(p1, p2) {
                  return p2.startDate - p2.startDate
                })
                $scope.conf.total = Math.ceil(
                  data.data.total / data.data.pageSize
                )
                $scope.conf.counts = data.data.total
                $scope.$broadcast('categoryLoaded')
                $scope.$apply()
              }
            } else {
              alert(data.message)
            }
          }
        )
      }

      //物业输入项目拿id=========================================
      $scope.addfocusproject = function(val) {
        if (!val) {
          $scope.projectuserId = null
        }
        server.server().zjprojectprojectVaguedo(
          {
            searchKeys: val
          },
          data => {
            if (data.result) {
              console.log(data)
              $scope.dimArrproject = data.data
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      //物业输入项目拿id
      $scope.addchangeproject = function(val) {
        if (!val) {
          $scope.projectuserId = null
        }
        server.server().zjprojectprojectVaguedo(
          {
            searchKeys: val
          },
          data => {
            if (data.result) {
              console.log(data)
              $scope.dimArrproject = data.data
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      // 失去隐藏
      $scope.addblurproject = function(val) {
        setTimeout(function() {
          $scope.dimArrproject = []
          $scope.$apply()
        }, 200)
      }

      // 项目ul 选择
      $scope.alertliAddproject = function(indx) {
        $scope.projectuserId = $scope.dimArrproject[indx].id
        $scope.add.peopelproject = $scope.dimArrproject[indx].projectName
      }

      // =================================================================

      //hover事件
      $scope.queryEventDesc = function(id, indx) {
        $scope.EventDesc = $scope.rows[indx]
      }
      //删除
      $scope.dell = function(id, indx) {
        confirm('确认删除该条吗', function() {
          server.server().zjtaskupdateTaskStatusdo(
            {
              id: id
            },
            data => {
              data.result
                ? ($scope.rows.splice(indx, 1), $scope.$apply())
                : alert(data.message)
            }
          )
        })
      }
      //接收
      $scope.takeIn = function(id, indx, flag) {
        if (flag != 1) {
          confirm('确认接收吗？', function() {
            server.server().zjtasktaskIsAcceptdo(
              {
                id: id,
                type: 1
              },
              data => {
                data.result
                  ? (($scope.rows[indx].isAccept = 1), $scope.$apply())
                  : alert(data.message)
              }
            )
          })
        }
      }
      //退回
      $scope.backs = function(id, indx, flag) {
        if (flag != 2) {
          confirm('确认退回吗？', function() {
            server.server().zjtasktaskIsAcceptdo(
              {
                id: id,
                type: 2
              },
              data => {
                data.result
                  ? (($scope.rows[indx].isAccept = 2), $scope.$apply())
                  : alert(data.message)
              }
            )
          })
        }
      }

      //
      $scope.add = {
        peopel: '', //peopel input 人
        person: '', //peopel input 人
        parentOption: '', //select parent
        childOption: '', //select child
        date: '', //选择时间
        things: '', //事件
        peopelproject: '' //项目
      } //名字
      $scope.peopelArr = '' //peopel id数组
      $scope.personArr = '' //peopel id数组
      $scope.dimArrFlag = false //模糊ul显示
      $scope.personarrFlag = false //模糊ul显示

      $scope.addflag = {
        peopel: false, //警告提示
        person: false, //指派人
        select: false,
        things: false
      }

      // ======================================================
      // 模糊输入ajax
      function initAdddo(param) {
        $scope.dimArr = []
        var p = new Promise((resolve, reject) => {
          server.server().zjtaskqueryRoomNamedo2(
            {
              userId: userId,
              param: param,
              projectId: $scope.projectuserId
            },
            data => {
              if (data.result) {
                $scope.dimArr = data.data
                resolve(data.data)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }
      //被指派的人
      function UserNamedo(param) {
        $scope.personarr = []
        var p = new Promise((resolve, reject) => {
          server.server().zjtaskqueryUserNamedo(
            {
              projectId: $scope.projectId,
              realname: param
            },
            data => {
              if (data.result) {
                $scope.personarr = data.data
                resolve(data.data)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }

      //获取焦点事件
      $scope.addfocus = function(val, flag) {
        !flag
          ? (initAdddo(val).then(function(data) {
              data.length > 0
                ? ($scope.dimArrFlag = true)
                : ($scope.dimArrFlag = false)
              $scope.addflag.peopel = false
              $scope.$apply()
            }),
            ($scope.addflag.peopel = false))
          : UserNamedo(val).then(function(data) {
              data.length > 0
                ? ($scope.personarrFlag = true)
                : ($scope.personarrFlag = false)
              $scope.addflag.person = false
              $scope.$apply()
            })
      }

      //失去焦点
      $scope.addblur = function(val, flag) {
        if (flag) {
          setTimeout(function() {
            $scope.personarrFlag = false
            !$scope.add.person
              ? ($scope.addflag.person = true)
              : ($scope.addflag.person = false)
            $scope.$apply()
          }, 200)
        } else {
          setTimeout(function() {
            $scope.dimArrFlag = false
            !$scope.add.peopel
              ? ($scope.addflag.peopel = true)
              : ($scope.addflag.peopel = false)
            $scope.$apply()
          }, 200)
        }
      }

      // 模糊输入
      $scope.addchange = function(val, flag) {
        console.log(val)
        flag
          ? (UserNamedo(val).then(function(data) {
              data.length > 0
                ? ($scope.personarrFlag = true)
                : ($scope.personarrFlag = false)
              $scope.$apply()
            }),
            ($scope.addflag.person = false))
          : (initAdddo(val).then(function(data) {
              data.length > 0
                ? ($scope.dimArrFlag = true)
                : ($scope.dimArrFlag = false)
              $scope.$apply()
            }),
            ($scope.addflag.peopel = false))
      }
      //点击选择
      $scope.alertliAdd = function(ind, flag) {
        !flag
          ? (($scope.add.peopel = $scope.dimArr[ind].splitJointName),
            ($scope.peopelArr = $scope.dimArr[ind].id))
          : (($scope.add.person = $scope.personarr[ind].realname),
            ($scope.personArr = $scope.personarr[ind].id))
      }

      // ======================================================================

      //option 父级选择
      $scope.addoptions = function(id) {
        if (id) {
          childajax(id)
        }
      }

      function childajax(id) {
        server.server().zjtaskqueryChildOrderdo(
          {
            parentId: id
          },
          data => {
            if (data.result) {
              $scope.childInitOrder = data.data
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      //子级选择
      $scope.addoptionsChild = function(val) {
        val ? ($scope.addflag.select = false) : ($scope.addflag.select = true)
      }

      //事件blur事件
      $scope.addsBlur = function(val) {
        !val ? ($scope.addflag.things = true) : ($scope.addflag.things = false)
      }

      //star时间筛选
      function runAsyncChange(inputval, boxval, flag, callback) {
        laydate.render({
          elem: '.' + inputval,
          type: 'date',
          // , value: new Date().toLocaleDateString().replace(/\//g,"-") //必须遵循format参数设定的格式
          // , format: 'yyyy-MM-dd' //可任意组合
          // , show: true //直接显示
          closeStop: '.' + boxval, //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          done: value => {
            $scope.beginTime = value
            if (flag) {
              callback(value)
            }
          }
        })
      }

      // 时间选择
      $scope.adddate = function(child, parent) {
        runAsyncChange(child, parent, 2, function(val) {
          $scope.add.date = val
          BuyUseTime($scope.add.person, val)
          $scope.$apply()
        })
      }

      $scope.bodyDataArr = [
        { id: 8, name: '08:00', flagClass: false, msg: '', clickClass: false },
        { id: 9, name: '09:00', flagClass: false, msg: '', clickClass: false },
        { id: 10, name: '10:00', flagClass: false, msg: '', clickClass: false },
        { id: 11, name: '11:00', flagClass: false, msg: '', clickClass: false },
        { id: 12, name: '12:00', flagClass: false, msg: '', clickClass: false },
        { id: 13, name: '13:00', flagClass: false, msg: '', clickClass: false },
        { id: 14, name: '14:00', flagClass: false, msg: '', clickClass: false },
        { id: 15, name: '15:00', flagClass: false, msg: '', clickClass: false },
        { id: 16, name: '16:00', flagClass: false, msg: '', clickClass: false },
        { id: 17, name: '17:00', flagClass: false, msg: '', clickClass: false },
        { id: 18, name: '18:00', flagClass: false, msg: '', clickClass: false },
        { id: 19, name: '19:00', flagClass: false, msg: '', clickClass: false },
        { id: 20, name: '20:00', flagClass: false, msg: '', clickClass: false }
      ]

      //点击时间添加任务
      let choooseArr = []

      //任务发起查询占用时间
      function BuyUseTime(userId, val) {
        $scope.threeshowArr = []
        choooseArr = []
        $scope.bodyDataArr.forEach((item, i) => {
          $scope.bodyDataArr[i].clickClass = false
        })
        server.server().zjtaskqueryUserInfoByUserIddo(
          {
            userId: server.server().userId,
            time: val
          },
          data => {
            if (data.result) {
              $scope.taskquery = data.data
              if ($scope.taskquery) {
                $scope.yearmonthdata = dict.timeConverter3(
                  $scope.taskquery[0].startTime,
                  1
                )

                for (var i = 0; i < $scope.taskquery.length; i++) {
                  $scope.taskquery[i].startTime = dict.timeConverter3(
                    $scope.taskquery[i].startTime
                  )
                  $scope.taskquery[i].endTime = dict.timeConverter3(
                    $scope.taskquery[i].endTime
                  )
                  for (
                    var Q = $scope.taskquery[i].startTime;
                    Q < $scope.taskquery[i].endTime + 1;
                    Q++
                  ) {
                    $scope.threeshowArr.push(Q)
                  }
                }

                for (var j = 0; j < $scope.bodyDataArr.length; j++) {
                  for (var k = 0; k < $scope.threeshowArr.length; k++) {
                    if ($scope.bodyDataArr[j].id === $scope.threeshowArr[k]) {
                      $scope.bodyDataArr[j].flagClass = true
                    }
                  }
                }
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //数组删除指定元素
      Array.prototype.removeByValue = function(val) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == val) {
            this.splice(i, 1)
            break
          }
        }
      }
      //sort排序
      function sortfunc(a, b) {
        return a - b
      }

      $scope.datachoose = function(indx) {
        if ($scope.bodyDataArr[indx].flagClass === false) {
          $scope.bodyDataArr[indx].clickClass = !$scope.bodyDataArr[indx]
            .clickClass //true
          if ($scope.bodyDataArr[indx].clickClass === true) {
            choooseArr.push(indx)
          } else {
            choooseArr.removeByValue(indx)
          }
          if (choooseArr.length >= 2) {
            choooseArr = choooseArr.sort(sortfunc)
            for (
              var i = choooseArr[0];
              i < choooseArr[choooseArr.length - 1] + 1;
              i++
            ) {
              if ($scope.bodyDataArr[i].flagClass === true) {
                $scope.bodyDataArr[indx].clickClass = false
                choooseArr.pop()
                return
              }
              $scope.bodyDataArr[i].clickClass = true
            }
          }
        }
      }

      //发布
      $scope.addsave = function(indx, flag) {
        if (flag == 2) {
          if (!$scope.add.person) {
            $scope.addflag.person = true
            return
          } else {
            $scope.addflag.person = false
          }
          if (!$scope.add.date) {
            alert('请选择指派时间！')
            return
          } else {
            $scope.addflag.date = false
          }

          if (choooseArr.length <= 0) {
            alert('请选择可用时间段！')
            return
          } else {
            $scope.startDate =
              $scope.add.date + ' ' + $scope.bodyDataArr[choooseArr[0]].name
            $scope.endDate =
              $scope.add.date +
              ' ' +
              $scope.bodyDataArr[choooseArr[choooseArr.length - 1]].name
          }

          if (!$scope.add.things) {
            $scope.addflag.things = true
            return
          } else {
            $scope.addflag.things = false
          }

          server.server().zjtaskupdateTaskdo(
            {
              toUser: $scope.add.person, //指派给
              startDate: $scope.startDate, //开始时间
              endDate: $scope.endDate, //结束时间
              eventDesc: $scope.add.things, //事件说明
              userId: $scope.personArr, //指派人id
              id: $scope.rows[indx].id, //创建人id
              roomId: $scope.peopelArr //物业id	是
            },
            data => {
              data.result
                ? ($('.h-liebiaoone').fadeOut(200),
                  ($scope.add.peopel = ''),
                  ($scope.peopelArr = ''),
                  ($scope.add.childOption = ''),
                  ($scope.add.parentOption = ''),
                  ($scope.personArr = ''),
                  ($scope.add.person = ''),
                  ($scope.add.date = ''),
                  ($scope.add.things = ''),
                  ($scope.beginTime = ''),
                  ($scope.endTime = ''),
                  (choooseArr = []),
                  alert('发布成功！', function() {
                    EventListdo(
                      $scope.nodeId,
                      $scope.type,
                      '',
                      '',
                      '',
                      $scope.conf.currentPage,
                      ''
                    )
                  }),
                  $scope.$apply())
                : alert(data.message)
            }
          )
        } else {
          if (!$scope.add.peopel) {
            $scope.addflag.peopel = true
            return
          } else {
            $scope.addflag.peopel = false
          }
          if (!$scope.add.parentOption) {
            $scope.addflag.select = true
            return
          } else {
            $scope.addflag.select = false
          }
          if (!$scope.add.person) {
            $scope.addflag.person = true
            return
          } else {
            $scope.addflag.person = false
          }
          if (!$scope.add.date) {
            alert('请选择指派时间！')
            return
          } else {
            $scope.addflag.date = false
          }

          if (choooseArr.length <= 0) {
            alert('请选择可用时间段！')
            return
          } else {
            $scope.startDate =
              $scope.add.date + ' ' + $scope.bodyDataArr[choooseArr[0]].name
            $scope.endDate =
              $scope.add.date +
              ' ' +
              $scope.bodyDataArr[choooseArr[choooseArr.length - 1]].name
          }

          if (!$scope.add.things) {
            $scope.addflag.things = true
            return
          } else {
            $scope.addflag.things = false
          }

          server.server().zjtaskaddTask(
            {
              roomId: $scope.peopelArr, //物业id	是
              processId: $scope.add.childOption, //签约阶段子id
              toUser: $scope.add.person, //指派给
              startDate: $scope.startDate, //开始时间
              endDate: $scope.endDate, //结束时间
              eventDesc: $scope.add.things, //事件说明
              userId: $scope.personArr, //指派人id
              createUser: userId, //创建人id
              eventNode: $scope.add.parentOption //签约阶段父id
              //	时间说明
            },
            data => {
              data.result
                ? (($scope.add.peopel = ''),
                  ($scope.peopelArr = ''),
                  ($scope.add.childOption = ''),
                  ($scope.add.parentOption = ''),
                  ($scope.personArr = ''),
                  ($scope.add.person = ''),
                  ($scope.add.date = ''),
                  ($scope.add.things = ''),
                  ($scope.beginTime = ''),
                  ($scope.endTime = ''),
                  (choooseArr = []),
                  alert('发布成功！', function() {
                    EventListdo(
                      $scope.nodeId,
                      $scope.type,
                      '',
                      '',
                      '',
                      $scope.conf.currentPage,
                      ''
                    )
                  }),
                  $('.h-liebiaoone').fadeOut(200),
                  $scope.$apply())
                : alert(data.message)
            }
          )
        }
      }

      //重新指派弹窗
      $scope.regist = function(indx) {
        $('.h-liebiaoone').dialog()
        $scope.registIndex = indx
        $scope.registFlag = 2
        $scope.add.peopel =
          $scope.rows[indx].splitJointName + $scope.rows[indx].code
        $scope.peopelArr = $scope.rows[indx].roomId
        childajax($scope.rows[indx].parentId)
        $scope.add.childOption = $scope.rows[indx].childId
        $scope.add.parentOption = $scope.rows[indx].parentId
        $scope.personArr = $scope.rows[indx].userId
        $scope.add.person = $scope.rows[indx].toUser
        $scope.add.date = dict.timeConverter3($scope.rows[indx].startDate, 3) //未处理
        $scope.add.things = $scope.rows[indx].eventDesc
        $scope.add.peopelproject = $scope.rows[indx].projectName
        $scope.add.peopel = $scope.rows[indx].address
        $scope.$scope.bodyDataArr.forEach((item, i) => {
          $scope.bodyDataArr[i].clickClass = false
        })
        $scope.addflag = {
          peopel: false, //警告提示
          person: false, //指派人
          select: false,
          things: false
        }
        // $scope.peopelArr = $scope.rows[indx].roomId; //peopel id数组
        // $scope.personArr = $scope.rows[indx].userId; //peopel id数组
      }

      // 发起任务
      $scope.regCreatetaskist = function() {
        $scope.registFlag = 1
        $scope.add.peopel = ''
        $scope.peopelArr = ''
        $scope.add.childOption = ''
        $scope.add.parentOption = ''
        $scope.personArr = ''
        $scope.add.person = ''
        $scope.add.date = ''
        $scope.add.things = ''
        $scope.add.peopelproject = ''
        choooseArr = []
        $('.addchildData1').val('')
        $('.h-liebiaoone').dialog()
        $scope.addflag = {
          peopel: false, //警告提示
          person: false, //指派人
          select: false,
          things: false
        }
        $scope.bodyDataArr.forEach((item, i) => {
          $scope.bodyDataArr[i].clickClass = false
        })
      }
    }
  ])

  //审批支付佣金列表
  .controller('commissionPaymentCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.no = '/'
      $scope.No = ''
      $scope.projectId = $state.params.projectid
      $scope.roomId = $state.params.roomId //物业id
      $scope.approveId = $state.params.approveId //审批数据id
      $scope.lookflag = $state.params.flag
      $scope.hostname = server.server().host
      $scope.locationFrefFlag = $state.params.number
      var userId = server.server().userId
      $scope.notetext = ''
      $scope.notetextFlag = false
      $scope.passOKflag = true
      $scope.shows = false

      // 禁止 多次点击事件
      $scope.clickdisabled = true
      $scope.clicktimeoutdata = 3000

      $scope.roomMsgName = '项目'
      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      //项目信息header
      function runAsync1() {
        new Promise((resolve, reject) => {
          server.server().zjprojectdeleteById(
            {
              id: $scope.projectId,
              userId: userId
            },
            data => {
              if (data.result === true) {
                $scope.project2 = data.data.project

                $scope.$apply()
                resolve($scope.project2)
              } else {
                alert(data.message)
              }
            }
          )
        })
        return Promise
      }
      function runAsync2() {
        new Promise((resolve, reject) => {
          //支付佣金共用详情
          server.server().zjapprovalformdetaildo(
            {
              approvalId: $scope.approveId, //审批数据的id
              userId: userId //用户id
            },
            data => {
              if (data.result) {
                $scope.roomMsg = data.data.roomMsg //审批信息
                $scope.nodeMsg = data.data.nodeMsg //审批进度
                $scope.approvalNodeName = data.data.approvalNodeName //审批节点
                
                resolve(data.data)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        return Promise
      }
      Promise.all([runAsync1(), runAsync2()]).then(
        results => results,
        err => {}
      )

      let payforList = function(pageNo) {
        //支付列表
        $scope.fincialIdsArr = []
        $scope.fincialIds = ''
        server.server().zjapprovalforminitFincialApprovaldo(
          {
            projectId: $scope.projectId, //项目的id	是
            userId: userId, //当前操作的用户的id	是
            pageNo: pageNo || 1,
            pageSize: $scope.conf.itemPageLimit || 10,
            approvalId: $scope.approveId
          },
          data => {
            if (data.result) {
              if (data.data.payments) {
                $scope.payforListArr = data.data.payments
                $scope.payforListArr.forEach((item, i) => {
                  $scope.fincialIdsArr.push($scope.payforListArr[i].id)
                })
                $scope.fincialIdsArr = $scope.fincialIdsArr.join(',')
                $scope.conf.total = Math.ceil(
                  data.data.total / data.data.pageSize
                )
                $scope.conf.counts = data.data.total
                $scope.$broadcast('categoryLoaded')
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      let moneyList = function(pageNo) {
        //佣金列表
        $scope.fincialIdsArr2 = []
        server.server().zjapprovalformcommmisionApprovalListdo(
          {
            projectId: $scope.projectId,
            approvalId: $scope.approveId, //项目的id	是
            userId: userId, //当前操作的用户的id	是
            pageNo: pageNo || 1,
            pageSize: $scope.conf.itemPageLimit || 10
          },
          data => {
            if (data.result) {
              if (
                data.data.commissionsList &&
                data.data.commissionsList.length > 0
              ) {
                $scope.MoneryListArr = data.data.commissionsList
                $scope.MoneryListArr.forEach((item, i) => {
                  $scope.fincialIdsArr2.push($scope.MoneryListArr[i].id)
                })
                $scope.fincialIdsArr2 = $scope.fincialIdsArr2.join(',')
                $scope.conf.total = Math.ceil(
                  data.data.total / data.data.pageSize
                )
                $scope.conf.counts = data.data.total
                $scope.$broadcast('categoryLoaded')
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //弹窗失去焦点
      $scope.blurs = function(val) {
        !val ? ($scope.notetextFlag = true) : ($scope.notetextFlag = false)
      }
      //分页 //支付和佣金moneyList()
      $scope.$watch('conf.currentPage + conf.itemPageLimit', function(news) {
        $scope.locationFrefFlag == '1'
          ? payforList($scope.conf.currentPage)
          : moneyList($scope.conf.currentPage)
      })

      //是否查看和审批
      if ($scope.lookflag == '0') {
        server.server().zjapprovalformqueryApplyRecorddo(
          {
            approvalId: $scope.approveId
          },
          function(data) {
            if (data.result) {
              if (data.data.length >= 0) {
                $scope.lookapproArr = data.data
                $scope.lookapproArr.forEach((item, i) => {
                  if ($scope.lookapproArr[i].adopt == '1') {
                    $scope.lookapproArr[i].adopt = '审核中'
                  } else if ($scope.lookapproArr[i].adopt == '2') {
                    $scope.lookapproArr[i].adopt = '审核中通过'
                  } else if ($scope.lookapproArr[i].adopt == '0') {
                    $scope.lookapproArr[i].adopt = '未审核'
                  } else {
                    $scope.lookapproArr[i].adopt = '审核不通过'
                  }
                })
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      runAsync1()

      //审核通过
      $scope.passOK = function() {
        !$scope.notetext
          ? ($scope.notetextFlag = true)
          : ($scope.notetextFlag = false)
        if ($scope.clickdisabled) {
          $scope.clickdisabled = false
          server.server().zjapprovalformfincialThroghdo(
            {
              approvalId: $scope.approveId, //审批数据的id	是
              userId: userId, //当前的审批用户的id	是
              remakers: $scope.notetext, //审批的备注信息	是
              type: 2,
              fincialIds:
                $scope.locationFrefFlag == '1'
                  ? $scope.fincialIdsArr
                  : $scope.fincialIdsArr2
            },
            function(data) {
              if (data.result) {
                alert(data.message, () => {
                  $scope.passOKflag = false
                  $state.go('examine', { projectid: $scope.projectId })
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
        dict.timeouts(false, $scope.clicktimeoutdata, function() {
          $scope.clickdisabled = true
          $scope.$apply()
        })
      }

      //审核失败
      $scope.passNO = function() {
        !$scope.notetext
          ? ($scope.notetextFlag = true)
          : ($scope.notetextFlag = false)
        if ($scope.clickdisabled) {
          $scope.clickdisabled = false
          server.server().zjapprovalformfincialNotThroghdo(
            {
              approvalId: $scope.approveId, //审批数据的id	是
              userId: userId, //当前的审批用户的id	是
              remakers: $scope.notetext, //审批的备注信息	是
              fincialIds:
                $scope.locationFrefFlag == '1'
                  ? $scope.fincialIdsArr
                  : $scope.fincialIdsArr2
            },
            function(data) {
              if (data.result) {
                alert(data.message, () => {
                  $scope.passOKflag = false
                  $state.go('examine', { projectid: $scope.projectId })
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
        dict.timeouts(false, $scope.clicktimeoutdata, function() {
          $scope.clickdisabled = true
          $scope.$apply()
        })
      }

      //查看审批进度
      $scope.lookJindu = function(indx) {
        $scope.lookJinduArr = []
        server.server().zjommissionrulesdeleteByIddo(
          {
            id: $scope.approveId, //审批数据的id	是
            nodeId: $scope.nodeMsg[indx].id //当前节点的id	是
          },
          function(data) {
            if (data.result) {
              $scope.lookJinduArr = data.data
              console.log($scope.lookJinduArr)
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //导出审批进度
      $scope.exportWork = function() {
        $('.export').dialog()
        server.server().zjapprovalformexportdo(
          {
            approvalId: $scope.approveId, //审批数据的id	是
            userId: 1 //当前节点的id	是
          },
          function(data) {
            if (data.result) {
              $scope.exportRomMap = data.data.romMap
              $scope.content = data.data.content
              $scope.exportHasApply = data.data.hasApply
              $scope.exportHasNotApply = data.data.hasNotApply
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
    }
  ])

  //审批测绘列表
  .controller('surveyingMappingCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    '$rootScope',
    function($http, $scope, server, dict, $state, $q, $rootScope) {
      $scope.nos = '/'
      $scope.No = '/'

      $scope.projectId = $state.params.projectid
      $scope.roomId = $state.params.roomId //物业id
      $scope.approveId = $state.params.approveId //审批数据id
      $scope.locationFrefFlag = $state.params.number //100-1300状态
      $scope.templatePactId = $state.params.pactId //合同id;
      $scope.lookflag = $state.params.flag //是审批还是查看
      // updateStatus  增删改（1新增 2修改 3删除）
      $scope.updateStatus = $state.params.updateStatus
      $scope.pstatus = $state.params.status
      $scope.headImg = server.server().headImg

      // $scope.propertyId = $scope.paramspropertyId
      $scope.pactId = $scope.templatePactId
      $scope.pnumber = $scope.locationFrefFlag
      $scope.pflag = $scope.lookflag
      $scope.pupdateStatus = $scope.updateStatus

      $scope.hostname = server.server().host
      var userId = server.server().userId //用户id
      $scope.hostname = server.server().imgHost
      $scope.notetext = ''
      $scope.notetextFlag = false
      $scope.passOKflag = true
      $scope.shows = false
      // 禁止多次点击
      $scope.clickdisabled = true
      $scope.clicktimeoutdata = 3000
      //分页
      $scope.conf = {
        total: 3, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      //路由跳转
      $scope.locationHerf = function(val) {
        $state.go('examine', {
          projectid: $scope.projectId,
          roomId: $scope.roomId,
          approveId: $scope.approveId,
          number: val
        })
      }

      //项目信息header
      function runAsync1() {
        var p = new Promise((resolve, reject) => {
          server.server().zjprojectdeleteById(
            {
              id: $scope.projectId,
              userId: userId
            },
            data => {
              if (data.result === true) {
                $scope.project2 = data.data.project

                $scope.$apply()
                resolve($scope.project2)
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }
      //物业信息附件
      // function runAsync2() {
      //     var p = new Promise(function(resolve, reject) {
      //         server.server().basicInformation({
      //             roomId: $scope.roomId
      //         }, function (data) {
      //             if (data.result) {
      //                 $scope.informations = data.data.surveyCount;
      //                 $scope.attachment = data.data.attachment;
      //                 $scope.$apply();
      //                 resolve(2);
      //             } else {
      //                 reject(data.message);
      //             }
      //         });
      //     })
      //     return p;
      // }

      //是否查看和审批
      if ($scope.lookflag == '0') {
        server.server().zjapprovalformqueryApplyRecorddo(
          {
            approvalId: $scope.approveId
          },
          function(data) {
            if (data.result) {
              if (data.data.length >= 0) {
                $scope.lookapproArr = data.data
                $scope.lookapproArr.forEach((item, i) => {
                  if ($scope.lookapproArr[i].adopt == '1') {
                    $scope.lookapproArr[i].adopt = '审核通过 '
                  } else if ($scope.lookapproArr[i].adopt == '2') {
                    $scope.lookapproArr[i].adopt = '审核未通过'
                  } else if ($scope.lookapproArr[i].adopt == '0') {
                    $scope.lookapproArr[i].adopt = '未审核'
                  }
                })
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      runAsync1()

      $scope.bianji = function() {
        // $('.updatetemplateShow').dialog()
      }

      //3、查看审批详情（点击进入审批）(测绘信息
      function runAsync3() {
        server.server().zjapprovalformdetaildo(
          {
            approvalId: $scope.approveId, //审批数据的id
            userId: userId //用户id
          },
          function(data) {
            if (data.result) {
              if(data.data.approvalMsg){
                server.server().zjpactprotocoltemplatequeryAgreementdo(
                  {
                    pactTemplateId: data.data.approvalMsg.pactTempletId
                  },
                  function(data) {
                    if (data.result) {
                      $scope.templateListChild2 = data.data
                      $scope.$apply()
                    }
                  }
                )
              }
              $scope.approvalFormIdyongde = data.data.approvalFormId
              $scope.pactModeId = data.data.approvalMsg.id
              $scope.pactIdupdates = data.data.approvalMsg.pactId
              $scope.pactTempletIds = data.data.approvalMsg.pactTempletId
              $scope.roomMsg = data.data.roomMsg //审批信息
              $scope.nodeMsg = data.data.nodeMsg //审批进度
              $scope.examineStatus = data.data.examineStatus
              $scope.approvalNodeName = data.data.approvalNodeName //审批节点
              if (data.data.approvalMsg) {
                //拆迁补偿
                if (
                  $scope.locationFrefFlag == '0' ||
                  $scope.locationFrefFlag == '100' ||
                  $scope.locationFrefFlag == '200' ||
                  $scope.locationFrefFlag == '300' ||
                  $scope.locationFrefFlag == '400' ||
                  $scope.locationFrefFlag == '500' ||
                  $scope.locationFrefFlag == '1600' ||
                  $scope.locationFrefFlag == '700'
                ) {
                  $scope.roomMsgName = '项目'
                } else {
                  $scope.roomMsgName = '物业'
                }
                //// 拆迁补偿规则
                if (
                  $scope.locationFrefFlag == '0' ||
                  $scope.locationFrefFlag == '200'
                ) {
                  $scope.rules = data.data.approvalMsg
                }
                //签约佣金规则
                if ($scope.locationFrefFlag == '300') {
                  $scope.rulesdata = []
                  $scope.rulesdata[0] = data.data.approvalMsg
                }
                //综合业务佣金规则
                if ($scope.locationFrefFlag == '400') {
                  if ($scope.updateStatus == 2) {
                    $scope.yewu = data.data.approvalMsg.serviceMap
                  } else {
                    $scope.yewu = data.data.approvalMsg
                  }
                }
                //违建佣金规则
                if ($scope.locationFrefFlag == '500') {
                  if ($scope.updateStatus == 2) {
                    $scope.weijian = data.data.approvalMsg.updateFrontMap
                  } else {
                    $scope.weijian = data.data.approvalMsg
                  }
                }
                //测绘信息
                if ($scope.locationFrefFlag == '600') {
                  if ($scope.updateStatus == 2) {
                    $scope.updataBehindMap =
                      data.data.approvalMsg.updataBehindMap
                    if (
                      $scope.updataBehindMap.singleList ||
                      $scope.updataBehindMap.surveyList
                    ) {
                      $scope.fileUrl = $scope.updataBehindMap.fileUrl //fileName;
                      $scope.singleList = $scope.updataBehindMap.singleList //上面的arr
                      $scope.surveyList = $scope.updataBehindMap.surveyList //下面的arr
                    }
                  } else {
                    $scope.surveyInfo = data.data.approvalMsg
                    $scope.singleList = $scope.surveyInfo.singleList
                    $scope.surveyList = $scope.surveyInfo.surveyList
                    $scope.housesImg = $scope.surveyInfo.housesImg
                  }
                }
                //财务结算设置
                if ($scope.locationFrefFlag == '700') {
                  // 修改
                  $scope.content = data.data.approvalMsg.content //关联补偿内容
                  $scope.detail = data.data.approvalMsg.detail //规则
                  $scope.settlement = data.data.approvalMsg.settlement //
                  // if($scope.settlement.type == '1'){$scope.settlement.typement='物业补偿类';}
                  // if($scope.settlement.type == '2'){$scope.settlement.typement='安置补助类';}
                  // if($scope.settlement.type == '3'){$scope.settlement.typement='延期支付类';}
                }
                //补偿方案
                if ($scope.locationFrefFlag == '800') {
                  $scope.topData = []
                  $scope.bottomData = []
                  if ($scope.updateStatus == 3) {
                    $scope.compensatePlanArr =
                      data.data.approvalMsg.compensationInfoList

                    for (var i = 0; i < $scope.compensatePlanArr.length; i++) {
                      $scope.compensatePlanArr[i].Identification === 0
                        ? $scope.topData.push($scope.compensatePlanArr[i])
                        : $scope.bottomData.push($scope.compensatePlanArr[i])
                    }

                    for (let m = 0; m < $scope.topData.length; m++) {
                      $scope.topData[m].area =
                        Number($scope.topData[m].area).toFixed(2) || 0
                      $scope.topData[m].replacementRatio =
                        Number($scope.topData[m].replacementRatio) || 0
                      $scope.topData[m].builtInArea =
                        Number($scope.topData[m].builtInArea).toFixed(2) || 0
                    }

                    for (let k = 0; k < $scope.bottomData.length; k++) {
                      $scope.bottomData[k].area =
                        Number($scope.bottomData[k].area).toFixed(2) || 0
                      $scope.bottomData[k].compensatePrice =
                        Number($scope.bottomData[k].compensatePrice).toFixed(
                          2
                        ) || 0
                      $scope.bottomData[k].compensationAmount =
                        Number($scope.bottomData[k].compensationAmount).toFixed(
                          2
                        ) || 0
                      if ($scope.bottomData[k].priceMode == '0') {
                        $scope.bottomData[k].compensationAmount =
                          $scope.bottomData[k].compensatePrice
                      } else {
                        // status 1装修补偿 2过度费补偿 3房屋补偿 4原产证办证费补偿 5搬迁补偿
                        // isRestricted 是否限定 1 是 0否  （是否限定只有在装修补偿的时候有用到，如果有用到则按照限定的面积计算，如果补偿是总价则还是总价）
                        // restrictedArea 限定面积
                        if (
                          $scope.bottomData[k].status === 1 &&
                          $scope.bottomData[k].isRestricted === 1
                        ) {
                          if ($scope.bottomData[k].restrictedArea) {
                            $scope.bottomData[k].area = Number(
                              $scope.bottomData[k].restrictedArea
                            ).toFixed()
                          }
                        }
                      }
                    }

                    //总计
                    $scope.totalMoneyCompensate = $scope.bottomData[0]
                      .totalMoneyCompensate
                      ? Number(
                          $scope.bottomData[0].totalMoneyCompensate
                        ).toFixed(2)
                      : 0
                    // 每月补偿标识数组
                    $scope.monthlyInterimCompensate = $scope.bottomData[0]
                      .monthlyInterimCompensate
                      ? Number(
                          $scope.bottomData[0].monthlyInterimCompensate
                        ).toFixed(2)
                      : 0
                  } else {
                    $scope.compensatePlanArr = data.data.approvalMsg.list
                    $scope.mapCompensate = data.data.approvalMsg.mapCompensate
                    $scope.topData = []
                    $scope.bottomData = []
                    if (
                      $scope.compensatePlanArr &&
                      $scope.compensatePlanArr.length > 0
                    ) {
                      for (
                        let i = 0;
                        i < $scope.compensatePlanArr.length;
                        i++
                      ) {
                        $scope.compensatePlanArr[i].identification == '0'
                          ? $scope.topData.push($scope.compensatePlanArr[i])
                          : $scope.bottomData.push($scope.compensatePlanArr[i])
                      }
                      $scope.topData.forEach((item, j) => {
                        if ($scope.topData[j].area.status == 1) {
                          $scope.topData[j].area = $scope.topData[j].area.value
                          $scope.topData[j].areaflag = true
                        }
                        if ($scope.topData[j].replacementRatio.status == 1) {
                          $scope.topData[j].replacementRatio =
                            $scope.topData[j].replacementRatio.value
                          $scope.topData[j].replacementRatioflag = true
                        }
                        if ($scope.topData[j].builtInArea.status == 1) {
                          $scope.topData[j].builtInArea =
                            $scope.topData[j].builtInArea.value
                          $scope.topData[j].builtInAreaflag = true
                        }
                        if ($scope.topData[j].builtInPeriod.status == 1) {
                          $scope.topData[j].builtInPeriod =
                            $scope.topData[j].builtInPeriod.value
                          $scope.topData[j].builtInPeriodflag = true
                        }
                      })

                      $scope.bottomData.forEach((item, Q) => {
                        if ($scope.bottomData[Q].area.status == 1) {
                          $scope.bottomData[Q].area =
                            $scope.bottomData[Q].area.value
                          $scope.bottomData[Q].areaflag = true
                        }
                        if ($scope.bottomData[Q].compensatePrice.status == 1) {
                          $scope.bottomData[Q].compensatePrice =
                            $scope.bottomData[Q].compensatePrice.value
                          $scope.bottomData[Q].compensatePriceflag = true
                        }
                        if (
                          $scope.bottomData[Q].compensationAmount.status == 1
                        ) {
                          $scope.bottomData[Q].compensationAmount =
                            $scope.bottomData[Q].compensationAmount.value
                          $scope.bottomData[Q].compensationAmountflag = true
                        }
                        if ($scope.bottomData[Q].priceMode == '0') {
                          $scope.bottomData[Q].compensationAmount =
                            $scope.bottomData[Q].compensatePrice
                        }
                      })
                      // 货币补偿合计
                      $scope.totalMoneyCompensateflag =
                        $scope.mapCompensate.totalMoneyCompensate.status == 1
                          ? true
                          : false
                      $scope.totalMoneyCompensate =
                        $scope.mapCompensate.totalMoneyCompensate.status == 1
                          ? $scope.mapCompensate.totalMoneyCompensate.value
                          : $scope.mapCompensate.totalMoneyCompensate
                      // 每月过渡补偿合计
                      $scope.monthlyInterimCompensateflag =
                        $scope.mapCompensate.monthlyInterimCompensate.status ==
                        1
                          ? true
                          : false
                      $scope.monthlyInterimCompensate =
                        $scope.mapCompensate.monthlyInterimCompensate.status ==
                        1
                          ? $scope.mapCompensate.monthlyInterimCompensate.value
                          : $scope.mapCompensate.monthlyInterimCompensate
                    }
                  }
                }
                //收款人信息变更
                if (
                  $scope.locationFrefFlag == '900' ||
                  $scope.locationFrefFlag == '1000'
                ) {
                  $scope.payee = data.data.approvalMsg
                  switch ($scope.payee.recieveType) {
                    case 1:
                      $scope.payee.recieveType = '业权人收款'
                      break
                    case 2:
                      $scope.payee.recieveType = '其他人代收款'
                      break
                    case 3:
                      $scope.payee.recieveType = '未满18岁监护人待收款'
                      break
                    case 4:
                      $scope.payee.recieveType = '关联其他业权人收款'
                      break
                  }
                }
                //合同审批
                if ($scope.locationFrefFlag == '1100') {
                  $scope.contractApprove = data.data.approvalMsg
                  $scope.pactflag = true //页面跳转标志位
                }
                //合同模版审批
                if ($scope.locationFrefFlag == '1200') {
                  $scope.ContractTemplates = data.data.approvalMsg
                  $scope.pactAgreement = data.data.approvalMsg.pactAgreement

                  $('.basic-look-text').html($scope.ContractTemplates.content)
                  $scope.pactflag = true //页面跳转标志位
                }
                //佣金信息审批(查违)
                if ($scope.locationFrefFlag == '1400') {
                  $scope.transgressMap = data.data.approvalMsg.transgressMap
                  $scope.attachmentList = data.data.approvalMsg.attachmentList
                }
                //佣金信息审批(查违)
                if (
                  $scope.locationFrefFlag == '1600' ||
                  $scope.locationFrefFlag == '0'
                ) {
                  $scope.rules = data.data.approvalMsg
                }
                //物业信息
                if ($scope.locationFrefFlag == '1700') {
                  $scope.propertyInfordata = data.data.approvalMsg
                }
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      runAsync3()

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
            'charts' // 图表
          ]
        ],

        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        initialFrameWidth: '100%',
        initialFrameHeight: 200
      }
      function comAjax() {
        server.server().zjpacttempletelistTmpletedo(
          {
            pactId: $scope.templatePactId
          },
          function(data) {
            if (data.result) {
              $scope.templateList = data.data
              $scope.templateList.forEach(function(item, i) {
                if (
                  $scope.templateList[i].status == '1' ||
                  $scope.templateList[i].status == '3'
                ) {
                  $scope.templateList[i].templateName =
                    $scope.templateList[i].templateName + '合同审批'
                  $scope.templateList[i].disabled = false
                  $scope.templateListTitle = false
                } else {
                  $scope.templateList[i].templateName =
                    $scope.templateList[i].templateName + '合同审批'
                  $scope.templateList[i].disabled = true
                  $scope.templateListTitle = true
                }
              })

              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      // 合同的如果为1调这个
      if ($scope.pstatus == '1' && $scope.locationFrefFlag == '1100') {
        comAjax()
      }

      





      // 查看补充协议
      $scope.pactAgreementlist = function( id,flag) {
        var p = new Promise((resolve, reject) => {
          server.server().zjpactattachmentfindByIddo(
            {id: id},
            function(data) {
              if (data.result) {
                $scope.updatetemplateListlist = data.data.content
                if(!flag){
                  $('.basic-update-text-list').html($scope.updatetemplateListlist)
                $('.templateShowlist').dialog()
                }
                resolve($scope.updatetemplateListlist)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }

      // 1200修改
      $scope.pactAgreementlistupdate = function(id,pactAgreementlistupdateid) {
        $scope.woshier = 2
        $scope.xialakuangdeid = id;
        $scope.pactAgreementlistupdateid = pactAgreementlistupdateid
        $scope.panduandeshwnmegui = true;
        return new Promise((resolve, reject) => {
         
          server.server().zjpactinfoapplyPactMode(
            {
              tmpleteId: pactAgreementlistupdateid, //模板id；
              userId: userId,
              pactId: $scope.pactIdupdates,
              status: 2 // 1  主合同   2 附属合同附属合同
            },
            function(data) {
              if (data.result) {
                $scope.updatetemplateListchild = data.data
                $('.basic-update-text3').html($scope.updatetemplateListchild)
                $('.templateShow3').dialog()
                resolve($scope.updatetemplateListchild)
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
          // console.log(id)
          // server.server().zjpactattachmentfindByIddo(
          //   {id: id},
          //   function(data) {
          //     if (data.result) {
          //       $scope.updatetemplateListchild = data.data.content
          //       $('.basic-update-text3').html($scope.updatetemplateListchild)
          //       $('.templateShow3').dialog()
          //       resolve($scope.updatetemplateListchild)
          //       $scope.$apply()
          //     } else {
          //       alert(data.message)
          //     }
          //   }
          // )
        })
        // $scope.pactAgreementlist(id,true).then((data)=>{
        //   server.server().zjpactattachmentupdateSavedo(
        //     {
        //       id: id,
        //       updateUser:userId,
        //       content:data
        //     },
        //     function(data) {
        //       if (data.result) {
        //         alert(data.message,function(){
        //         })
                
        //         $scope.$apply()
        //       } else {
        //         alert(data.message)
        //       }
        //     }
        //   )
        // })
        
      }

      //1200 删除

      $scope.pactAgreementlistdetele = function(id) {
        server.server().zjpactattachmentdeleteByIddo(
          {
            id: id
          },
          function(data) {
            if (data.result) {
              alert(data.message,function(){
                window.location.reload()
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      // 1200 change select
      $scope.pactchild2 = function(id){
        $scope.woshier = 0
        $scope.xialakuangdeid = id;
        $scope.panduandeshwnmegui = false;
        server.server().zjpactinfoapplyPactMode(
          {
            tmpleteId: id, //模板id；
            userId: userId,
            pactId: $scope.pactIdupdates,
            status: 2 // 1  主合同   2 附属合同附属合同
          },
          function(data) {
            if (data.result) {
              $scope.updatetemplateListchild = data.data
              $('.basic-update-text3').html($scope.updatetemplateListchild)
              $('.templateShow3').dialog()
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      //1200列表
      $scope.alerttemplate2 = function(id) {
        $scope.pact = []
        $scope.pactname = []
        $scope.pactkeyname = []
        $('.templateShow3').fadeOut(200)
        $('.updatetemplateShow4').dialog()
        server.server().zjpactmodeeditpactListdo(
          {
            pactTemplateId: ($scope.woshier==2&&$scope.pactAgreementlistupdateid)||($scope.woshier==1&&$scope.pactTempletIds)||id
          },
          function(data) {
            if (data.result) {
              $scope.mydata = data.data

              $scope.mydata.forEach(function(item, i) {
                $scope.pact[i] = {
                  keyname: $scope.mydata[i].keyName,
                  name: $scope.mydata[i].name,
                  val: '',
                  time: $scope.mydata[i].time,
                  id: $scope.mydata[i].id
                }
              })

              //时间排序
              $scope.pact.sort(function(p1, p2) {
                return p1.time - p2.time
              })
              // zjpactfieldscontentlistdo
              if($scope.woshier == 2 || $scope.woshier == 1){
                server.server().zjpactfieldscontentlistdo(
                  {
                    dataId:$scope.woshier==1?$scope.pactModeId:id
                    // pactModeId
                  },
                  function(data) {
                    if (data.result) {
                     $scope.xiugaiderdata = data.data
                     $scope.xiugaiderdata.forEach(function(item, i) {
                      $scope.pact.forEach(function(list, j) {
                        if(item.keyName === list.keyname){
                          list.val = item.keyValue
                          list.id = item.id
                        }
                      })
                    })
  
                      $scope.$apply()
                    } else {
                      alert(data.message)
                    }
                  }
                )
              }
              
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      $scope.updateclose4 = function() {
        $('.templateShow3').dialog()
      }

      // 1200 列表 保存
      $scope.updateemplateaddsave4 = function(id) {
        $scope.usepact = {}
          $scope.pact.forEach(function(item, i) {
            $scope.usepact[item.keyname] = item.val
          })

          server.server().zjpactmodepreviewPathdo(
            {
              dataTwo: id, //模板id；
              createUser: userId,
              pactId: $scope.pactIdupdates,
              dataOne: $scope.updatetemplateListchild.toString(),
              editJson: JSON.stringify($scope.usepact)
            },
            function(data) {
              if (data.result) {
                  $scope.updatetemplateListchild2 = data.data.dataOne
                  // $scope.dataoneoneoneone = $scope.updatetemplateList2
                // $scope.pactIdschild = data.data.pactId
                $('.updatetemplateShowupdate5').dialog()
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
      }

      // 1200修改保存
      $scope.updateemplateaddsaveupdate5 = function(id){
        if($scope.woshier==1){
          $scope.usepactsave = []
          $scope.pact.forEach(function(item, i) {
            $scope.usepactsave[i]={
              id:item.id,
              keyValue:item.val
            }
          })
          server.server().zjpactmodeupdateSavedo(
          {
            dataOne:$scope.updatetemplateListchild2.toString(),
            id:$scope.pactModeId,
            editJson:JSON.stringify($scope.usepactsave)
          },
          function(data) {
            if (data.result) {
              alert(data.message, function() {
                window.location.reload()
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
        return
        }
        
        if($scope.panduandeshwnmegui){
          $scope.usepactsave = []
          $scope.pact.forEach(function(item, i) {
            $scope.usepactsave[i]={
              id:item.id,
              keyValue:item.val
            }
          })
          $scope.pactAgreementlist(id,true).then((data)=>{
          server.server().zjpactattachmentupdateSavedo(
            {
              id: id,
              updateUser:userId,
              content:$scope.updatetemplateListchild2.toString(),
              editJson:JSON.stringify($scope.usepactsave)
            },
            function(data) {
              if (data.result) {
                alert(data.message,function(){
                  window.location.reload()
                })
                
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        })
        }else{
          // 补充协议添加
          server.server().zjpactattachmentaddSavedo(
            {
              roomId: $scope.roomId, //模板id；
              createUser: userId,
              pactProtocolTemplateId:id,
              pactModeId: $scope.pactModeId,
              content: $scope.updatetemplateListchild2.toString(),
              type:1
            },
            function(data) {
              if (data.result) {
                  $('.updatetemplateShow4').fadeOut(200)
                  $('.updatetemplateShowupdate5').fadeOut(200)
                  $scope.templateListTitle = false
                  alert(data.message,function(){
                    window.location.reload()
                  })
                  $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
        

      }
      //1200 特极保存
      $scope.updateemplateaddsave5 = function(){
          if ($scope.clickdisabled) {
            $scope.clickdisabled = false
            server.server().zjapprovalformagainSubmitApprovedo(
              {
                id:$scope.approvalFormIdyongde,
                updateUser:userId,
                remarks: $scope.remarks
              },
              function(data) {
                if (data.result) {
                  alert(data.message, function() {
                    $scope.templateListTitle = false
                    $state.go('examine', { projectid: $scope.projectId })
                  })
                  $scope.$apply()
                } else {
                  alert(data.message)
                }
                $('.updatetemplateShow4').fadeOut(200)
                $('.updatetemplateShowupdate5').fadeOut(200)
              }
            )
          }
          dict.timeouts(false, $scope.clicktimeoutdata, function() {
            $scope.clickdisabled = true
            $scope.$apply()
          })
      }

      //1200 合同修改
      $scope.pactAgreementlistpact = function(id){
        $scope.woshier = 1
        server.server().zjpactinfoapplyPactMode(
          {
            tmpleteId: $scope.pactTempletIds, //模板id；
            userId: userId,
            pactId: $scope.pactIdupdates,
            status: 1 // 1  主合同   2 附属合同附属合同
          },
          function(data) {
            if (data.result) {
              $scope.updatetemplateListchild = data.data
              $('.basic-update-text3').html($scope.updatetemplateListchild)
              $('.templateShow3').dialog()
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
        
      }









      //编缉合同弹窗
      $scope.templateSubmit = function(id,flag) {
        $scope.submitflag = 1
        flag?$scope.threehildshow2 = 2:$scope.threehildshow2 = 0
        
        if (id) {
          for (var indxs = 0; indxs < $scope.templateList.length; indxs++) {
            $scope.templateList[indxs].id = id
            var indx = indxs
          }
        } else {
          return
        }
        $scope.dataTwos = id
        $scope.templateListId = $scope.templateList[indx].id
        $scope.templateListIndx = indx
        server.server().zjpactinfoapplyPactMode(
          {
            tmpleteId: $scope.templateList[indx].id, //模板id；
            userId: userId,
            pactId: $scope.templatePactId,
            status: 1
          },
          function(data) {
            if (data.result) {
              $scope.updatetemplateList = data.data
              $('.basic-update-text').html($scope.updatetemplateList)
              $('.templateShow').dialog()
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
        // 子列表合同补充协议
        server.server().zjpactprotocoltemplatequeryAgreementdo(
          {
            pactTemplateId: id
          },
          function(data) {
            if (data.result) {
              $scope.templateListChild = data.data
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      $scope.chooselist = []

      // 子的
      $scope.pactchild = function(id,flag) {
        $scope.submitflag = 3
        $scope.pactchildid = id
        $scope.threehildshow2 = 0
        flag?$scope.threehildshow2 = 4:$scope.threehildshow2 = 0

        if (id) {
          for (
            var indxs = 0;
            indxs < $scope.templateListChild.length;
            indxs++
          ) {
            if ($scope.templateListChild[indxs].id === id) {
              var indx = indxs
              $scope.templateListChildName =
                $scope.templateListChild[indxs].name
              $scope.templateListChildId = $scope.templateListChild[indxs].id
            }

            console.log($scope.templateListChildName)
          }
        } else {
          return
        }

        $scope.templateListId = $scope.templateListChild[indx].id
        $scope.templateListIndx = indx
        server.server().zjpactinfoapplyPactMode(
          {
            tmpleteId: id, //模板id；
            userId: userId,
            pactId: $scope.templatePactId,
            status: 2 // 1  主合同   2 附属合同附属合同
          },
          function(data) {
            if (data.result) {
              $scope.updatetemplateList = data.data
              console.log($scope.updatetemplateList)

              $('.basic-update-text').html($scope.updatetemplateList)
              $('.templateShow').dialog()
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      $scope.childdelete = function(indx) {
        $scope.chooselist.splice(indx, 1)
      }

      $scope.pacts = [
        {
          keyname: 'Number_of_Surveying_and_mapping_reports',
          time: '1',
          name: '测绘报告编号'
        },
        { keyname: 'Document_number', time: '2', name: '文件编号' },
        { keyname: 'Parcel_number', time: '3', name: '宗地编号' },
        { keyname: 'room_name', time: '4', name: '房间名称' },
        { keyname: 'room_code', time: '5', name: '房间编号' },
        { keyname: 'Land_use_certificate', time: '65', name: '土地使用证编号' },
        { keyname: 'Planning_permit', time: '334', name: '规划许可证编号' },
        { keyname: 'zong_map_code', time: '6', name: '宗地图，编号' },
        {
          keyname: 'Project_planning_license',
          time: '7',
          name: '工程规划许可证编号'
        },
        {
          keyname: 'Number_of_construction_license',
          time: '8',
          name: '施工许可证编号'
        },
        {
          keyname: 'Acceptance_certificate',
          time: '232',
          name: '竣工验收合格证编号'
        },
        { keyname: 'House_transfer', time: '9', name: '房屋转让买卖合同编号' },
        {
          keyname: 'All_warrants_of_the_house',
          time: '76',
          name: '房屋所有权证，编号'
        },
        {
          keyname: 'Warrant_for_the_use_of',
          time: '45',
          name: '集体土地使用权证编号'
        },
        {
          keyname: 'Non_agricultural_construction_land',
          time: '34',
          name: '非农建设用地编号'
        }
      ]
      //编辑隐藏合同弹窗显示修改弹窗

      $scope.alerttemplate = function(id) {
        $scope.pactname = []
        $scope.pactkeyname = []
        $('.templateShow').fadeOut(200)
        $('.updatetemplateShow').dialog()
        
        if($scope.threehildshow2 == 2 || $scope.threehildshow2 == 4 ){
          // console.log($scope.pact,'update')
          // if($scope.submitflag ==1){
          //   $scope.pactparent = $scope.pact
          // }
          return
        }else{
          $scope.pact = []
          // $scope.pactparent = []
        }

        server.server().zjpactmodeeditpactListdo(
          {
            pactTemplateId: id
          },
          function(data) {
            if (data.result) {
              $scope.mydata = data.data
              $scope.mydata.forEach(function(item, i) {
                // 协义的
                $scope.pact[i] = {
                  keyname: $scope.mydata[i].keyName,
                  name: $scope.mydata[i].name,
                  val: '',
                  time: $scope.mydata[i].time
                }
                
              })
              //时间排序
              $scope.pact.sort(function(p1, p2) {
                return p1.time - p2.time
              })
              if($scope.submitflag ==1){
                $scope.threehildshow2 = 2
                // $scope.pactparent = $scope.pact
              }else{
                $scope.threehildshow2 = 4
              }
             

              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )

      }
      $scope.updateclose = function() {
        $('.templateShow').dialog()
      }
      $scope.cansechild = function() {
        $scope.chooselist = []
      }
      // 修改合同保存的
      $scope.hotongupdate = function() {
        $scope.threehildshow2 = 2
        // $('.basic-update-text').html($scope.updatetemplateList2)
        // $('.templateShow').dialog()
        $scope.templateSubmit($scope.dataTwos,true)
      }
      // 修改协议保存的
      $scope.hotongupdate3 = function() {
        $scope.threehildshow2 = 4
        // $('.basic-update-text').html($scope.updatetemplateList2)
        // $('.templateShow').dialog()
        $scope.pactchild($scope.pactchildid ,true)
      }
      //保存合同富文本
      $scope.updateemplateaddsave = function(tempateId, indx, flag) {
        console.log(flag, 'flag')
        document.getElementsByTagName('body')[0].style.overflow = 'scroll'
        $scope.usepacts = []
        if (flag == 2) {
          $scope.usepact = {}
          // 存储用
          // $scope.tpactListdo = {}
          if($scope.submitflag ==1){
            $scope.pactparent = $scope.pact
            console.log($scope.pactparent,'$scope.submitflag')
          }
          
          $scope.pact.forEach(function(item, i) {
            $scope.usepact[item.keyname] = item.val
          })


          server.server().zjpactmodepreviewPathdo(
            {
              dataTwo: tempateId, //模板id；
              createUser: userId,
              pactId: $scope.templatePactId,
              dataOne: $scope.updatetemplateList.toString(),
              editJson: JSON.stringify($scope.usepact)
            },
            function(data) {
              if (data.result) {
                // if ($scope.threehildshow2 == 2 || $scope.threehildshow2 == 4) {
                //   $scope.dataoneoneoneone = $scope.dataoneoneoneone
                // } else if ($scope.submitflag == 1 || $scope.submitflag == 3) {
                //   $scope.updatetemplateList2 = data.data.dataOne

                //   $scope.dataoneoneoneone = $scope.updatetemplateList2
                // }
                  $scope.updatetemplateList2 = data.data.dataOne

                  $scope.dataoneoneoneone = $scope.updatetemplateList2
                  if($scope.submitflag ==1){
                    $scope.wocaonimashabiletingkehu = $scope.updatetemplateList2
                  }
                $scope.pactIds = data.data.pactId
                $('.templateShow2').dialog()
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        } else if (flag == 1 && $scope.templateListChild.length > 0) {
          $('.templateShow2').fadeOut(200)
          $('.updatetemplateShow').fadeOut(200)
          $scope.dataoneoneoneone = $scope.updatetemplateList2
          $scope.twochildshow = 1
          $scope.threehildshow = 1
          // alert('请选择合同补充协议')
        } else if (flag == 1) {
          $('.templateShow2').fadeOut(200)
          $('.updatetemplateShow').fadeOut(200)
          $scope.dataoneoneoneone = $scope.updatetemplateList2
          $scope.twochildshow = 1
          $scope.threehildshow = 1 //显示
          // alert('请选择合同补充协议')

          // 3协议修保存
        } else if (flag == 3) {
          console.log($scope.usepact)
          $scope.threehildshow99 = 1
          $('.templateShow2').fadeOut(200)
          $('.updatetemplateShow').fadeOut(200)
          if ($scope.chooselist.length > 0) {
            for (var i = 0; i < $scope.chooselist.length; i++) {
              if ($scope.chooselist[i].id == $scope.templateListChildId) {
                $scope.$scope.chooselist[i].content = $scope.updatetemplateList2
                return
              }
            }
            $scope.chooselist.push({
              name: $scope.templateListChildName,
              content: $scope.updatetemplateList2,
              id: $scope.templateListChildId,
              editJson:$scope.usepact
            })
          } else {
            $scope.chooselist.push({
              name: $scope.templateListChildName,
              content: $scope.updatetemplateList2,
              id: $scope.templateListChildId,
              editJson:$scope.usepact
            })
          }
        } else if (flag == 5) {
          $scope.attachmentContent = []
          if ($scope.chooselist.length > 0) {
            for (var i = 0; i < $scope.chooselist.length; i++) {
              $scope.attachmentContent[i] = {
                name: $scope.chooselist[i].name,
                content: $scope.chooselist[i].content,
                id: $scope.chooselist[i].id,
                editJson:$scope.chooselist[i].editJson,
              }
            }
          }
          $scope.pactparenteditJson = {}
          // 合同parent
          if($scope.pactparent && $scope.pactparent.length>0){
            $scope.pactparent.forEach(function(item, i) {
              $scope.pactparenteditJson[item.keyname] = item.val
            })
          }
          
          // console.log($scope.attachmentContent)
          // debugger
          if ($scope.clickdisabled) {
            $scope.clickdisabled = false
            server.server().zjpactmodeaddSavedo(
              {
                dataTwo: $scope.dataTwos, //模板id；
                createUser: userId,
                pactId: $scope.pactIds || '',
                dataOne: $scope.wocaonimashabiletingkehu
                  ? $scope.wocaonimashabiletingkehu.toString()
                  : '',
                attachmentContent: JSON.stringify($scope.attachmentContent),
                remark: $scope.remark,
                editJson:JSON.stringify($scope.pactparenteditJson)
              },
              function(data) {
                if (data.result) {
                  alert('保存成功！', function() {
                    $scope.templateListTitle = false
                    comAjax()

                    $scope.$apply()
                    $state.go('examine', { projectid: $scope.projectId })
                  })
                } else {
                  alert(data.message)
                }
                $('.templateShow2').fadeOut(200)
                $('.updatetemplateShow').fadeOut(200)
              }
            )
          }
          dict.timeouts(false, $scope.clicktimeoutdata, function() {
            $scope.clickdisabled = true
            $scope.$apply()
          })
        }
      }

      //编辑合同富文本
      $scope.templateaddsave = function(tempateId, indx) {
        server.server().zjpactinfoeditorpactdo(
          {
            dataTwo: tempateId, //模板id；
            createUser: userId,
            pactId: $scope.templatePactId,
            dataOne: $scope.updatetemplateList.toString()
          },
          function(data) {
            if (data.result) {
              alert('保存成功！', function() {
                $('.templateShow').fadeOut(200)
                $scope.templateListTitle = false
                comAjax()
                $scope.$apply()
              })
            } else {
              alert(data.message)
            }
          }
        )
      }

      $scope.blurs = function(val) {
        !val ? ($scope.notetextFlag = true) : ($scope.notetextFlag = true)
      }
      //审核通过
      $scope.passOK = function() {
        // $rootScope.back();//直接使用
        !$scope.notetext
          ? ($scope.notetextFlag = true)
          : ($scope.notetextFlag = false)
        if ($scope.clickdisabled) {
          $scope.clickdisabled = false
          server.server().zjapprovalformthroghdo(
            {
              approvalFormId: $scope.approveId, //审批数据的id	是
              currentUser: userId, //当前的审批用户的id	是
              examineRemarks: $scope.notetext //审批的备注信息	是
            },
            function(data) {
              if (data.result) {
                alert(data.message, () => {
                  $state.go('examine', { projectid: $scope.projectId })
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
        dict.timeouts(false, $scope.clicktimeoutdata, function() {
          $scope.clickdisabled = true
          $scope.$apply()
        })
      }

      //审核失败
      $scope.passNO = function() {
        !$scope.notetext
          ? ($scope.notetextFlag = true)
          : ($scope.notetextFlag = false)
        if ($scope.clickdisabled) {
          $scope.clickdisabled = false
          server.server().zjapprovalformnotThroghdo(
            {
              approvalFormId: $scope.approveId, //审批数据的id	是
              currentUser: userId, //当前的审批用户的id	是
              examineRemarks: $scope.notetext //审批的备注信息	是
            },
            function(data) {
              if (data.result) {
                alert(data.message, () => {
                  $scope.passOKflag = false
                  $state.go('examine', { projectid: $scope.projectId })
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            }
          )
        }
        dict.timeouts(false, $scope.clicktimeoutdata, function() {
          $scope.clickdisabled = true
          $scope.$apply()
        })
      }

      //查看审批进度
      $scope.lookJindu = function(indx) {
        $scope.lookJinduArr = []
        server.server().zjommissionrulesdeleteByIddo(
          {
            id: $scope.approveId, //审批数据的id	是
            nodeId: $scope.nodeMsg[indx].id //当前节点的id	是
          },
          function(data) {
            if (data.result) {
              $scope.lookJinduArr = data.data
              console.log($scope.lookJinduArr)
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }

      //导出审批进度
      $scope.exportWork = function() {
        server.server().zjapprovalformexportdo(
          {
            approvalId: $scope.approveId, //审批数据的id	是
            userId: 1 //当前节点的id	是
          },
          function(data) {
            if (data.result) {
             $scope.exportprogess = data.data

              $scope.$apply()
              $('.export').dialog()
            } else {
              alert(data.message)
            }
          }
        )
      }
      $scope.exportprogessassark = function(id){
        $scope.ididididid  = id
        $('.hopbntshare3').dialog()
      }
      $scope.submitTime = function(id){
        server.server().zjremarksaddSavedo(
          {
            parentId:id,
            approvalFormId:$scope.approvalFormIdyongde,
            remark:$scope.caonidayehuifua,
            createUser:userId
          },
          function(data) {
            if (data.result) {
             alert(data.message,function(){
              $scope.exportWork()
              $('.hopbntshare3').fadeOut(200)
             })
            } else {
              alert(data.message)
            }
          }
        )
        
      }
    }
  ])

  


  //审批测绘信息
  .controller('surveyingMapInformationCtrl', [
    '$scope',
    'server',
    '$state',
    function($scope, server, $state) {
      $scope.no = '/'
      $scope.projectId = $state.params.projectid
      $scope.roomId = $state.params.roomId
      $scope.hostname = server.server().host
      var createUser = server.server().userId

      //路由跳转
      $scope.locationHerf = function(val) {
        $state.go(val, {
          projectid: $scope.projectId,
          roomId: $scope.roomId,
          approveId: $scope.approveId,
          number: val
        })
      }

      //项目信息
      function runAsync1() {
        var p = new Promise((resolve, reject) => {
          server.server().zjprojectdeleteById(
            {
              id: $scope.projectId,
              userId: createUser
            },
            data => {
              if (data.result === true) {
                $scope.project2 = data.data.project

                $scope.$apply()
                resolve($scope.project2)
              } else {
                reject(data.message)
                alert(data.message)
              }
            }
          )
        })
        return p
      }
      runAsync1()
      //右侧测绘进度
      function runAsync2() {
        var p = new Promise((resolve, reject) => {
          server.server().surveyingList(
            {
              roomId: $scope.roomId,
              type: 2
            },
            data => {
              if (data.result === true) {
                $scope.surveyingList = data.data
                $scope.$apply()
                resolve($scope.surveyingList)
              } else {
                reject(data.message)
                alert(data.message)
              }
            }
          )
        })
        return p
      }

      Promise.all([runAsync2()]).then(
        results => {
          return results
        },
        err => {
          return err
        }
      )

      //测绘信息
      server.server().surveyingInformationById(
        {
          roomId: $scope.roomId
        },
        function(data) {
          if (data.result === true) {
            $scope.surveyInfo = data.data
            $scope.singleList = data.data.singleList
            $scope.surveyList = data.data.surveyList
            $scope.housesImg = data.data.housesImg

            $scope.arr = []
            $scope.arr2 = []
            $scope.arr3 = []
            $scope.arr4 = []
            $scope.arr5 = []
            $scope.arr6 = []
            $scope.surveyList.forEach((item, i) => {
                let valssss = item
                console.log(valssss)
              switch ($scope.surveyList[i].compensateName) {
                case '擅改商业':
                  $scope.arr.push($scope.surveyList[i])
                  break
                case '临时建筑物':
                  $scope.arr2.push($scope.surveyList[i])
                  break
                case '夹层':
                  $scope.arr3.push($scope.surveyList[i])
                  break
                case '查违信息':
                  $scope.arr4.push($scope.surveyList[i])
                  break
                case '宅基地':
                  $scope.arr5.push($scope.surveyList[i])
                  break
                case '住宅':
                  $scope.arr6.push($scope.surveyList[i])
                  break
              }
            })
            $scope.$apply()
          } else {
            alert(data.message)
          }
        }
      )
    }
  ])
  //审批附件
  .controller('surveyingAffixCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      let userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.roomId = $state.params.roomId
      $scope.no = '/'

      //路由跳转
      $scope.locationHerf = function(val) {
        $state.go(val, {
          projectid: $scope.projectId,
          roomId: $scope.roomId,
          approveId: $scope.approveId,
          number: val
        })
      }

      //头部信息
      const type1 = function() {
        let p = new Promise((resolve, reject) => {
          server.server().zjprojectdeleteById(
            {
              id: $scope.projectId,
              userId: userId
            },
            data => {
              if (data.result === true) {
                if (data.data.project) {
                  $scope.project2 = data.data.project

                  $scope.$apply()
                  resolve(data.data.project)
                } else {
                  alert(data.message)
                }
              } else {
                alert(data.message)
              }
            }
          )
        })
        return p
      }
      type1()
      //根据物业id查询相关附件（attachement）
      const type2 = function() {
        let p = new Promise((resolve, reject) => {
          server.server().enclorurelist(
            {
              propertyId: $scope.roomId
            },
            data => {
              data.result === true
                ? data.data
                  ? (resolve(data.data), $scope.$apply())
                  : alert(data.message)
                : alert(data.message)
            }
          )
        })
        return p
      }

      Promise.all([type2()]).then(
        data => {
          $scope.total = 0
          $scope.list = data[0]
          $scope.list.forEach(function(item, i) {
            $scope.total += $scope.list[i].propertyAttachments.length
          })
          $scope.$apply()
        },
        err => {}
      )

      //下载导入弹窗
      $scope.DownSave = function(schemId) {
        let useHost = server.server().host
        let host = useHost + 'propertyAttachment/attachmentDownload.do'
        $scope.link = host + '?id=' + schemId
      }
    }
  ])
  //我的工作流程
  .controller('projectwarmCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      let userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.no = '/'

      // var datas= [
      //     {
      //         projectName: "风门坳旧改项目",  //项目名称
      //         count: 3, //数量
      //         projectId: "0689ee48c66a49288e8739e38734f411" //项目id
      //     },
      //     {
      //         projectName: "风门坳旧改项目",  //项目名称
      //         count: 3, //数量
      //         projectId: "0689ee48c66a49288e8739e38734f411" //项目id
      //     },
      //     {
      //         projectName: "风门坳旧改项目",  //项目名称
      //         count: 3, //数量
      //         projectId: "0689ee48c66a49288e8739e38734f411" //项目id
      //     },
      // ]

      //项目流程提醒
      server.server().zjprojectprocessqueryFlowPathdo(
        {
          userId: userId
        },
        function(data) {
          if (data.result) {
            $scope.warm = data.data
            $scope.$apply()
          } else {
            alert(data.message)
          }
        }
      )
    }
  ])

  //物业修改信息
  .controller('amendantRecordCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      $scope.roomId = $state.params.roomId
      $scope.projectId = $state.params.projectid
      $scope.imgHost = server.server().imgHost
      $scope.flag = true
      //关注
      $scope.list = {
        roomId: $state.params.roomId,
        projectId: $state.params.roomId, //1是项目id 2是物业id
        createUser: server.server().userId,
        toUserId: server.server().userId,
        type: 3, //1转移   2分享   3关注
        status: 2 //类型 1 项目 2物业
      }
      //分页
      $scope.conf = {
        total: 1, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      // 假数据来着
      let datas = {
        result: true,
        message: null,
        data: {
          pageNo: 1,
          pageCount: 1,
          pageSize: 10,
          pageStartOffset: 0,
          total: 2,
          rows: [
            {
              id: '1dcb693525884b23b7be2b9e8a8e4464', //记录id
              userName: '周炳辉', //创建人
              status: 1, //1新增 2修改 3删除
              createTime: 1516410090000, //创建时间
              type: 600 //600测绘  800补偿方案   900收款信息编辑
            },

            {
              id: 'b6d2994cbcce40498439cccbcb6f095f',
              createTime: 1516410125000,
              status: 2,
              userName: '周炳辉',
              type: 800
            }
          ]
        }
      }
      function aaabbb() {
        server.server().zjoperationrecordqueryPropertyLogdo(
          {
            roomId: $scope.roomId,
            pageNo: $scope.conf.currentPage || 1,
            pageSize: $scope.conf.itemPageLimit || 10
          },
          function(data) {
            if (data.result) {
              $scope.rows = data.data.rows
              $scope.rows.forEach(function(item, i) {
                switch (item.type) {
                  case 100:
                    $scope.rows[i].typeval = '项目'
                    break
                  case 200:
                    $scope.rows[i].typeval = '拆迁补偿规则'
                    break
                  case 300:
                    $scope.rows[i].typeval = '签约佣金规则'
                    break
                  case 400:
                    $scope.rows[i].typeval = '综合业务佣金规则'
                    break
                  case 500:
                    $scope.rows[i].typeval = '违建佣金规则'
                    break
                  case 600:
                    $scope.rows[i].typeval = '测绘信息'
                    break
                  case 700:
                    $scope.rows[i].typeval = '财务结算设置'
                    break
                  case 800:
                    $scope.rows[i].typeval = '补偿方案'
                    break
                  case 900:
                    $scope.rows[i].typeval = '收款人信息变更'
                    break
                  case 1000:
                    $scope.rows[i].typeval = '收款信息'
                    break
                  case 1100:
                    $scope.rows[i].typeval = '合同审批'
                    break
                  case 1200:
                    $scope.rows[i].typeval = '合同模板审批'
                    break
                  case 1400:
                    $scope.rows[i].typeval = '佣金信息审批(查违)'
                    break
                  case 1600:
                    $scope.rows[i].typeval = '拆迁补偿规则 一级删除'
                    break
                  default:
                    $scope.rows[i].typeval = '拆迁补偿规则'
                    break
                }
              })
              $scope.conf.total = Math.ceil(
                data.data.total / data.data.pageSize
              )
              $scope.conf.counts = data.data.total
              $scope.$broadcast('categoryLoaded')
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      aaabbb()

      $scope.goback = function() {
        $scope.flag = true
      }

      $scope.localtion = function(indx) {
        $scope.flag = true
        $scope.lookflag = 2
        $scope.userName = $scope.rows[indx].userName
        $scope.createTime = $scope.rows[indx].createTime
        $scope.locationFrefFlag = $scope.rows[indx].type //类型	是	600测绘  800补偿方案   900收款信息编辑
        $scope.updateStatus = $scope.rows[indx].status //1新增 2修改 3删除
        server.server().zjoperationrecordfindByPropertyLogdo(
          {
            id: $scope.rows[indx].id, //记录id	是
            type: $scope.rows[indx].type, //类型	是	600测绘  800补偿方案   900收款信息编辑
            status: $scope.rows[indx].status //状态	是	1新增 2修改 3删除
          },
          function(data) {
            if (data.result) {
              aaabbb()
            }
            if (data.result && data.data) {
              data.data.approvalMsg = data.data.detailMap
              if (data.data.approvalMsg) {
                //// 拆迁补偿规则
                if (
                  $scope.locationFrefFlag == '0' ||
                  $scope.locationFrefFlag == '200'
                ) {
                  $scope.rules = data.data.approvalMsg
                }
                //签约佣金规则
                if ($scope.locationFrefFlag == '300') {
                  $scope.rulesdata = []
                  $scope.rulesdata[0] = data.data.approvalMsg
                }
                //综合业务佣金规则
                if ($scope.locationFrefFlag == '400') {
                  if ($scope.updateStatus == 2) {
                    $scope.yewu = data.data.approvalMsg.serviceMap
                  } else {
                    $scope.yewu = data.data.approvalMsg
                  }
                }
                //违建佣金规则
                if ($scope.locationFrefFlag == '500') {
                  if ($scope.updateStatus == 2) {
                    $scope.weijian = data.data.approvalMsg.updateFrontMap
                  } else {
                    $scope.weijian = data.data.approvalMsg
                  }
                }
                //测绘信息
                if ($scope.locationFrefFlag == '600') {
                  if ($scope.updateStatus == 1) {
                    $scope.updataBehindMap = data.data.detailMap.updataBehindMap
                    if (
                      $scope.updataBehindMap.singleList ||
                      $scope.updataBehindMap.surveyList
                    ) {
                      $scope.fileUrl = $scope.updataBehindMap.fileUrl //fileName;
                      $scope.singleList = $scope.updataBehindMap.singleList //上面的arr
                      $scope.surveyList = $scope.updataBehindMap.surveyList //下面的arr
                    }
                  } else {
                    $scope.surveyInfo = data.data.approvalMsg
                    $scope.singleList = $scope.surveyInfo.singleList
                    $scope.surveyList = $scope.surveyInfo.surveyList
                    $scope.housesImg = $scope.surveyInfo.housesImg
                  }
                }
                //财务结算设置
                if ($scope.locationFrefFlag == '700') {
                  // 修改
                  $scope.content = data.data.approvalMsg.content //关联补偿内容
                  $scope.detail = data.data.approvalMsg.detail //规则
                  $scope.settlement = data.data.approvalMsg.settlement //
                  // if($scope.settlement.type == '1'){$scope.settlement.typement='物业补偿类';}
                  // if($scope.settlement.type == '2'){$scope.settlement.typement='安置补助类';}
                  // if($scope.settlement.type == '3'){$scope.settlement.typement='延期支付类';}
                }
                //补偿方案
                if ($scope.locationFrefFlag == '800') {
                  $scope.compensatePlanArr =
                    data.data.detailMap.updataBehindMap.listPlans
                  $scope.mapCompensate = data.data.detailMap.updataBehindMap
                  $scope.topData = []
                  $scope.bottomData = []
                  if (
                    $scope.compensatePlanArr &&
                    $scope.compensatePlanArr.length > 0
                  ) {
                    for (let i = 0; i < $scope.compensatePlanArr.length; i++) {
                      $scope.compensatePlanArr[i].identification == '0'
                        ? $scope.topData.push($scope.compensatePlanArr[i])
                        : $scope.bottomData.push($scope.compensatePlanArr[i])
                    }
                    $scope.topData.forEach((item, j) => {
                      if ($scope.topData[j].area.status == 1) {
                        $scope.topData[j].area = $scope.topData[j].area.value
                        $scope.topData[j].areaflag = true
                      }
                      if ($scope.topData[j].replacementRatio.status == 1) {
                        $scope.topData[j].replacementRatio =
                          $scope.topData[j].replacementRatio.value
                        $scope.topData[j].replacementRatioflag = true
                      }
                      if ($scope.topData[j].builtInArea.status == 1) {
                        $scope.topData[j].builtInArea =
                          $scope.topData[j].builtInArea.value
                        $scope.topData[j].builtInAreaflag = true
                      }
                      if ($scope.topData[j].builtInPeriod.status == 1) {
                        $scope.topData[j].builtInPeriod =
                          $scope.topData[j].builtInPeriod.value
                        $scope.topData[j].builtInPeriodflag = true
                      }
                    })

                    $scope.bottomData.forEach((item, Q) => {
                      if ($scope.bottomData[Q].area.status == 1) {
                        $scope.bottomData[Q].area =
                          $scope.bottomData[Q].area.value
                        $scope.bottomData[Q].areaflag = true
                      }
                      if ($scope.bottomData[Q].compensatePrice.status == 1) {
                        $scope.bottomData[Q].compensatePrice =
                          $scope.bottomData[Q].compensatePrice.value
                        $scope.bottomData[Q].compensatePriceflag = true
                      }
                      if ($scope.bottomData[Q].compensationAmount.status == 1) {
                        $scope.bottomData[Q].compensationAmount =
                          $scope.bottomData[Q].compensationAmount.value
                        $scope.bottomData[Q].compensationAmountflag = true
                      }
                      if ($scope.bottomData[Q].priceMode == '0') {
                        $scope.bottomData[Q].compensationAmount =
                          $scope.bottomData[Q].compensatePrice
                      }
                    })
                    $scope.totalMoneyCompensateflag =
                      $scope.mapCompensate.totalMoneyCompensate.status == 1
                        ? true
                        : false
                    $scope.totalMoneyCompensate =
                      $scope.mapCompensate.totalMoneyCompensate.status == 1
                        ? $scope.mapCompensate.totalMoneyCompensate.value
                        : $scope.mapCompensate.totalMoneyCompensate
                    $scope.monthlyInterimCompensateflag =
                      $scope.mapCompensate.monthlyInterimCompensate.status == 1
                        ? true
                        : false
                    $scope.monthlyInterimCompensate =
                      $scope.mapCompensate.monthlyInterimCompensate.status == 1
                        ? $scope.mapCompensate.monthlyInterimCompensate.value
                        : $scope.mapCompensate.monthlyInterimCompensate
                  }
                }
                //收款人信息变更
                if (
                  $scope.locationFrefFlag == '900' ||
                  $scope.locationFrefFlag == '1000'
                ) {
                  $scope.payee = data.data.approvalMsg
                  switch ($scope.payee.recieveType) {
                    case 1:
                      $scope.payee.recieveType = '业权人收款'
                      break
                    case 2:
                      $scope.payee.recieveType = '其他人代收款'
                      break
                    case 3:
                      $scope.payee.recieveType = '未满18岁监护人待收款'
                      break
                    case 4:
                      $scope.payee.recieveType = '关联其他业权人收款'
                      break
                  }
                }
                //合同审批
                if ($scope.locationFrefFlag == '1100') {
                  $scope.contractApprove = data.data.approvalMsg
                  $scope.pactflag = true //页面跳转标志位
                }
                //合同模版审批
                if ($scope.locationFrefFlag == '1200') {
                  $scope.ContractTemplates = data.data.approvalMsg
                  $('.basic-look-text').html($scope.ContractTemplates.content)
                  $scope.pactflag = true //页面跳转标志位
                  
                }
                //佣金信息审批(查违)
                if ($scope.locationFrefFlag == '1400') {
                  $scope.transgressMap = data.data.approvalMsg.transgressMap
                  $scope.attachmentList = data.data.approvalMsg.attachmentList
                }
                //佣金信息审批(查违)
                if (
                  $scope.locationFrefFlag == '1600' ||
                  $scope.locationFrefFlag == '0'
                ) {
                  $scope.rules = data.data.approvalMsg
                }
              }
              $scope.$apply()
            } else {
              // alert(data.message);
            }
          }
        )
      }
    }
  ])
  //我的工作流程
  .controller('informationChangeCtrl', [
    '$http',
    '$scope',
    'server',
    'dict',
    '$state',
    '$q',
    function($http, $scope, server, dict, $state, $q) {
      let userId = server.server().userId //用户id
      $scope.projectId = $state.params.projectid //项目id
      $scope.no = '/'

      //分页配置
      $scope.conf = {
        total: 10, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      //监听事件
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit + projectnameinput + searchProperty',
        function(newVal) {
          sev($scope.conf.currentPage)
        }
      )

      // 跳转存值
      $scope.shenpi = function() {
        var storage = window.localStorage
        storage.setItem('j', 'totalPropertyList')
        storage.setItem('flagindex', 4)
      }
      // =======================2018-5-4新增==========================
      //搜索function
      function search(name) {
        server.server().searchprojectName(
          {
            searchKeys: name || ''
          },
          function(data) {
            if (data.result === true) {
              $scope.searchlist = data.data
              $scope.projectName = data.data[0].id
              sev($scope.conf.currentPage)
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      search()
      // 下接选择
      $scope.myFunc2 = function(val) {
        sev($scope.conf.currentPage)
      }

      // 搜索
      $scope.sellists = function(val) {
        sev($scope.conf.currentPage)
      }
      // =======================2018-5-4新增==========================

      //项目流程提醒
      function sev(pageno) {
        server.server().zjoperationrecordqueryPropertyTakedo(
          {
            userId: userId,
            pageSize: 10,
            pageNo: pageno || 1,
            projectId: $scope.projectName,
            searchKeys: $scope.searchProperty
          },
          function(data) {
            if (data.result) {
              $scope.warm = data.data.rows
              $scope.conf.total = Math.ceil(
                data.data.total / data.data.pageSize
              )
              $scope.conf.counts = data.data.total
              $scope.$broadcast('categoryLoaded')
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
    }
  ])

  //群公告列表
  .controller('grupCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    '$rootScope',
    function($http, $scope, server, $state, dict, $rootScope) {
      $scope.hostname = server.server().imgHost
      var createUser = server.server().userId
      $scope.host = server.server().host
      $scope.no = '/'
      $scope.conf = {
        total: 6, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      //列表function
      function newslist() {
        server.server().zjaffichelistdo(
          {
            pageNo: $scope.conf.currentPage,
            pageSize: $scope.conf.itemPageLimit,
            searchKeys: $scope.searchKeys || ''
          },
          function(data) {
            if (data.result === true) {
              $scope.list = data.data.rows
              //多少页
              $scope.conf.total = data.data.pageCount
              //共有多少条数据
              $scope.conf.counts = data.data.total
              $scope.$apply()
              $scope.$broadcast('categoryLoaded')
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit+title+searchKeys',
        function(news) {
          newslist($scope.searchKeys)
        }
      )
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
            'charts' // 图表
          ]
        ],
        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        initialFrameWidth: '100%',
        initialFrameHeight: 200
      }

      $scope.newsort = 0
      //添加新闻
      $scope.add = function(flag) {
        cancelData()
        $('.' + flag).dialog()
      }

      //上传添加文件数组返回src
      $scope.fileArr = []
      $scope.fileNameChanged = function(e) {
        var files = e.target.files
        var eve = e.target
        for (var i = 0; i < files.length; i++) {
          filesupdate(files[i], eve)
        }
      }
      function filesupdate(file, eve) {
        var fd = new FormData()
        if (file) {
          var ext = file.name
            .slice(file.name.lastIndexOf('.') + 1)
            .toLowerCase()
          // if ( ext == "xls" ||  ext == "xlsx" ||ext == "csv" ||) {
          fd.append('multipartFile', file)
          $http({
            method: 'POST',
            url: $scope.host + 'attachment/fielUpload.do',
            data: fd,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
          }).then(function successCallback(data) {
            eve.value = ''
            if (data.data.result) {
              $scope.fileArr.push(data.data.data)
            } else {
              alert(data.message)
            }
          })
          $scope.$apply()
          // }else{
          //     eve.value = '';
          //     alert("只能上传Excle文件");
          //     return false;
          // }
        }
      }

      //input上传文件删除
      $scope.fileArrDel = function(ind) {
        $scope.fileArr.splice(ind, 1)
      }

      //添加保存新闻
      $scope.addnews = function(filePath, fileName) {
        //附件
        $scope.attachments = []
        if ($scope.fileArr.length > 0) {
          $scope.fileArr.forEach(function(item, i) {
            $scope.attachments[i] = {
              fileUrl: $scope.fileArr[i].filePath,
              fileName: $scope.fileArr[i].fileName,
              fileSize: $scope.fileArr[i].size
            }
          })
        }

        server.server().zjafficheaddSavedo(
          {
            createUser: createUser,
            title: $scope.newname,
            content: $scope.newcontent,
            attachmentJson:
              $scope.attachments.length > 0
                ? JSON.stringify($scope.attachments)
                : ''
          },
          function(data) {
            if (data.result === true) {
              alert(data.message, function() {
                newslist('')
                cancelData()
                $('.adddata').hide()
              })
              $scope.$apply()
            } else {
              alert(data.message, function() {
                cancelData()
              })
            }
          },
          function(err) {
            alert(data.message, function() {
              cancelData()
            })
          }
        )
      }
      //编辑新闻和初始化
      $scope.edit = function(id, flag) {
        $('.' + flag).dialog()
        server.server().zjafficheinitUpdatedo(
          {
            id: id
          },
          function(data) {
            if (data.result === true) {
              $scope.fileArr = []
              $scope.editname = data.data.afficheMap.title
              $scope.editcontent = data.data.afficheMap.content
              $scope.attachments = data.data.attachmentList
              $scope.editId = data.data.afficheMap.id
              $scope.attachments.forEach(function(item, i) {
                $scope.fileArr[i] = {
                  filePath: $scope.attachments[i].fileUrl,
                  fileName: $scope.attachments[i].fileName,
                  size: $scope.attachments[i].fileSize
                }
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      //保存编辑信息
      $scope.editsave = function() {
        //附件
        $scope.attachments = []
        if ($scope.fileArr.length > 0) {
          $scope.fileArr.forEach(function(item, i) {
            $scope.attachments[i] = {
              fileUrl: $scope.fileArr[i].filePath,
              fileName: $scope.fileArr[i].fileName,
              fileSize: $scope.fileArr[i].size
            }
          })
        }
        server.server().zjafficheupdateSavedo(
          {
            updateUser: createUser,
            id: $scope.editId,
            title: $scope.editname,
            content: $scope.editcontent,
            attachmentJson:
              $scope.attachments.length > 0
                ? JSON.stringify($scope.attachments)
                : ''
          },
          function(data) {
            if (data.result === true) {
              alert(data.message, function() {
                cancelData()
                newslist('')
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      //编辑取消
      $scope.cancel = function() {
        cancelData()
      }
      function cancelData() {
        $scope.filePath = ''
        $scope.filename = ''
        $scope.newname = ''
        $scope.newcontent = ''
        $scope.newsort = 0
        $scope.fileArr = []
      }
      //删除
      $scope.delete = function(id) {
        confirm('确认删除？', function() {
          server.server().zjaffichedeleteByIddo(
            {
              id: id
            },
            function(data) {
              if (data.result === true) {
                alert(data.message, function() {
                  newslist('')
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            },
            function(err) {}
          )
        })
      }
    }
  ])
  //群公告列表
  .controller('grupindexCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    '$rootScope',
    function($http, $scope, server, $state, dict, $rootScope) {
      $scope.hostname = server.server().imgHost
      var createUser = server.server().userId
      $scope.host = server.server().host
      $scope.no = '/'
      $scope.conf = {
        total: 6, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }
      //列表function
      function newslist() {
        server.server().zjaffichelistdo(
          {
            pageNo: $scope.conf.currentPage,
            pageSize: $scope.conf.itemPageLimit,
            searchKeys: $scope.searchKeys || ''
          },
          function(data) {
            if (data.result === true) {
              $scope.list = data.data.rows
              //多少页
              $scope.conf.total = data.data.pageCount
              //共有多少条数据
              $scope.conf.counts = data.data.total
              $scope.$apply()
              $scope.$broadcast('categoryLoaded')
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit+title+searchKeys',
        function(news) {
          newslist($scope.searchKeys)
        }
      )
    }
  ])
  //群公告详情
  .controller('lookthingsCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    '$rootScope',
    function($http, $scope, server, $state, dict, $rootScope) {
      $scope.hostname = server.server().imgHost
      var createUser = server.server().userId
      $scope.host = server.server().host
      $scope.no = '/'

      //列表function
      server.server().zjpactprotocoltemplatefindByIddo(
        {
          id: $state.params.id
        },
        function(data) {
          if (data.result === true) {
            $scope.afficheMap = data.data
            $scope.attachmentList = data.data.attachmentList
            $scope.$apply()
          } else {
            alert(data.message)
          }
        },
        function(err) {}
      )
    }
  ])
  //银行信息
  .controller('bankmessageCtrl', [
    '$http',
    '$scope',
    'server',
    '$state',
    'dict',
    '$rootScope',
    function($http, $scope, server, $state, dict, $rootScope) {
      $scope.hostname = server.server().imgHost
      var createUser = server.server().userId
      $scope.host = server.server().host
      $scope.no = '/'
      $scope.conf = {
        total: 6, //共多少页
        currentPage: 1, //默认第一页
        itemPageLimit: 10, //一页多少条
        isSelectPage: false,
        isLinkPage: false
      }

      function cancelData() {
        $scope.bankName = ''
        $scope.bankCode = ''
        $scope.peoplename = []
      }

      //列表function
      function newslist() {
        server.server().zjbanklistdo(
          {
            //
            pageNo: $scope.conf.currentPage,
            pageSize: $scope.conf.itemPageLimit,
            searchKeys: $scope.searchKeys || ''
          },
          function(data) {
            if (data.result === true) {
              $scope.list = data.data.rows
              //多少页
              $scope.conf.total = data.data.pageCount
              //共有多少条数据
              $scope.conf.counts = data.data.total
              $scope.$apply()
              $scope.$broadcast('categoryLoaded')
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      $scope.$watch(
        'conf.currentPage + conf.itemPageLimit+title+searchKeys',
        function(news) {
          newslist($scope.searchKeys)
        }
      )

      $scope.newsort = 0
      //添加新闻
      $scope.add = function(flag) {
        cancelData()
        $('.' + flag).dialog()
      }

      // 模糊输入ajax
      function initAdddo(searchKeys, flag, back) {
        $scope.dimArr = []
        server.server().zjindexassignmentinitAdddo(
          {
            projectId: $scope.projectId,
            searchKeys: searchKeys || '' //搜索条件
          },
          data => {
            if (data.result) {
              $scope.dimArr = data.data
              if (flag) {
                back(data.data)
              }
              $scope.$apply()
            } else {
              alert(data.message)
            }
          }
        )
      }
      $scope.peoplename = []
      $scope.updateanme = []
      $scope.updateflag = {
        participate: false
      }
      $scope.addflag = {
        people: false
      }
      $scope.participate = ''

      //获取焦点事件
      $scope.addfocus = function(val, flag) {
        initAdddo(val)
        $scope.dimArrFlag = true
      }
      //失去焦点
      $scope.addblur = function(val, flag) {
        if (flag) {
          $scope.updateanme.length >= 0
            ? ($scope.updateflag.participate = false)
            : ($scope.updateflag.participate = true)
        } else {
          $scope.peoplename.length >= 0
            ? ($scope.addflag.people = false)
            : ($scope.addflag.people = true)
        }

        setTimeout(function() {
          $scope.dimArrFlag = false
          $scope.$apply()
        }, 200)
      }

      //点击选择
      $scope.alertliAdd = function(name, id, ind, flag) {
        $scope.myflag = true
        if (flag) {
          if ($scope.updateanme.length > 0) {
            $scope.updateanme.forEach(function(itemm, i) {
              if (id == $scope.updateanme[i].id) {
                $scope.myflag = false
                return
              }
            })
          }
          if ($scope.myflag) {
            $scope.updateanme[0] = $scope.dimArr[ind]
            $scope.participate = ''
          }
        } else {
          if ($scope.peoplename.length > 0) {
            $scope.peoplename.forEach(function(itemm, i) {
              if (id == $scope.peoplename[i].id) {
                $scope.myflag = false
                return
              }
            })
          }
          if ($scope.myflag) {
            $scope.peoplename[0] = $scope.dimArr[ind]
            $scope.add.peopel = ''
          }
        }
      }

      // 模糊输入
      $scope.addchange = function(val, flag) {
        initAdddo(val, 1, function(data) {
          if (data.length <= 0) {
            $scope.dimArrFlag = false
          }
          $scope.dimArrFlag = true
          $scope.$apply()
        })
      }

      //模糊删除
      $scope.peopeldel = function(indx, flag) {
        if (flag) {
          $scope.updateanme.splice(indx, 1) //修改
        } else {
          $scope.peoplename.splice(indx, 1) //联系人数组
        }
      }

      $scope.addtype = 1 //添加类型
      $scope.dimArrFlag = false //模糊显示

      //添加保存新闻
      $scope.addnews = function(filePath, fileName) {
        console.log($scope.peoplename)

        server.server().zjbankaddSavedo(
          {
            createUser: createUser,
            bankCode: $scope.bankCode,
            bankName: $scope.bankName,
            userId: $scope.peoplename ? $scope.peoplename[0].id : ''
          },
          function(data) {
            if (data.result === true) {
              $scope.updateoneonenoe = $scope.peoplename[0].id
              alert(data.message, function() {
                newslist('')
                cancelData()
                $('.adddata').hide()
              })
              $scope.$apply()
            } else {
              alert(data.message, function() {
                cancelData()
              })
            }
          },
          function(err) {
            alert(data.message, function() {
              cancelData()
            })
          }
        )
      }
      //编辑新闻和初始化
      $scope.edit = function(index) {
        $('.editdata').dialog()
        $scope.dangqianid = $scope.list[index].id
        $scope.updatebankName = $scope.list[index].bankName
        $scope.updatebankCode = $scope.list[index].bankCode
        $scope.updateanme = []
      }
      //保存编辑信息
      $scope.editsave = function() {
        server.server().zjbankupdateSavedo(
          {
            id: $scope.dangqianid,
            updateUser: createUser,
            bankCode: $scope.updatebankCode,
            bankName: $scope.updatebankName
            // userId:''
          },
          function(data) {
            if (data.result === true) {
              alert(data.message, function() {
                cancelData()
                newslist('')
              })
              $scope.$apply()
            } else {
              alert(data.message)
            }
          },
          function(err) {}
        )
      }
      //编辑取消
      $scope.cancel = function() {
        cancelData()
      }

      //删除
      $scope.delete = function(id) {
        confirm('确认删除？', function() {
          server.server().zjbankdeleteByIddo(
            {
              id: id
            },
            function(data) {
              if (data.result === true) {
                alert(data.message, function() {
                  newslist('')
                })
                $scope.$apply()
              } else {
                alert(data.message)
              }
            },
            function(err) {}
          )
        })
      }
    }
  ])
