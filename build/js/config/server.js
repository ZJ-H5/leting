// 'use strict';
angular.module('app').constant('server', {}).run(['server','$rootScope','$timeout','$cookieStore',  function(server,$rootScope,$timeout,$cookieStore){

    server.server=function(){

        // var host='/web-sample/';
       // var host2 = '/web-property/';

        var under = 'http://d3.cto.shovesoft.com/#/'+'propertylink';
           var host ='http://d3.cto.shovesoft.com/ltzy/';
           var host2 = 'http://d3.cto.shovesoft.com/ltzywy/';
           var imgHost='http://d3.cto.shovesoft.com/ltzy/';

        //    var under = 'http://d6.cto.shovesoft.com/#/'+'propertylink';
        //    var host ='http://d6.cto.shovesoft.com/ltzy/';
        //    var host2 = 'http://d6.cto.shovesoft.com/ltzywy/';
        //    var imgHost='http://d6.cto.shovesoft.com/ltzy/';


        // var imgHost='http://192.168.5.27:8081/web-sample/';
        // var host='http://192.168.5.27:8081/web-sample/';
        // var host2 = 'http://192.168.5.27:8081/web-property/';

        // cas登入地址
        // var casHost = 'https://futian-test.yuanqu.cc/cas?service=';
        var casHost = 'http://smarti.yuanqu.cc/cas?service=';

        //总登入地址
        var loginOut = host+"logout";
        var loginHost =casHost+host+'login/interface';

        // 头像路径
        var headImg = 'http://file4.qiyesq.com';
        
        //房源登入地址
        var  propertyUrl = host2+'login/interface';

       if($cookieStore.get("userId")){
           var userId = $cookieStore.get("userId");
       }else{
           var userId = '2ccff04961694ee2978cbb2e18f456ce'
       }




        //日期格式化
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            };

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        };
        function webUpload(obj) {
            var auto=obj.auto;
            var server=host+obj.server;
            var uploader = WebUploader.create({
                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/jpg,image/jpeg,image/png'
                },
                method:'POST',
                host:host,
                // 选完文件后，是否自动上传。
                auto: auto,
                // swf文件路径
                swf: '../Content/scripts/plugins/webuploader/Uploader.swf',

                // 文件接收服务端。
                server: server,
                pick:'.uploaderBtn',

                chunked: false,//开始分片上传
                chunkSize: 2048000,//每一片的大小
                formData: {
                    guid: GUID //自定义参数，待会儿解释
                },

                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: true,
                multiple:true,
                // compress:true
                threads:1,//上传并发数。允许同时最大上传进程数。

            });
            return uploader
        }
        //创建 jsonp请求
        function c_jsonp(url, params, callback, cache) {
            //地址规格约束
            if (url.indexOf(host) == -1) {
                if (url.indexOf('/') != 0) {
                    url = host + url;
                } else {
                    url = host + url.substr(1);
                }
            }
            //是否有SID
            if (getLocalObj("SID")) {
                params.SID = getLocalObj("SID").SID;
            }
            //参数拼合
            if (url.indexOf('?') != -1) {
                totalUrl = url + paramsToStr(params).replace(/\?/g, '&');
            } else {
                totalUrl = url + paramsToStr(params);
            }
            //判断是否缓存
            if (!cache) {
                $http.jsonp(totalUrl).success(
                    function (data) {
                        callback(data);
                    }
                );
            } else {
                $http.jsonp(totalUrl, {
                    cache: true
                }).success(
                    function (data) {
                        callback(data);
                    }
                );
            }
        };



        //创建 jquery 请求
        function jqReq(type,url,params,async,successCallback,errorCallback,cache) {
            $.ajax({
                type: type,
                url: host+url,
                data: params,
                dataType:"json",
                xhrFields: {
                    withCredentials: true
                },
                async: async,
                cache: cache?false:cache,
                success: function (rel) {
                    if(rel=='-100'){
                        var hrefs = window.location.href;
                        hrefs = hrefs.substr(0,hrefs.indexOf('#'))
                        window.location = hrefs+'#/propertylink';
                        return;
                    }else if(rel=='-200'){
                        window.location=loginHost;
                        return;
                    }else{
                        successCallback(rel);
                    }
                },
                error:function(err){
                    if(errorCallback){
                        errorCallback(err)
                    }
                },
                complete:function () {
                        // $rootScope.hideLoading();
                },
                beforeSend:function () {
                    // $rootScope.showLoading();
                    // //发送ajax请求之前向http的head里面加入验证信息
                    // xhr.setRequestHeader("token", Ticket); // 请求发起前在头部附加token
                }

            });
        }

        //创建 jquery 请求
        function jqReq2(type,url,params,async,successCallback,errorCallback,cache) {
            $.ajax({
                type: type,
                url: host2+url,
                data: params,
                async: async,
                dataType:"json",
                xhrFields: {
                    withCredentials: true
                },
                cache: cache?false:cache,
                success: function (rel) {
                    if(rel=='-100'){
                        var hrefs = window.location.href;
                        hrefs = hrefs.substr(0,hrefs.indexOf('#'))
                        window.location = hrefs+'#/propertylink';
                        return;
                    }else if(rel=='-200'){
                        window.location=loginHost;
                        return;
                    }else{
                        successCallback(rel);
                    }
                },
                error:function(err){
                    if(errorCallback){
                        errorCallback(err)
                    }
                },
                complete:function () {
                    // $rootScope.hideLoading();
                },
                beforeSend:function () {
                    // $rootScope.showLoading();
                }
            });
        }

        //创建 jquery 请求,无加载提示
        function jqReqNoTips(type,url,params,async,successCallback) {
            $.ajax({
                type: type,
                url: host+url,
                data: params,
                async: async,
                cache: false,
                success: function (rel) {
                    /*if(rel.msg=='UserNeedLogin'){
                     //$rootScope.showTips('请先登录');
                     $state.go('login');
                     $ionicViewSwitcher.nextDirection("back");
                     return;
                     }*/
                    successCallback(rel);
                },
                error:function (err) {

                }
            });
        }

        //创建 jquery 请求,无登录跳转
        function jqReqNoTurnOut(type,url,params,async,successCallback){
            $.ajax({
                type: type,
                url: host+url,
                data: params,
                async: async,
                cache: false,
                success: function (rel) {
                    successCallback(rel);
                }
            });
        }
        return{
            host:host,
            host2:host2,
            loginHost:loginHost,
            userId:userId,
            imgHost:imgHost,
            loginOut:loginOut,
            casHost:casHost,
            propertyUrl:propertyUrl,
            headImg:headImg,
            //登录
            login:function(params, callback,errorback, cache){
                var api = "siuser/login";
                jqReq('post',api,params,true,callback,errorback);
            },
            //登出
            exitLoginNow:function(params, callback,errorback, cache){
                var api = "siuser/exitLogin.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //用户名和头像
            zjmUserImg:function(params, callback,errorback, cache){
                var api = "siuser/findByUser.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //物业列表-项目名称
            projectnamesel:function(params, callback,errorback, cache){
                var api = "project/queryProjectName.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            /*新建项目-补偿方案*/
            // 添加补偿类型
            addtype:function(params, callback,errorback, cache){
                var api = "compensationrulestype/addSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //查询列表
            compensationlist:function(params, callback,errorback, cache){
                var api = "rulescompensation/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //置换类型初始化
            ruleslist:function(params, callback,errorback, cache){
                var api = "rulescompensation/initAdd.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //置换类型二级联动
            projectlist:function(params, callback,errorback, cache){
                var api = "compensatetype/stage.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //置换类型保存
            addbuild:function(params, callback,errorback, cache){
                var api = "rulescompensation/addSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //查看初始化
            checkinfolist:function(params, callback,errorback, cache){
                var api = "rulescompensation/findById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //拆迁补偿一级规则名字修改保存
            ruleNameUpdate:function(params, callback,errorback, cache){
                var api = "compensationrulestype/updateSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //拆迁补偿一级删除
            ruleDelete:function(params, callback,errorback, cache){
                var api = "compensationrulestype/deleteById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //编辑拆迁补偿规则初始化-主题建筑
            editinfobuild:function(params, callback,errorback, cache){
                var api = "rulescompensation/initUpdate.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //货币补偿-初始化
            editinfoprice:function(params, callback,errorback, cache){
                var api = "rulescompensation/initUpdate.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //货币修改提交审核
            updatepricelist:function(params, callback,errorback, cache){
                var api = "rulescompensation/updateSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //删除拆除规则
            deletecom:function(params, callback,errorback, cache){
                var api = "rulescompensation/deleteById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //1、财务结算列表
            deleteById:function(params, callback,errorback, cache){
                var api = "financialsettlement/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            // 6、项目信息
            zjprojectdeleteById:function(params, callback,errorback, cache){
                var api = "project/findById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            // 项目删除
            delProject:function(params, callback,errorback, cache){
                var api = "project/deleteById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //2、项目列表查询 lh
            lhprojectlist:function(params, callback,errorback, cache){
                var api = "project/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            // 修改记录列表
            updatarecoedlist:function(params, callback,errorback, cache){
                var api = "operationrecord/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            // 6、项目信息
            zjprojectfindByIddo:function(params,callback,errorback,cache){
                var api = "project/findById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //8、项目详情接口之一
            zjprojectprojectDetaileddo:function(params,callback,errorback,cache){
                var api = "project/projectDetailed.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-规划图上传
            addProjectAttachment:function(params,callback,errorback,cache){
                var api = "project/addProjectAttachment.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-规划图预览
            watchAttachment:function(params,callback,errorback,cache){
                var api = "project/queryProjectEffectPicture.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-附件列表
            filelist:function(params,callback,errorback,cache){
                var api = "attachment/queryAttachementByprojId.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-附件上传
            uploaddata64:function(params,callback,errorback,cache){
                var api = "attachment/base64Upload.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-附件保存
            savefile:function(params,callback,errorback,cache){
                var api = "attachment/additemAttachment.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-附件下载
            downloadprojectfile:function(params,callback,errorback,cache){
                var api = "attachment/fileDownload.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //项目详情-附件删除
            deletefifle:function(params,callback,errorback,cache){
                var api = "attachment/changeDeleteStatus.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            // 项目管理编辑初始化
            editInit:function(params,callback,errorback,cache){
                var api = "project/initUpdate.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //项目管理删除功能
            deleteProjectData:function(params,callback,errorback,cache){
                var api = "project/deleteById.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //项目管理三级联动
            provinceselect:function(params,callback,errorback,cache){
                var api = "city/cityProper.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //项目管理编辑保存
            saveproject:function(params,callback,errorback,cache){
                var api = "project/updateSave.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //项目管理跟进信息保存
            addfollowinfo:function(params,callback,errorback,cache){
                var api = "followup/addSave.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //物业信息?
            zjroomlistdo:function(params,callback,errorback,cache){
                var api = "room/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //物业信息查询
            zjltzywyroomlistdo:function(params,callback,errorback,cache){
                var api = "room/list.do";
                jqReq('post',api,params,true,callback,errorback);

            },

            //物业信息
            propertyInfoCtrl:function(params,callback,errorback,cache){
                var api = "room/list.do";
                jqReq2('post',api,params,true,callback,errorback);

            },
            //物业详情-附件初始化
            enclorurelist: function (params, callback, errorback, cache) {
                var api = "propertyAttachment/queryPropertyAttachment.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-附件添加
            enclosursave: function (params, callback, errorback, cache) {
                var api = "propertyAttachment/attachmentUpload.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-附件删除
            deleteenclosure: function (params, callback, errorback, cache) {
                var api = "propertyAttachment/deleteStatusById.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-基本信息
            basicInformation: function (params, callback, errorback, cache) {
                var api = "room/propertyDetailedCount.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-补偿信息
            basicCompensate: function (params, callback, errorback, cache) {
                var api = "compensationplandetails/basicCompensateInfo.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-物业追踪列表
            informationDetail:function (params, callback, errorback, cache) {
                var api = "trackinginformationdetai/queryTrackDetail.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-添加物业跟踪信息
            addInformation:function (params, callback, errorback, cache) {
                var api = "trackinginformationdetai/addTrackingInformation.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            // 物业详情-签约进度列表
            signList:function (params, callback, errorback, cache) {
                var api = "propertystage/list.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-遇到问题一级栏目
            signListProblem:function (params, callback, errorback, cache) {
                var api = "sign/list.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业详情-遇到问题二级栏目
            /*listSecondProblem:function (params, callback, errorback, cache) {
             var api = "sign/list.do";
             jqReq3('post', api, params, true, callback, errorback)
             },*/
            //添加测绘信息-初始化
            surveyInit:function (params, callback, errorback, cache) {
                var api = "datasheet/initAdd.do";
                jqReq('post', api, params, true, callback, errorback)

            },

            //测绘进度
            surveyingList:function (params, callback, errorback, cache) {
                var api = "propertystage/list.do";
                jqReq('post', api, params, true, callback, errorback)

            },

            //测绘信息
            surveyingInformationById:function(params,callback,errorback,cache){
                var api="datasheet/findById.do";
                jqReq('post',api,params,true,callback,errorback)

            },
            //测绘信息保存
            saveserveylist:function(params,callback,errorback,cache){
                var api="datasheet/addSave.do";
                jqReq('post',api,params,true,callback,errorback)

            },
            //测绘修改初始化
            surveyupdateinit:function(params,callback,errorback,cache){
                var api="datasheet/initUpdate.do";
                jqReq('post',api,params,true,callback,errorback)

            },
            //测绘修改保存
            saveupdatesurveylist:function(params,callback,errorback,cache){
                var api="datasheet/updateSave.do";
                jqReq('post',api,params,true,callback,errorback)

            },
            //层级结构新增
            dataHierarchySave:function(params,callback,errorback,cache){
                var api="schema/addSave.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //层级结构修改初始化
            editDH:function(params,callback,errorback,cache){
                var api="schema/initUpdate.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //层级结构修改保存
            editSaveDH:function(params,callback,errorback,cache){
                var api="schema/updateSave.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //层级结构删除
            deleteDH:function(params,callback,errorback,cache){
                var api="schema/deleteById.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //层级结构查询
            dataHierarchyList:function(params,callback,errorback,cache){
                var api="schema/list.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //二级层级结构初始化
            dataInit:function(params,callback,errorback,cache){
                var api="schemaobj/initAdd.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //二级层级结构二级联动初始化
            dataInitTwice:function(params,callback,errorback,cache){
                var api="schemaobj/higherLevel.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //层级结构添加
            adddata:function(params,callback,errorback,cache){
                var api="schemaobj/addSave.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //层级结构删除
            deleteDataHierarchy:function(params,callback,errorback,cache){
                var api="schemaobj/deleteById.do";
                jqReq2('post',api,params,true,callback,errorback)
            },
            //增加查伪信息
            addfalseinfo:function(params,callback,errorback,cache){
                var api="illegalarchitectureinformation/addAdministrativeNotice.do";
                jqReq('post',api,params,true,callback,errorback)
            },
            //查伪信息 物业
            checkingFalseList:function(params,callback,errorback,cache){
                var api="illegalarchitectureinformation/getIllegalInfo.do";
                jqReq('post',api,params,true,callback,errorback)
            },
            // 2017/10/24
            //物业新增zj
            zjroomaddSavedoADD:function(params,callback,errorback,cache){
                var api = "room/addSave.do";
                jqReq2('post',api,params,true,callback,errorback);
            },
            //物业新增初始化zj
            zjroominitAdddo:function(params,callback,errorback,cache){
                var api = "room/initAdd.do";
                jqReq2('post',api,params,true,callback,errorback);
            },
            //物业新增 层级结构子级结构
            zjroominitAddSubleveldo:function(params,callback,errorback,cache){
                var api = "room/initAddSublevel.do";
                jqReq2('post',api,params,true,callback,errorback);
            },
            //9、物业基本信息接口之一
            zjroomessentialInformationdo:function(params,callback,errorback,cache){
                var api = "room/essentialInformation.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //9、物业基本信息接口之二（补偿）
            zjbasicCompensateInfodo:function(params,callback,errorback,cache){
                var api = "compensationplandetails/basicCompensateInfo.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //9物业查找签约阶段公共接口
            zjpropertystagelistdo:function(params,callback,errorback,cache){
                var api = "propertystage/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //已关联物业查询
            zjrelatedlistdo:function(params,callback,errorback,cache){
                var api = "related/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //添加物业关联查询列表
            zjroompropertyListdo:function(params,callback,errorback,cache){
                var api = "room/propertyList.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //2、保存关联物业
            zjrelatedaddSavedo:function(params,callback,errorback,cache){
                var api = "related/addSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //3、物业管理区域搜索条件
            zjroomsearchForConditiondo:function(params,callback,errorback,cache){
                var api = "room/searchForCondition.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //zjm-2017-12-5 项目流程开始
            //项目流程列表
            processlist:function(params,callback,errorback,cache){
                var api = "projectprocess/list.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //新增项目流程
            addNewProcessNode:function(params,callback,errorback,cache){
                var api = "projectprocess/addSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //添加信息
            addInfoData:function(params,callback,errorback,cache){
                var api = "projectprocess/updateDetail.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //完成前置条件
            completeprocess:function(params,callback,errorback,cache){
                var api = "projectprocess/updateAccomplish.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //模糊搜索，搜出人名
            searchPeopleName:function(params,callback,errorback,cache){
                var api = "indexassignment/initAdd.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //删除流程
            deleteprocess:function(params,callback,errorback,cache){
                var api = "projectprocess/deleteById.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            watchPreposeList:function(params,callback,errorback,cache){
                var api = "projectprocess/queryPreposeList.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //附件上传
            addAttachment:function(params,callback,errorback,cache){
                var api = "projectprocess/addAttachment.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //附件列表
            watchAttachmentList:function(params,callback,errorback,cache){
                var api = "projectprocess/queryAttachmentList.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //附件删除
            deleteAttachment:function(params,callback,errorback,cache){
                var api = "attachment/changeDeleteStatus.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //zjm-2017-12-6 项目流程结束
            //项目流程设置
            addprojectrooml:function(params,callback,errorback,cache){
                var api = "projectprocess/addSave.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //3、项目流程完成操作
            updateaccomplish:function(params,callback,errorback,cache){
                var api = "projectprocess/updateAccomplish.do";
                jqReq('post',api,params,true,callback,errorback);
            },
            //二级层级结构查询
            schemaObjList:function (params, callback, errorback, cache) {
                var api = "schemaobj/list.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //查找省份列表
            lyProvince:function (params, callback, errorback, cache) {
                var api ="city/province.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //2、市、区查询列表
            lyCity:function (params, callback, errorback, cache) {
                var api = "city/cityProper.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //lySaveSubMit
            lySaveSubMit:function (params, callback, errorback, cache) {
                var api = "project/addSave.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //物业信息zheng
            prpManageCtrlFn: function (params, callback, errorback, cache) {
                var api = "room/list.do";
                jqReq2('post', api, params, true, callback, errorback)
            },
            // 签约佣金规则列表
            ctommissionrules:function(params, callback,errorback, cache){
                var api = "ommissionrules/list.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            /*2017.10.29----*/
            // 违建佣金规则查询列表
            ctillegalcommissionrule:function(params, callback,errorback, cache){
                var api = "illegalcommissionrule/list.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            // 综合业务佣金规则查询列表
            ctintegratedservices:function(params, callback,errorback, cache){
                var api = "integratedservices/list.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            // 违建佣金规则添加
            ctaddillegalcommission:function(params, callback,errorback, cache){
                var api = "illegalcommissionrule/addSave.do";
                jqReq('post',api,params,true,callback,errorback);

            },

            // 综合业务佣金规则添加保存
            ctintegratedaddsave:function(params, callback,errorback, cache){
                var api = "integratedservices/addSave.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            // 签约佣金规则添加保存
            ctommissionrulesSave:function(params, callback,errorback, cache){
                var api = "ommissionrules/addSave.do";

                jqReq('post',api,params,true,callback,errorback);

            },
            // 查看 违建佣金规则
            ctcheckillegalcommission:function(params, callback,errorback, cache){
                var api = "illegalcommissionrule/initUpdate.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //9、查询列表
            rulescompentn: function (params, callback, errorback, cache) {
                var api = "rulescompensation/deleteById.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //web-property/room/listSearch.do?projectId=261e554de2f3493ebed1e4b6567818d1
            //9、新增城中村
            zjroomlistSearchdo: function (params, callback, errorback, cache) {
                var api = "room/listSearch.do";
                jqReq2('post', api, params, true, callback, errorback)
            },
            //删除物业
            zjroomdeleteByIddo:function(params, callback, errorback, cache){
                var api = "room/deleteById.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //8、物业修改初始化
            zjroominitUpdatedo:function(params, callback, errorback, cache){
                var api = "room/initUpdate.do";
                jqReq2('post', api, params, true, callback, errorback)
            },
            //8、物业修改保存
            zjroomaddSavedo:function(params, callback, errorback, cache){
                var api = "room/updateSave.do";
                jqReq2('post', api, params, true, callback, errorback)
            },
            //8、左则列表
            zjprojectprojectListdo:function(params, callback, errorback, cache){
                var api = "project/projectList.do";
                jqReq('post', api, params, true, callback, errorback)
            },
			 // 2017-11-01 合同管理---支付方案---信息获取
            lajpactPayLoadListdo:function (params, callback, errorback,cache){
                var api = "payment/paymentListForPact.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2017-11-01 合同管理---查违信息
            showComcheckFalsedo:function (params, callback, errorback,cache) {
                var api = "illegalarchitectureinformation/getIllegalInfo.do";
                jqReq('post',api, params, true, callback, errorback)

            },
            ///9、物业Excel数据导入 room/leadingIn.do
            zjroomleadingIndo:function (params, callback, errorback,cache) {
                var api = "room/leadingIn.do";
                jqReq2('post',api, params, true, callback, errorback)
            },
            // 业权人合同管理   ownership/queryOwnerAndRecieve.do
            zjownershipqueryOwnerAndRecievedo:function (params, callback, errorback,cache) {
                var api = "ownership/queryOwnerAndRecieve.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 业权人关系图谱  ownership/queryOwnerAndRecieve.do
            zjownershipqueryOwnerRelationShipdo:function (params, callback, errorback,cache) {
                var api = "ownership/queryOwnerRelationShip.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //.联系人关系图谱（业权人收款方式）/makecollections/queryRelationShip.do
            zjmakecollectionsqueryRelationShipdo:function (params, callback, errorback,cache) {
                var api = "makecollections/queryRelationShip.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            ///2.	添加业权人
            zjownershipaddSave:function (params, callback, errorback,cache) {
                var api = "ownership/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            ///2.	添加业权人
            zjmakecollectionsaddSave:function (params, callback, errorback,cache) {
                var api = "makecollections/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //亲属关系下拉菜单初始化化
            zjkinsfolkinitKinsfolkListdo:function (params, callback, errorback,cache) {
                var api = "kinsfolk/initKinsfolkList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除业权人
            zjownershipdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "ownership/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除联系人
            zjmakecollectionsdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "makecollections/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加type4个收款方式
            zjmakerecieveaddRecieveWaydo:function (params, callback, errorback,cache) {
                var api = "makerecieve/addRecieveWay.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编缉提交type4个收款方式
            zjmakerecieveaddRecieveWaydoEdit:function (params, callback, errorback,cache) {
                var api = "makerecieve/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编织联系人改初始化
            zjmakecollectionsinitUpdatedo:function (params, callback, errorback,cache) {
                var api = "makecollections/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编织联系人改初始化
            zjmakecollectionsupdateSavedo:function (params, callback, errorback,cache) {
                var api = "makecollections/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)

            },
            // 2017-11-01 物业信息统计
            showPropertyMangageMentdo:function (params, callback, errorback,cache) {
                var api = "room/propertyManageList.do";
                jqReq('post',api, params, true, callback, errorback)
            }, // 2017-11-02 物业信息--获取签约和测绘的所有子节点
            showSignNodedo:function (params, callback, errorback,cache) {
                var api = "sign/queryQualification.do";
                jqReq('post',api, params, true, callback, errorback)
            }, // 2017-11-02 物业管理---未签约物业
            showNoSignPropertydo:function (params, callback, errorback,cache) {
                var api = "room/notSigned.do";
                jqReq('post',api, params, true, callback, errorback)
            }, // 2017-11-02 物业管理---未签约的原因
            showNoSignCasesdo:function (params, callback, errorback,cache) {
                var api = "room/notSignedCondition.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2017-11-02 物业管理---物业列表
            showPropertyByAreado:function (params, callback, errorback,cache) {
                var api = "room/queryList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2017-11-02 物业管理---物业管理区域搜索条件
            showPropertyConditionsdo:function (params, callback, errorback,cache) {
                var api = "room/searchForCondition.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //2017-11-06 4、违建佣金规则修改保存
            updateSave:function (params, callback, errorback,cache) {
                var api = "illegalcommissionrule/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2017-11-02 合同----签约佣金方案
            showSignedCommissiondo:function(params, callback, errorback,cache){
            var api = "signedcommission/queryList.do";
            jqReq('post',api, params, true, callback, errorback)
           },// 2017-11-02 合同----违建佣金方案
            showIllSignedCommissiondo:function(params, callback, errorback,cache){
                var api = "signedcommission/queryIllList.do";
                jqReq('post',api, params, true, callback, errorback)
            },// 2017-11-02 合同----综合佣金方案
            showAllSignedCommissiondo:function(params, callback, errorback,cache){
                var api = "signedcommission/queryAllList.do";
                jqReq('post',api, params, true, callback, errorback)
            },// 2017-11-02 合同----合同列表
            showPactList:function(params, callback, errorback,cache){
                var api = "room/contractStatistics.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            deleteById:function (params, callback, errorback,cache) {
                var api = "illegalcommissionrule/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)

            },
            //5、修改保存综合业务佣金规则查询列表
            servicesavedata:function(params, callback,errorback, cache){
                var api = "integratedservices/updateSave.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //5、删除综合业务佣金规则查询列表
            servicedeldata:function(params, callback,errorback, cache){
                var api = "integratedservices/deleteById.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            //5、删除综合业务佣金规则查询列表
            ruleinitupdata:function(params, callback,errorback, cache){
                var api = "ommissionrules/initUpdate.do";
                jqReq('post',api,params,true,callback,errorback);

            },
            // 修改保存签约佣金规则
            ruleupdateSave:function(params, callback,errorback, cache){
                var api = "ommissionrules/updateSave.do";

                jqReq('post',api,params,true,callback,errorback);

            },
            // 修改保存签约佣金规则
            ruledeleteSave:function(params, callback,errorback, cache){
                var api = "ommissionrules/deleteById.do";

                jqReq('post',api,params,true,callback,errorback);

            },
		// 修改保存签约佣金规则
            ruledeleteSave:function(params, callback,errorback, cache){
                var api = "ommissionrules/deleteById.do";

                jqReq('post',api,params,true,callback,errorback);

            },
            //4、修改初始化
            servicedupdate:function(params, callback,errorback, cache){
                var api = "integratedservices/initUpdate.do";

                jqReq('post',api,params,true,callback,errorback);

            },
            //1.	关联其他业权收款信息新增初始化
            zjmakerecieveinitAdddo:function (params, callback, errorback,cache) {
                var api = "makerecieve/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            // 7、查看综合业务佣金规则
             servicefindbyid:function (params, callback, errorback,cache) {
                 var api = "integratedservices/findById.do";
                 jqReq('post',api, params, true, callback, errorback)
             },

                // 1、新增初始化综合业务佣金规则
            serviceinitAdd:function (params, callback, errorback,cache) {
                var api = "integratedservices/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },



            // 1、新增初始化综合业务佣金规则
            servisign:function (params, callback, errorback,cache) {
                var api = "sign/stage.do";
                jqReq('post',api, params, true, callback, errorback)
            },
			//添加物业跟进信息

             lajakerecieveinitAdddo:function (params, callback, errorback,cache) {
             var api = "task/queryRoomInformation.do";
             jqReq('post',api, params, true, callback, errorback)

            },
            //跟踪信息删除
            deltranckinfo:function (params, callback, errorback,cache) {
                var api = "trackinginformationdetai/delete.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //1项目管理列表初始化
            zjfollowuplistdo:function (params, callback, errorback,cache) {
                var api = "followup/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //1项目管理列表发布
            zjfollowupaddSavedo:function (params, callback, errorback,cache) {
                var api = "followup/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //1项目管理列表删除
            zjfollowupdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "followup/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //4.	补偿规则初始化
            zjinitCompensateRuledo:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/initCompensateRule.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //5.	 1. 根据补偿规则id查询添加补偿方案信息
            zjqueryCompenPlando:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/queryCompenPlan.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 添加补偿方案
            zjaddCompensationPlando:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/addCompensationPlan.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //查询补偿方案展示信息
            zjqueryCompensationInfodo:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/queryCompensationInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //初始化还建期数
            zjsettingsinitPeriodsdo:function (params, callback, errorback,cache) {
                var api = "settings/initPeriods.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //补偿方案编辑提交
            zjupdateCompensationInfodo:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/updateCompensationInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3、物业导出
            zjroomexportdo:function (params, callback, errorback,cache) {
                var api = "room/export.do";
                jqReq2('post',api, params, true, callback, errorback)
            },
            //3、模版导出
            zjroomtempletdo:function (params, callback, errorback,cache) {
                var api = "room/templet.do";
                jqReq2('post',api, params, true, callback, errorback)
            },
            //3、删除关联物业
            zjrelateddeleteByIddo:function (params, callback, errorback,cache) {
                var api = "related/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)

            },	             

	    //审批管理
            //审批列表
            approvallist:function (params, callback, errorback,cache) {
                var api = "approvalform/list.do";

                jqReq('post',api, params, true, callback, errorback)
            },
            //3、支付方案审批列表
            zjapprovalformfincialApprovalListdo:function (params, callback, errorback,cache) {
                var api = "approvalform/fincialApprovalList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3、支付方案审批信息
            zjapprovalformdetaildo:function (params, callback, errorback,cache) {
                var api = "approvalform/detail.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //4、详情页面或者审批页面查看审批节点对应的审批人信息
            zjommissionrulesdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "approvalform/nodeMsg.do";
                jqReq('post',api, params, true, callback, errorback)
            },


            //查询物业拆除信息拿id
            zjroominitOrderSigndo:function (params, callback, errorback,cache) {
                var api = "room/initOrderSign.do";
		    jqReq('post',api, params, true, callback, errorback)
            },

            //查询物业拆除信息
            zjroomqueryPropertyDismanInfodo:function (params, callback, errorback,cache) {
                var api = "room/queryPropertyDismanInfo.do";
		    jqReq('post',api, params, true, callback, errorback)
            },
            //查看合同
            // watchPactInfoData:function (params, callback, errorback,cache) {
            //     var api = "pactinfo/watchPactData.do";
            //     jqReq('post',api, params, true, callback, errorback)
            // },

            //移交信息
            zjroomqueryPropertyDismantledo:function (params, callback, errorback,cache) {
                var api = "room/queryPropertyDismantle.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //拆除时间
            zjpropertydismantleaddPropertyDismantledo:function (params, callback, errorback,cache) {
                var api = "propertydismantle/addPropertyDismantle.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*财务管理*/
            //搜索条件初始化
            searchCriterialist:function (params, callback, errorback,cache) {
                var api = "payment/searchCriteria.do";
                jqReq('post',api, params, true, callback, errorback)
            },          
            //物业拆除初始化
            zjpropertyAttachmentattachmentTypedo:function (params, callback, errorback,cache) {
                var api = "propertyAttachment/attachmentType.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //财务管理列表
            criterialist:function (params, callback, errorback,cache) {
                var api = "payment/queryFinanceList.do";

                jqReq('post',api, params, true, callback, errorback)
            },
            //查询物业拆除信息
            zjroomqueryPropertyDismanInfodo:function (params, callback, errorback,cache) {
                var api = "room/queryPropertyDismanInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //查询物业拆除信息
            zjroominitOrderSigndo:function (params, callback, errorback,cache) {
                var api = "room/initOrderSign.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //审批管理
            //审批列表
            approvallist:function (params, callback, errorback,cache) {
                var api = "approvalform/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //审批管理
	    
            //审批列表
            approvallist:function (params, callback, errorback,cache) {
                var api = "approvalform/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*财务管理*/
            //佳盟写的
            criterialist:function (params, callback, errorback,cache) {
                var api = "payment/queryFinanceList.do";
                jqReq('post', api, params, true, callback, errorback)
            },
            //审批管理列表筛选条件
            approvalformConditions:function (params, callback, errorback,cache) {
                var api = "approvalform/conditions.do";

                jqReq('post',api, params, true, callback, errorback)
            },

            //我的工作2、关键业务指标列表
            workkeylist:function (params, callback, errorback,cache) {
                var api = "indexassignment/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //批量申请支付
            payapplylist:function (params, callback, errorback,cache) {
                var api = "payment/paymentApproval.do";
                 jqReq('post',api, params, true, callback, errorback)
            },
            //查看审批详情
            approvalformDetail:function (params, callback, errorback,cache) {
                var api = "approvalform/detail.do";

                jqReq('post',api, params, true, callback, errorback)
            },

            //.物业移交阶段初始化
            zjroomgetInitProTrando:function (params, callback, errorback,cache) {
                var api = "room/getInitProTran.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //物业移交详情
            zjqueryTransferInfodo:function (params, callback, errorback,cache) {
                var api = "room/queryTransferInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3.添加
            zjpropertyinfoaddWaterPowerTransferdo:function (params, callback, errorback,cache) {
                var api = "propertyinfo/addWaterPowerTransfer.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //物业移交列表分页
            zjqueryPropertyTransferdo:function (params, callback, errorback,cache) {
                var api = "room/queryPropertyTransfer.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //佣金支付列表
            commissionlist:function (params, callback, errorback,cache) {
                var api = "signedcommission/financeCommision.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //佣金批量申请支付
            commissionapplylist:function (params, callback, errorback,cache) {
                var api = "signedcommission/paymentApproval.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //财务支付初始化列表
            payfinancelist:function (params, callback, errorback,cache) {
                var api = "payment/paymentStatistics.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付列表头部初始化
            payheadlist:function (params, callback, errorback,cache) {
                var api = "payment/paymentCount.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付列表
            paydatalist:function (params, callback, errorback,cache) {
                var api = "payment/paymentList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付列表-佣金头部初始化
            paycommissionheadlist:function (params, callback, errorback,cache) {
                var api = "payment/commisionCount.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付列表-佣金
            paycommissiondatalist:function (params, callback, errorback,cache) {
                var api = "payment/commisionPaymentList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付-佣金
            paymoneynow:function (params, callback, errorback,cache) {
                var api = "payment/commisionPayment.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付-除佣金外
            paynow:function (params, callback, errorback,cache) {
                var api = "payment/payment.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //还建初始化
            zjroominitBuildOrderSigndo:function (params, callback, errorback,cache) {
                var api = "room/initBuildOrderSign.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //还建分页查询
            zjroomqueryPropertyBuildInfodo:function (params, callback, errorback,cache) {
            var api = "room/queryPropertyBuildInfo.do";
            jqReq('post',api, params, true, callback, errorback)
            },
            //还建拆赔方案
            zjbuiltinfogetCompensatePlando:function (params, callback, errorback,cache) {
                var api = "builtinfo/getCompensatePlan.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //截留款项目初始化
            zjbuiltinfoinitFinancialInfodo:function (params, callback, errorback,cache) {
                var api = "builtinfo/initFinancialInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //2、关键业务指标列表
            zjindexassignmentlistdo:function (params, callback, errorback,cache) {
                var api = "indexassignment/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //2、关键业务指标发布//
            zjindexassignmentaddSavedo:function (params, callback, errorback,cache) {
                var api = "indexassignment/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //、关键业务指标统计
            zjindexassignmenttaskCountdo:function (params, callback, errorback,cache) {
                var api = "indexassignment/taskCount.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //、关键业务指标统计柱状图
            zjindexassignmenttaskColumnardo:function (params, callback, errorback,cache) {
                var api = "indexassignment/taskColumnar.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //我的工作查(最近记录)
            zjtaskqueryTrackingInformationdo:function (params, callback, errorback,cache) {
                var api = "task/queryTrackingInformation.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //我的工作改(最近记录)
            zjtaskaddSolutiondo:function (params, callback, errorback,cache) {
                var api = "task/addSolution.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //我的工作删除(最近记录)
            zjtaskdeleteTrackStatusdo:function (params, callback, errorback,cache) {
                var api = "task/deleteTrackStatus.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //我的工作 事件筛选列表
            zjpersoneventserachPersonEventListdo:function (params, callback, errorback,cache) {
                var api = "personevent/serachPersonEventList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //我的工作 关键业务指标修改
            zjindexassignmentupdateSavedo:function (params, callback, errorback,cache) {
                var api = "indexassignment/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //我的工作 关键业务指标新增初始化
            zjindexassignmentinitAdddo:function (params, callback, errorback,cache) {
                var api = "indexassignment/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },


            /*以下为财务结算-----start*/
            settlementlist:function (params, callback, errorback,cache) {
                var api = "financialsettlement/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //关联补偿内容列表
            contactcommission:function (params, callback, errorback,cache) {
                var api = "financialsettlement/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付节点父级
            paynodeparent:function (params, callback, errorback,cache) {
                var api = "sign/parent.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //支付节点子级
            paynodeson:function (params, callback, errorback,cache) {
                var api = "sign/stage.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //财务结算新增
            addnewcommission:function (params, callback, errorback,cache) {
                var api = "financialsettlement/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //财务结算修改初始化
            updatenewcommission:function (params, callback, errorback,cache) {
                var api = "financialsettlement/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //财务结算修改保存
            updatesavenewcommission:function (params, callback, errorback,cache) {
                var api = "financialsettlement/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //财务结算删除
            deleteFinanceSet:function (params, callback, errorback,cache) {
                var api = "financialsettlement/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*以上为财务结算-----end*/
            /*知识库start*/
            //开发理念列表
            thoughtlist:function (params, callback, errorback,cache) {
                var api = "pagemanage/queryLiNian.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //战略目标列表
            goallist:function (params, callback, errorback,cache) {
                var api = "pagemanage/queryStrategicTarget.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //战略定位列表
            positionlist:function (params, callback, errorback,cache) {
                var api = "pagemanage/queryStrategicPosition.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //客户热线列表
            tellist:function (params, callback, errorback,cache) {
                var api = "pagemanage/queryServiceHotline.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //查看
            watchdata:function (params, callback, errorback,cache) {
                var api = "pagemanage/findPageManageById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加开发理念，目标，定位，客户热线
            addthoughtdata:function (params, callback, errorback,cache) {
                var api = "pagemanage/addSavePageManage.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加客户热线
            addCustomerServiceHotline:function (params, callback, errorback,cache) {
                var api = "pagemanage/addCustomerServiceHotline.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编辑保存
            editsavedata:function (params, callback, errorback,cache) {
                var api = "pagemanage/updateSavePageManage.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除
            deletelist:function (params, callback, errorback,cache) {
                var api = "pagemanage/deletePageManageById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //政策法规类型列表
            lawtypelist:function (params, callback, errorback,cache) {
                var api = "homepolicytype/queryHomePolicyTypeList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加政策法规类型
            addtypesave:function (params, callback, errorback,cache) {
                var api = "homepolicytype/addSaveHomePolicyType.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //修改保存政策法规类型
            updatetypesave:function (params, callback, errorback,cache) {
                var api = "homepolicytype/updateHomePolicyType.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除父级政策法规
            deletetypedata:function (params, callback, errorback,cache) {
                var api = "homepolicytype/deleteHomePolicyTypeById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //政策法规子集列表
            sonlowlist:function (params, callback, errorback,cache) {
                var api = "homepolicylaws/queryHomePolicyLawsList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //新增政策法规子集
            addlawsavedata:function (params, callback, errorback,cache) {
                var api = "homepolicylaws/addSaveHomePolicyLaws.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //修改保存子集
            updatelawsavedata:function (params, callback, errorback,cache) {
                var api = "homepolicylaws/updateSaveHomePolicyLaws.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除子集政策法规
            deletelawdata:function (params, callback, errorback,cache) {
                var api = "homepolicylaws/deletePolicyLawsById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //新闻列表
            newslistdata:function (params, callback, errorback,cache) {
                var api = "news/queryNewsList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //增加新闻
            addnewsdata:function (params, callback, errorback,cache) {
                var api = "news/addSaveNews.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编辑保存新闻
            addeditdata:function (params, callback, errorback,cache) {
                var api = "news/updateSaveNews.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除新闻
            deletenews:function (params, callback, errorback,cache) {
                var api = "news/deleteNewsById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目信息管理列表
            projectListData:function (params, callback, errorback,cache) {
                var api = "projectmanage/queryProjectManageList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目信息删除
            deleteproject:function (params, callback, errorback,cache) {
                var api = "projectmanage/deleteProjectManageById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目信息-关联项目模糊搜索
            searchcontactname:function (params, callback, errorback,cache) {
                var api = "projectmanage/queryProjectInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目管理信息-添加新的项目
            addprojectdata:function (params, callback, errorback,cache) {
                var api = "projectmanage/addSaveProjectManage.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目管理信息-编辑保存
            editprojectdata:function (params, callback, errorback,cache) {
                var api = "projectmanage/updateSaveProjectManage.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*知识库end*/
            /*基础数据-签约阶段start*/
            //基础数据-签约阶段列表
            datasignList:function (params, callback, errorback,cache) {
                var api = "sign/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //基础数据-子阶段添加
            signsave:function (params, callback, errorback,cache) {
                var api = "sign/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //基础数据-阶段修改初始化
            signeditinit:function (params, callback, errorback,cache) {
                var api = "sign/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //基础数据-子阶段修改保存
            signeditsave:function (params, callback, errorback,cache) {
                var api = "sign/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //基础数据-父阶段修改保存
            signEditParentSave:function (params, callback, errorback,cache) {
                var api = "sign/updateParentSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //基础数据-删除
            signdelete:function (params, callback, errorback,cache) {
                var api = "sign/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-签约阶段end*/
            /*基础数据-审核流程设置start*/
            //审核流程列表
            processdatalist:function (params, callback, errorback,cache) {
                var api = "processnodetype/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //审核流程初始化
            processdatainit:function (params, callback, errorback,cache) {
                var api = "processnode/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //模糊搜索
            searchlist:function (params, callback, errorback,cache) {
                var api = "siuser/transferList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //修改保存
            updatasavedata:function (params, callback, errorback,cache) {
                var api = "processnode/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //新增保存
            addNewProcess:function (params, callback, errorback,cache) {
                var api = "processnode/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除节点
            deleteProcessData:function (params, callback, errorback,cache) {
                var api = "processnode/delete.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-审核流程设置end*/
            /*基础数据-组织机构设置start*/
            //组织结构列表
            organizationlist:function (params, callback, errorback,cache) {
                var api = "sidept/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //人员列表
            peoplelist:function (params, callback, errorback,cache) {
                var api = "sidept/queryUserList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加用户评价
            addAppraiseData:function (params, callback, errorback,cache) {
                var api = "userappraise/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //查看用户评价
            watchAppraiseData:function (params, callback, errorback,cache) {
                var api = "userappraise/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //物业授权列表
            accreditlist:function (params, callback, errorback,cache) {
                var api = "room/propwetyRight.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //角色授权
            roleaccreditlist:function (params, callback, errorback,cache) {
                var api = "role/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //新建角色保存
            addsaverole:function (params, callback, errorback,cache) {
                var api = "role/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编辑角色授权初始化
            editroleinit:function (params, callback, errorback,cache) {
                var api = "role/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编辑保存
            updatesaverole:function (params, callback, errorback,cache) {
                var api = "role/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除角色
            deleterolelist:function (params, callback, errorback,cache) {
                var api = "role/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //4、转移、共享人员查询列表
            initrolelist:function (params, callback, errorback,cache) {
                var api = "siuser/transferList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //分配角色保存
            addroleuser:function (params, callback, errorback,cache) {
                var api = "roleuser/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //分配角色列表
            initroleuserlist:function (params, callback, errorback,cache) {
                var api = "roleuser/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除分配角色
            deleteRoleUserList:function (params, callback, errorback,cache) {
                var api = "roleuser/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //物业授权模糊搜索
            searchprojectName:function (params, callback, errorback,cache) {
                var api = "project/projectVague.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //已授权物业人员列表
            ppListData:function (params, callback, errorback,cache) {
                var api = "propertyauthority/queryAlreadyAuthorize.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //已授权物业人员列表-查看名下物业
            propertyListData:function (params, callback, errorback,cache) {
                var api = "propertyauthority/queryRoomAuthorization.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //保存物业授权人员列表
            addAllsel:function (params, callback, errorback,cache) {
                var api = "propertyauthority/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //2018-3-1 物业授权多选保存
            addSingelsel:function (params, callback, errorback,cache) {
                var api = "propertyauthority/collectiveAddSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //角色授权
            roleaccreditlist:function (params, callback, errorback,cache) {
                var api = "role/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //新建角色保存
            addsaverole:function (params, callback, errorback,cache) {
                var api = "role/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编辑角色授权初始化
            editroleinit:function (params, callback, errorback,cache) {
                var api = "role/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编辑保存
            updatesaverole:function (params, callback, errorback,cache) {
                var api = "role/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除角色
            deleterolelist:function (params, callback, errorback,cache) {
                var api = "role/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //分配角色初始化
            initrolelist:function (params, callback, errorback,cache) {
                var api = "siuser/transferList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //分配角色保存
            addroleuser:function (params, callback, errorback,cache) {
                var api = "roleuser/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //分配角色列表
            initroleuserlist:function (params, callback, errorback,cache) {
                var api = "roleuser/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除分配角色
            deleteRoleUserList:function (params, callback, errorback,cache) {
                var api = "roleuser/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-组织机构设置end*/

            /*基础数据-补偿项目start*/
            //补偿项目列表
            compensateprojectlist:function (params, callback, errorback,cache) {
                var api = "compensateproject/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //补偿项目新增
            addprojectsave:function (params, callback, errorback,cache) {
                var api = "compensateproject/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //补偿项目修改保存
            updateprojectsave:function (params, callback, errorback,cache) {
                var api = "compensateproject/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //补偿项目删除
            deleteprojectdata:function (params, callback, errorback,cache) {
                var api = "compensateproject/deletedById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-补偿项目end*/
            /*基础数据-补偿类型start*/
            // 补偿类型父级列表
            parentnodelist:function (params, callback, errorback,cache) {
                var api = "compensatetype/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 补偿类型子级列表
            sonnodelist:function (params, callback, errorback,cache) {
                var api = "compensatetype/querySublevel.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //补偿类型新增保存
            addpjtypesave:function (params, callback, errorback,cache) {
                var api = "compensatetype/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //修改初始化
            editnodelist:function (params, callback, errorback,cache) {
                var api = "compensatetype/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //修改保存
            updatepjtypesave:function (params, callback, errorback,cache) {
                var api = "compensatetype/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除
            deletedata:function (params, callback, errorback,cache) {
                var api = "compensatetype/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-补偿类型end*/
            /*基础数据-单一基础数据start*/
            //单一数据列表
            singlelist:function (params, callback, errorback,cache) {
                var api = "settings/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加单一数据
            addsingledata:function (params, callback, errorback,cache) {
                var api = "settings/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //下拉框初始化
            settinginit:function (params, callback, errorback,cache) {
                var api = "settings/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //修改保存
            updatesavedata:function (params, callback, errorback,cache) {
                var api = "settings/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //删除
            deletesingledata:function (params, callback, errorback,cache) {
                var api = "settings/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-单一基础数据end*/
            /*基础数据-合同模板start*/
            //合同列表
            compactdatalist:function (params, callback, errorback,cache) {
                var api = "pactinfo/watchPactData.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            compactdatalists:function (params, callback, errorback,cache) {
                var api = "pacttemplete/listTmplete.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            addcompactdata:function (params, callback, errorback,cache) {
                var api = "pacttemplete/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            editcompactdata:function (params, callback, errorback,cache) {
                var api = "pacttemplete/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            updatecompactdata:function (params, callback, errorback,cache) {
                var api = "pacttemplete/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            deletecompactdata:function (params, callback, errorback,cache) {
                var api = "pacttemplete/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-还建类型start*/
            rebuildInitList:function (params, callback, errorback,cache) {
                var api = "rebuildtype/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            rebuidTypeinit:function (params, callback, errorback,cache) {
                var api = "rebuildtype/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            addRebuildData:function (params, callback, errorback,cache) {
                var api = "rebuildtype/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            updateRebuildData:function (params, callback, errorback,cache) {
                var api = "rebuildtype/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            deleteRebuildData:function (params, callback, errorback,cache) {
                var api = "rebuildtype/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*基础数据-组织机构设置end*/
            //发起事件查看
            zjpersoneventfindPersonEventByIddo:function (params, callback, errorback,cache) {
                var api = "personevent/findPersonEventById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //发起事件编缉
            zjpersoneventupdateSavePersonEventdo:function (params, callback, errorback,cache) {
                var api = "personevent/updateSavePersonEvent.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //发起事件删除
            zjpersoneventdeletePersonEventByIddo:function (params, callback, errorback,cache) {
                var api = "personevent/deletePersonEventById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //今日工作提醒
            zjtaskqueryTaskInfodo:function (params, callback, errorback,cache) {
                var api = "task/queryTaskInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目流特别是一提醒
            zjprojectprocessqueryFlowPathdo:function (params, callback, errorback,cache) {
                var api = "projectprocess/queryFlowPath.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //未登录
            login:function (params, callback, errorback,cache) {
                var api = "siuser/interceptorLogin.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //6、事件下载
            zjpersoneventaddSavePersonEventdo:function (params, callback, errorback,cache) {
                var api = "personevent/addSavePersonEvent.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //6、任务列表
            zjtaskqueryTaskEventListdo:function (params, callback, errorback,cache) {
                var api = "task/queryTaskEventList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务列表初始化
            zjtaskinitOrderSignNodedo:function (params, callback, errorback,cache) {
                var api = "task/initOrderSignNode.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务查看
            zjtaskqueryEventDescdo:function (params, callback, errorback,cache) {
                var api = "task/queryEventDesc.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务删除
            zjtaskupdateTaskStatusdo:function (params, callback, errorback,cache) {
                var api = "task/updateTaskStatus.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务 被指派人接受或退回任务
            zjtasktaskIsAcceptdo:function (params, callback, errorback,cache) {
                var api = "task/taskIsAccept.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //重新指派发布接口
            zjtaskupdateTaskdo:function (params, callback, errorback,cache) {
            var api = "task/updateTask.do";
            jqReq('post',api, params, true, callback, errorback)
            },
            //任务发起 模糊查询物业名称
            zjtaskqueryRoomNamedo:function (params, callback, errorback,cache) {
                var api = "task/queryRoomName.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务发起 模糊查询物业名称改的
            zjtaskqueryRoomNamedo2:function (params, callback, errorback,cache) {
                var api = "task/queryRoomNames.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //发布任务保存
            zjtaskaddTask:function (params, callback, errorback,cache) {
                var api = "task/addTask.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //发起任务 子下接框
            zjtaskqueryChildOrderdo:function (params, callback, errorback,cache) {
                var api = "task/queryChildOrder.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务发起 模糊查询物业名称指派用户信息
            zjtaskqueryUserNamedo:function (params, callback, errorback,cache) {
                var api = "task/queryUserName.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //任务发起查询占用时间
            zjtaskqueryUserInfoByUserIddo:function (params, callback, errorback,cache) {
                var api = "task/queryUserInfoByUserId.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-开发理念展示
            lgcMainInfoConcept:function (params, callback, errorback,cache) {
                var api = "pagemanage/showDevelopmentConceptList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-战略目标展示
            lgcMainInfoTarget:function (params, callback, errorback,cache) {
                var api = "pagemanage/showStrategicTargetList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-战略定位展示
            lgcMainInfoPositioning:function (params, callback, errorback,cache) {
                var api = "pagemanage/showStrategicPositioning.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-客服热线
            lgcMainInfoHotline:function (params, callback, errorback,cache) {
                var api = "pagemanage/showCustomerServiceHotline.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-代表项目
            lgcMainInfoManages:function (params, callback, errorback,cache) {
                var api = "projectmanage/queryProjectManageList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-政策法规类型
            lgcMainInfoPolicyTypes:function (params, callback, errorback,cache) {
                var api = "homepolicytype/showHomePolicyTypes.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-政策法规
            lgcMainInfoPolicyLaws:function (params, callback, errorback,cache) {
                var api = "homepolicylaws/showHomePolicyLaws.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-新闻动态
            lgcMainInfoNews:function (params, callback, errorback,cache) {
                var api = "news/queryNewsList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //首页-新闻详情
            newsDetailsInfo:function (params, callback, errorback,cache) {
                var api = "news/findNewsById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //还建信息查询
            lgcMainInfobuiltinfo:function (params, callback, errorback,cache) {
                var api = "builtinfo/queryBuiltInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //还建信息添加
            lgcMainInfoAddBuiltInfo:function (params, callback, errorback,cache) {
                var api = "builtinfo/addBuiltInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //截留款项目初始化
            lgcMainInfoInitFinancialInfo:function (params, callback, errorback,cache) {
                var api = "builtinfo/initFinancialInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //截留款项目当前金额
            lgcMainInfoInitAmount:function (params, callback, errorback,cache) {
                var api = "builtinfo/queryPaymentAmount.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加关注
            lgcMainInfosharedtransferconSave:function (params, callback, errorback,cache) {
                var api = "sharedtransfercon/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //共享成功
            zjsharedtransferaddShareddo:function (params, callback, errorback,cache) {
                var api = "sharedtransfer/addShared.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //审批结果审批结果
            zjapprovalformqueryApplyRecorddo:function (params, callback, errorback,cache) {
                var api = "approvalform/queryApplyRecord.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //审核不通过
            zjapprovalformnotThroghdo:function (params, callback, errorback,cache) {
                var api = "approvalform/notThrogh.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //审核导出
            zjapprovalformexportdo:function (params, callback, errorback,cache) {
                var api = "approvalform/export.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //财务支付 佣金方案审批列表
            zjapprovalformfincialColsListdo:function (params, callback, errorback,cache) {
                var api = "approvalform/fincialColsList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3、支付方案审批列表
            zjapprovalformfincialApprovalListdo:function (params, callback, errorback,cache) {
                var api = "approvalform/fincialApprovalList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3、支付对应的节点信息
            zjapprovalformqueryApprovalNodedo:function (params, callback, errorback,cache) {
                var api = "approvalform/queryApprovalNode.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3、佣金方案详情列表
            zjapprovalformcommmisionApprovalListdo:function (params, callback, errorback,cache) {
                var api = "approvalform/commmisionApprovalList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3审核规则列表数据
            zjapprovalformfindRulesListdo:function (params, callback, errorback,cache) {
                var api = "approvalform/findRulesList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //4审核删除项目列表数据
            zjapprovalformfindProjectdo:function (params, callback, errorback,cache) {
                var api = "approvalform/findProject.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //3审核规则列表数据
            zjapprovalformthroghdo:function (params, callback, errorback,cache) {
                var api = "approvalform/throgh.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //物业管理---申请制作合同
            zjpactinfoaddSavedo:function (params, callback, errorback,cache) {
                var api = "pactinfo/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //添加完成时间
            lgcSetDataUpdateAccomplishTime:function (params, callback, errorback,cache) {
                var api = "propertystage/updateAccomplishTime.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            //4.	业权人修改初始化
            zjownershipinitUpdatedo:function (params, callback, errorback,cache) {
                var api = "ownership/initUpdate.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //5.	业权人修改保存
            zjownershipupdateSavedo:function (params, callback, errorback,cache) {
                var api = "ownership/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 1.	关联其他业权收款信息新增初始化
            zjmakerecieveinitAdddo:function (params, callback, errorback,cache) {
                var api = "makerecieve/initAdd.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //申请审批合同模板
            lgcPactmodeAddSave:function (params, callback, errorback,cache) {
                var api = "pactmode/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //下载审批合同模板
            zjcpactinfopactDownloadingdo:function (params, callback, errorback,cache) {
                var api = "pactinfo/pactDownloading.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //编缉收款信息
            zjmakerecievequeryRecieveInfodo:function (params, callback, errorback,cache) {
                var api = "makerecieve/queryRecieveInfo.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //取消关注
            zjsharedtransfercondestroydo:function (params, callback, errorback,cache) {
                var api = "sharedtransfercon/destroy.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //关注初始化、、
            zjsharedtransferconqueryFollowdo:function (params, callback, errorback,cache) {
                var api = "sharedtransfercon/queryFollow.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //待审批支付列表2
            zjapprovalforminitFincialApprovaldo:function (params, callback, errorback,cache) {
            var api = "approvalform/fincialApprovalList.do";
            jqReq('post',api, params, true, callback, errorback)
            },
            //佣金支付通过
            zjapprovalformfincialThroghdo:function (params, callback, errorback,cache) {
                var api = "approvalform/fincialThrogh.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //佣金支付不通过
            zjapprovalformfincialNotThroghdo:function (params, callback, errorback,cache) {
                var api = "approvalform/fincialNotThrogh.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //跟进问题类型
            zjsettingsquerySettingsTypedo:function (params, callback, errorback,cache) {
                var api = "settings/querySettingsType.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 7、项目共享修改初始化
            zjsharedtransferinitUpdateShareddo:function (params, callback, errorback,cache) {
                var api = "sharedtransfer/initUpdateShared.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 7、项目共享修改成功
            zjsharedtransferaddTransferdo:function (params, callback, errorback,cache) {
                var api = "sharedtransfer/addTransfer.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 7、申请合同版本
            zjpactinfoapplyPactMode:function (params, callback, errorback,cache) {
                var api = "pactinfo/applyPactMode.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 7、申请制作合同版本
            zjpactmodeaddSavedo:function (params, callback, errorback,cache) {
                var api = "pactmode/addSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 7、审批模板
            zjpacttempletelistTmpletedo:function (params, callback, errorback,cache) {
                var api = "pacttemplete/listTmplete.do";
                jqReq('post',api, params, true, callback, errorback)
            },

            // 7、合同key val 获取
            zjpactmodeeditpactListdo:function (params, callback, errorback,cache) {
                var api = "pactmode/editpactList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*数据统计 2018-1-11*/
            signDataList:function (params, callback, errorback,cache) {
                var api = "count/signCount.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            followDataList:function (params, callback, errorback,cache) {
                var api = "count/queryUserCountList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            noSignDataList:function (params, callback, errorback,cache) {
                var api = "count/queryFollowList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            financeDataList:function (params, callback, errorback,cache) {
                var api = "count/queryFincialDataList.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            
            otherHousePropertyDataList:function (params, callback, errorback,cache) {
                var api = "count/otherHousePropertyCount.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            otherSquareMeterDataList:function (params, callback, errorback,cache) {
                var api = "count/otherSquareMeter.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            /*数据统计 end*/
            zjrelatedqueryRelevancePropertydo:function (params, callback, errorback,cache) {
                var api = "related/queryRelevanceProperty.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 新物业详情
            zjroomqueryPropertyDetaileddo:function (params, callback, errorback,cache) {
                var api = "room/queryPropertyDetailed.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 物业记录列表
            zjoperationrecordqueryPropertyLogdo:function (params, callback, errorback,cache) {
                var api = "operationrecord/queryPropertyLog.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 物业记录修改详情
            zjoperationrecordfindByPropertyLogdo:function (params, callback, errorback,cache) {
                var api = "operationrecord/findByPropertyLog.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //补偿方案删除提交审批
            zjcompensationplandetailsdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //项目搜索输入
            zjprojectprojectVaguedo:function (params, callback, errorback,cache) {
                var api = "project/projectVague.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 物业信息变动
            zjoperationrecordqueryPropertyTakedo:function (params, callback, errorback,cache) {
                var api = "operationrecord/queryPropertyTake.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 9、权限初始化
            zjrolerightInitialisedo:function (params, callback, errorback,cache) {
                var api = "role/rightInitialise.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 10、财务统计条件
            zjcountfindRoomTypesdo:function (params, callback, errorback,cache) {
                var api = "count/findRoomTypes.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 8、测绘统计之测绘进度
            zjcountsurveyPropertyCountdo:function (params, callback, errorback,cache) {
                var api = "count/surveyPropertyCount.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 9.测绘统计之临时建筑物
            zjcountquerySurveryTemporaryBuildingdo:function (params, callback, errorback,cache) {
                var api = "count/querySurveryTemporaryBuilding.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //物业授权批量删除
            zjpropertyauthoritydeleteEmpowerdo:function (params, callback, errorback,cache) {
                var api = "propertyauthority/deleteEmpower.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 品牌介绍查询
            zjpagemanagefindPageManageByIddo:function (params, callback, errorback,cache) {
                var api = "pagemanage/findPageManageById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 3、栏目首页接口
            zjcolumnqueryColumndo:function (params, callback, errorback,cache) {
                var api = "column/queryColumn.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 4栏目管理列表
            zjcolumnlistdo:function (params, callback, errorback,cache) {
                var api = "column/list.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 5.栏目管理修改
            zjcolumnupdateSavedo:function (params, callback, errorback,cache) {
                var api = "column/updateSave.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 阶段统计
            zjcountqueryCountDatado:function (params, callback, errorback,cache) {
                var api = "count/queryCountData.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            //自定义报表
            zjcountquerySearchCriteriado:function (params, callback, errorback,cache) {
                var api = "count/querySearchCriteria.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 11.自定义报
            zjcreateReportFormsdo:function (params, callback, errorback,cache) {
                var api = "count/createReportForms.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 合同预览
            zjpactmodepreviewPathdo:function (params, callback, errorback,cache) {
                var api = "pactmode/previewPath.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 10、物业授权删除
            propertyauthoritydeleteById:function (params, callback, errorback,cache) {
                var api = "propertyauthority/deleteById.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 物业列表搜索条件
            querySchemaSublevel:function (params, callback, errorback,cache) {
                var api = "schema/querySchemaSublevel.do";
                jqReq('post',api, params, true, callback, errorback)
            },
            // 删除合同
            pactinfodeleteByPath:function (params, callback, errorback,cache) {
                var api = "pactinfo/deleteByPath.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            zjpropertystageupdateTimedo:function (params, callback, errorback,cache) {
                var api = "propertystage/updateTime.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            zjpactinfoexamineDownloadPactdo:function (params, callback, errorback,cache) {
                var api = "pactinfo/examineDownloadPact.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            zjcompensationplandetailsexportdo:function (params, callback, errorback,cache) {
                var api = "compensationplandetails/export.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            
            // 3、群公告修改初始化
            zjafficheinitUpdatedo:function (params, callback, errorback,cache) {
                var api = "affiche/initUpdate.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 4、群公告修改
            zjafficheupdateSavedo:function (params, callback, errorback,cache) {
                var api = "affiche/updateSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 4、群公告删除
            zjaffichedeleteByIddo:function (params, callback, errorback,cache) {
                var api = "affiche/deleteById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2、群公告添加、
            zjafficheaddSavedo:function (params, callback, errorback,cache) {
                var api = "affiche/addSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2、1、群公告列表
            zjaffichelistdo:function (params, callback, errorback,cache) {
                var api = "affiche/list.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 1、补充协议列表
            zjpactprotocoltemplatelistdo:function (params, callback, errorback,cache) {
                var api = "pactprotocoltemplate/list.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2、补充协议新增
            zjpactprotocoltemplateaddSavedo:function (params, callback, errorback,cache) {
                var api = "pactprotocoltemplate/addSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2、3、补充协议修改初始化
            zjpactprotocoltemplateinitUpdatedo:function (params, callback, errorback,cache) {
                var api = "pactprotocoltemplate/initUpdate.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 4、补充协议修改
            zjppactprotocoltemplateupdateSavedo:function (params, callback, errorback,cache) {
                var api = "pactprotocoltemplate/updateSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 5、补充协议删除
            zjpactprotocoltemplatedeleteByIddo:function (params, callback, errorback,cache) {
                var api = "pactprotocoltemplate/deleteById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 1、测绘数据统计柱状图，柱状图
            zjcountquerySurveryAreado:function (params, callback, errorback,cache) {
                var api = "count/querySurveryArea.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2、签约数据统计柱状图，柱状图
            zjcountquerySignCountdo:function (params, callback, errorback,cache) {
                var api = "count/querySignCount.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 3、物业移交数据统计柱状图，柱状图
            zjcountqueryTransferCountdo:function (params, callback, errorback,cache) {
                var api = "count/queryTransferCount.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 31、制作合同版本----合同补充协议
            zjpactprotocoltemplatequeryAgreementdo:function (params, callback, errorback,cache) {
                var api = "pactprotocoltemplate/queryAgreement.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 2、合同模板审批查看补充协议内容
            zjpactattachmentfindByIddo:function (params, callback, errorback,cache) {
                var api = "pactattachment/findById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 群公告详情
            zjpactprotocoltemplatefindByIddo:function (params, callback, errorback,cache) {
                var api = "affiche/findById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
             // 1、银行信息查询
             zjbanklistdo:function (params, callback, errorback,cache) {
                var api = "bank/list.do"
                jqReq('post',api, params, true, callback, errorback)
            },
             // 1、银行信息新增
             zjbankaddSavedo:function (params, callback, errorback,cache) {
                var api = "bank/addSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
             // 1、银行信息编辑
             zjbankupdateSavedo:function (params, callback, errorback,cache) {
                var api = "bank/updateSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 1、银行信息删除
            zjbankdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "bank/deleteById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 完成事件
            zpersoneventupdateStatusdo:function (params, callback, errorback,cache) {
                var api = "personevent/updateStatus.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //1、合同字段列表
            zjcontentlistdo:function (params, callback, errorback,cache) {
                var api = "content/list.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //1、2、合同字段新增
            zjcontentaddSavedo:function (params, callback, errorback,cache) {
                var api = "content/addSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //1、2、3、合同字段修改
            zjcontentupdateSavedo:function (params, callback, errorback,cache) {
                var api = "content/updateSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //1、2、3、4、合同字段删除
            zjcontentdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "content/deleteById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //业权人删除
            zjmakerecievedeleteById:function (params, callback, errorback,cache) {
                var api = "makerecieve/deleteById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //1、合同内容修改
            zjpactmodeupdateSavedo:function (params, callback, errorback,cache) {
                var api = "pactmode/updateSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            //2、补充协议内容修改
            zjpactattachmentupdateSavedo:function (params, callback, errorback,cache) {
                var api = "pactattachment/updateSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 4、补充协议删除pactattachment/deleteById.do
            zjpactattachmentdeleteByIddo:function (params, callback, errorback,cache) {
                var api = "pactattachment/deleteById.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 4、3、补充协议添加
            zjpactattachmentaddSavedo:function (params, callback, errorback,cache) {
                var api = "pactattachment/addSave.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            // 5、重新提交审核	
            zjapprovalformagainSubmitApprovedo:function (params, callback, errorback,cache) {
                var api = "approvalform/againSubmitApprove.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            zjpactfieldscontentlistdo:function (params, callback, errorback,cache) {
                var api = "pactfieldscontent/list.do"
                jqReq('post',api, params, true, callback, errorback)
            },
            zjremarksaddSavedo:function (params, callback, errorback,cache) {
                var api = "remarks/addSave.do"
                jqReq('post',api, params, true, callback, errorback)
            }

            
    }


    }

    return server;
}]);