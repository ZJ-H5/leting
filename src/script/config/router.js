//'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $urlRouterProvider,$httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'view/main.html',
        controller: 'mainCtrl'

    })
    
    //首页-新闻动态
        .state('news', {
            url: '/news',
            templateUrl: 'view/template/lgc/news.html',
            controller: 'newsCtrl'
        })
        //首页-代表项目
        .state('showProject', {
            url: '/showProject',
            templateUrl: 'view/template/lgc/showProject.html',
            controller: 'showProjectCtrl'
        })
        //首页-代表项目详情
        .state('showProjectDetail', {
            url: '/showProjectDetail?id',
            templateUrl: 'view/template/lgc/showProjectDetail.html',
            controller: 'showProjectDetailCtrl'
        })
        //首页-政策法规
        .state('laws', {
            url: '/laws',
            templateUrl: 'view/template/itzhang/laws.html',
            controller: 'lawsCtrl'
        })
        //首页-新闻动态详情
        .state('newsDetail', {
            url: '/newsDetail?newsId',
            templateUrl: 'view/template/zjm/newsDetail.html',
            controller: 'newsDetailCtrl'
        })
        //首页-品牌荣誉详情
        .state('Brandawards', {
            url: '/Brandawards/:BrandawardsId',
            templateUrl: 'view/template/itzhang/Brandawards.html',
            controller: 'BrandawardsCtrl'
        })
        //新建项目
        .state('newFiles', {
            url: '/newFiles',
            templateUrl: 'view/template/ly/newFiles.html',
            controller: 'newFilesCtrl'
        })
        //物业信息zjm （问题）
        // .state('propertyInfo', {
        //     url: '/propertyInfo',
        //     templateUrl: 'view/template/zjm/propertyInfo.html',
        //     controller: 'propertyInfoCtrl'
        // })

        //佣金发放规则
        .state('itemInformation', {

            url: '/itemInformation?projectid',
            templateUrl: 'view/template/itzhang/itemInformation.html',
            controller: 'itemInformationCtrl'
        })
        //项目详情
        .state('itemDetails', {
            url: '/itemDetails?projectid',
            templateUrl: 'view/template/itzhang/itemDetails.html',
            controller: 'itemDetailsCtrl'
        })
        //物业信息
        .state('propertyInformation', {
            url: '/propertyInformation?projectid',
            templateUrl: 'view/template/itzhang/propertyInformation.html',
            controller: 'propertyInformationCtrl'
        })
        //项目列表初始化页面
        .state('projectmanagement', {
            url: '/projectmanagement',
            templateUrl: 'view/template/lh/projectmanagement.html',
            controller: 'projectmanagementCtrl'

        })
        //项目修改初始化页面
        .state('projectmanagementupdate', {
            url: '/projectmanagementupdate',
            templateUrl: 'view/template/lh/projectmanagement.html',
            controller: 'projectmanagementCtrl'

        })
        //佣金发放规则
        .state('commissionrules', {
            url: '/commissionrules',
            templateUrl: 'view/template/lh/commissionrules.html',
            controller: 'commissionrulesCtrl'
        })
        /*拆迁补偿规则_1   ct*/
        .state('demolitionCompensation', {
            url: '/demolitionCompensation',
            templateUrl: 'view/template/ct/demolitionCompensation.html',
            controller: 'demolitionCompensationCtrl'
        })

        /*附件（项目详情）   ct*/
        .state('annex', {
            url: '/annex?projectid',
            templateUrl: 'view/template/ct/annex.html',
            controller: 'annexCtrl'
        })

        /*拆迁补偿规则(新建项目)   ct*/
        .state('compensationRules', {
            url: '/compensationRules',
            templateUrl: 'view/template/ct/compensationRules.html',
            controller: 'compensationRulesCtrl'
        })
        /*拆迁补偿规则(项目详情)   ct*/
        .state('projectcompensationRules', {
            url: '/projectcompensationRules?projectid',
            templateUrl: 'view/template/ct/projectcompensationRules.html',
            controller: 'projectcompensationRulesCtrl'
        })

        /*佣金发放规则(项目详情)   ct
         .state('commissionRelease', {
         url: '/commissionRelease',
         templateUrl: 'view/template/ct/commissionRelease.html',
         controller: 'commissionReleaseCtrl'
         })
         */
        /*佣金发放规则(项目详情)   ct*/
        .state('projectcommissionrelease', {
            url: '/projectcommissionrelease?projectid',
            templateUrl: 'view/template/ct/projectcommissionrelease.html',
            controller: 'projectcommissionreleaseCtrl'
        })

        /*佣金规则(新建项目)   ct*/
        .state('commissionRules', {
            url: '/commissionRules',
            templateUrl: 'view/template/ct/commissionRules.html',
            controller: 'commissionRulesCtrl'
        })
        //新增物业（区栋标准）
        .state('NewHousingStandards', {
            url: '/NewHousingStandards?packid&id',
            templateUrl: 'view/template/itzhang/NewHousingStandards.html',
            controller: 'NewHousingStandardsCtrl'
        })
        //新增物业
        .state('NewBuildingStandard', {
            url: '/NewBuildingStandard/:id/:schemaId/:projectid',
            templateUrl: 'view/template/itzhang/NewBuildingStandard.html',
            controller: 'NewBuildingStandardCtrl'
        })
        //物业信息初始化
        .state('propertyInit', {
            url: '/propertyInit',
            templateUrl: 'view/template/zjm/propertyInit.html',
            controller: 'propertyInitCtrl'
        })
        // 物业信息
        .state('propertyInfo', {
            url: '/propertyInfo?projectid',
            templateUrl: 'view/template/zjm/propertyInfo.html',
            controller: 'propertyInfoCtrl'
        })
        // 物业管理
        .state('propertyManagement',{
            url:'/propertyManagement?projectid',
            templateUrl:'view/template/zjm/propertyManagement.html',
            controller:'propertyManagementCtrl'
        })
        //物业详情
        .state('propertyDetail', {
            url: '/propertyDetail?roomId&projectid',
            templateUrl: 'view/template/zjm/propertyDetail.html',
            controller: 'propertyDetailCtrl'
        })
        //层级结构
        .state('dataHierarchy',{
            url:'/dataHierarchy?projectid',
            templateUrl:'view/template/zjm/dataHierarchy.html',
            controller:'dataHierarchyCtrl'
        })
        //测绘信息
        .state('surveyingInformation',{
            url:'/surveyingInformation?roomId&projectid',
            templateUrl:'view/template/zjm/surveyingInformation.html',
            controller:'surveyingInformationCtrl'
        })
        //查伪信息 物业
        .state('checkingFalse',{
            url:'/checkingFalse?roomId&projectid',
            templateUrl:'view/template/zjm/checkingFalse.html',
            controller:'checkingFalseCtrl'
        })
        //补偿方案
        .state('compensateProperty', {
            url: '/compensateProperty?roomId&projectid',
            templateUrl: 'view/template/zjm/compensateProperty.html',
            controller: 'compensatePropertyCtrl'
        })
        //项目流程设置
        .state('projectProcess', {
            url: '/projectProcess',
            templateUrl: 'view/template/ly/projectProcess.html',
            controller: 'projectProcessCtrl'
        })

        // <!--失联物业（物业管理）-->
        .state('BasicInformationPropertyManagement', {
            url: '/BasicInformationPropertyManagement?roomId&projectid',
            templateUrl: 'view/template/itzhang/BasicInformationPropertyManagement.html',
            controller: 'BasicInformationPropertyManagementCtrl'
        })
        //2017.10.28
        // 业权人_收款方式（合同管理）
        .state('ContractManagementContractManagement', {
            url: '/ContractManagementContractManagement',
            templateUrl: 'view/template/itzhang/ContractManagementContractManagement.html',
            controller: 'ContractManagementContractManagementCtrl'
        })
        // <!--失联物业（物业管理）1-->
        .state('LostPropertyManagementPropertyManagement', {
            url: '/LostPropertyManagementPropertyManagement?roomId&projectid',
            templateUrl: 'view/template/itzhang/LostPropertyManagementPropertyManagement.html',
            controller: 'LostPropertyManagementPropertyManagementCtrl'
        })
        //<!--业权人（物业管理）1-->
        .state('PropertyManagementPropertyManagement', {
            url: '/PropertyManagementPropertyManagement?roomId&projectid',
            templateUrl: 'view/template/itzhang/PropertyManagementPropertyManagement.html',
            controller: 'PropertyManagementPropertyManagementCtrl'
        })
        //物业修改记录
        .state('amendantRecord', {
            url: '/amendantRecord?roomId&projectid',
            templateUrl: 'view/template/itzhang/amendantRecord.html',
            controller: 'amendantRecordCtrl'
        })

        //附件（物业管理）
        .state('enclosure', {
            url: '/enclosure?roomId&projectid',
            templateUrl: 'view/template/ly/enclosure.html',
            controller: 'enclosureCtrl'
        })
        //附件（物业管理列表）
        .state('totalPropertyList', {
            url: '/totalPropertyList?projectid',
            templateUrl: 'view/template/itzhang/totalPropertyList.html',
            controller: 'totalPropertyListCtrl'
        })
        // 流程进度信息
        .state('projectProcessInformation', {
            url: '/projectProcessInformation?projectid',
            templateUrl: 'view/template/ly/projectProcessInformation.html',
            controller: 'projectProcessInformationCtrl'
        })
        //（导出）//projectManagementExport
        .state('projectManagementExport', {
            url: '/projectManagementExport/:projectid',
            templateUrl: 'view/template/itzhang/projectManagementExport.html',
            controller: 'projectManagementExportCtrl'
        })
        /*以下为合同管理*/
        //支付方案
        .state('compactPay', {
            url: '/compactPay?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/compactPay.html',
            controller: 'compactPayCtrl'
        })
        //佣金方案
        .state('commissionScheme', {
            url: '/commissionScheme?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/commissionScheme.html',
            controller: 'commissionSchemeCtrl'
        })
        //业权人
        .state('compactpageholder', {
            url: '/compactpageholder?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/compactpageholder.html',
            controller: 'compactpageholderCtrl'
        })
        //合同基本信息
        .state('compactbasic', {
            url: '/compactbasic?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/compactbasic.html',
            controller: 'compactbasicCtrl'
        })
        //合同详情
        .state('compactdetail', {
            url: '/compactdetail?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            
            templateUrl: 'view/template/zjm/compactdetail.html',
            controller: 'compactdetailCtrl'
        })
        



        //关联订单
        .state('linkorder', {
            url: '/linkorder?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/linkorder.html',
            controller: 'linkorderCtrl'
        })
        //附件
        .state('compactappendix', {
            url: '/compactappendix?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/compactappendix.html',
            controller: 'compactappendixCtrl'
        })
        //查伪信息
        .state('comcheckfalse', {
            url: '/comcheckfalse?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/comcheckfalse.html',
            controller: 'comcheckfalseCtrl'
        })
        // 测绘信息
        .state('comsurveyinginfo', {
            url: '/comsurveyinginfo?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/comsurveyinginfo.html',
            controller: 'comsurveyinginfoCtrl'
        })
        //补偿方案
        .state('comcompensate', {
            url: '/comcompensate?propertyId&projectId&pacteId&approveId&number&flag&status&updateStatus',
            templateUrl: 'view/template/zjm/comcompensate.html',
            controller: 'comcompensateCtrl'
        })
        //合同管理
        .state('compactmanagement', {
            url: '/compactmanagement?projectid&pacteId',
            templateUrl: 'view/template/zjm/compactmanagement.html',
            controller: 'compactmanagementCtrl'
        })
        //修改记录
        .state('updatarecord', {
            url: '/updatarecord',
            templateUrl: 'view/template/lh/updatarecord.html',
            controller: 'updatarecordCtrl'
        })
        //项目详情-修改记录
        .state('projectupdaterecord', {
            url: '/projectupdaterecord?projectid',
            templateUrl: 'view/template/zjm/projectupdaterecord.html',
            controller: 'projectupdaterecordCtrl'
        })
        //我的工作
        .state('mywork', {
            url: '/mywork',
            templateUrl: 'view/template/zjm/mywork.html',
            controller: 'myworkCtrl'
        })
        //审批管理
        .state('examine', {
            url: '/examine?projectid',
            templateUrl: 'view/template/zjm/examine.html',
            controller: 'examineCtrl'
        })
        //
        .state('examineResult', {
            url: '/examineResult?projectid&approvalId',
            templateUrl: 'view/template/zjm/examineResult.html',
            controller: 'examineResultCtrl'
        })
        //
        .state('examineExamination', {
            url: '/examineExamination?projectid&approvalId',
            templateUrl: 'view/template/zjm/examineExamination.html',
            controller: 'examineExaminationCtrl'
        })
        //财务管理
        .state('finance', {
            url: '/finance?projectid',
            templateUrl: 'view/template/zjm/finance.html',
            controller: 'financeCtrl'
        })
        //财务管理-延迟支付赔偿
        .state('delayfinance', {
            url: '/delayfinance?projectid',
            templateUrl: 'view/template/zjm/delayfinance.html',
            controller: 'delayfinanceCtrl'
        })
        //财务管理-佣金
        .state('commissionfinance', {
            url: '/commissionfinance?projectid',
            templateUrl: 'view/template/zjm/commissionfinance.html',
            controller: 'commissionfinanceCtrl'
        })
        //财务管理-财务支付
        .state('payfinance', {
            url: '/payfinance?projectid',
            templateUrl: 'view/template/zjm/payfinance.html',
            controller: 'payfinanceCtrl'
        })
        //财务管理-支付列表
        .state('paylist', {
            url: '/paylist?projectid&type',
            templateUrl: 'view/template/zjm/paylist.html',
            controller: 'paylistCtrl'
        })
        //财务管理-查看合同
        .state('pactInfo', {
            url: '/pactInfo?pactId&flag',
            templateUrl: 'view/template/zjm/pactInfo.html',
            controller: 'pactInfoCtrl'
        })
        //物业拆除
        .state('propertydelete', {
            url: '/propertydelete?projectid',
            templateUrl: 'view/template/zjm/propertydelete.html',
            controller: 'propertydeleteCtrl'
        })
        //404页面
        .state('propertylink', {
            url: '/propertylink?projectid',
            templateUrl: 'view/template/zjm/propertylink.html',
            controller: 'propertylinkCtrl'
        })
        //物业还建
        .state('propertyrebuild', {
            url: '/propertyrebuild?projectid',
            templateUrl: 'view/template/zjm/propertyrebuild.html',
            controller: 'propertyrebuildCtrl'
        })
        //数据统计-签约
        .state('datalist', {
            url: '/datalist?projectid',
            templateUrl: 'view/template/zjm/datalist.html',
            controller: 'datalistCtrl'
        })
        //数据统计-移交
        .state('wuyeyijiao', {
            url: '/wuyeyijiao?projectid',
            templateUrl: 'view/template/itzhang/wuyeyijiao.html',
            controller: 'wuyeyijiaoCtrl'
        })
        //数据统计-财务统计
        .state('dataFinance', {
            url: '/dataFinance?projectid',
            templateUrl: 'view/template/zjm/dataFinance.html',
            controller: 'dataFinanceCtrl'
        })
        //数据统计-其他统计
        .state('dataOther', {
            url: '/dataOther?projectid',
            templateUrl: 'view/template/zjm/dataOther.html',
            controller: 'dataOtherCtrl'
        })
        //数据统计-其他统计
        .state('dataSurvey', {
            url: '/dataSurvey?projectid',
            templateUrl: 'view/template/zjm/dataSurvey.html',
            controller: 'dataSurveyCtrl'
        })
        //数据统计-自定义报表
        .state('dataFile', {
            url: '/dataFile?projectid',
            templateUrl: 'view/template/zjm/dataFile.html',
            controller: 'dataFileCtrl'
        })
        //知识库-首页
        .state('knowledge', {
            url: '/knowledge?projectid',
            templateUrl: 'view/template/zjm/knowledge.html',
            controller: 'knowledgeCtrl'
        })
        //知识库-项目管理
        .state('knowledgeProject', {
            url: '/knowledgeProject',
            templateUrl: 'view/template/zjm/knowledgeProject.html',
            controller: 'knowledgeProjectCtrl'
        })
        //知识库-政策法规
        .state('lawsregulations', {
            url: '/lawsregulations',
            templateUrl: 'view/template/zjm/lawsregulations.html',
            controller: 'lawsregulationsCtrl'
        })
        //系统设置
        .state('systemset', {
            url: '/systemset?projectid',
            templateUrl: 'view/template/zjm/systemset.html',
            controller: 'systemsetCtrl'
        })
        //测试angularjs文件上传
        .state('upload', {
            url: '/upload',
            templateUrl: 'view/template/zjm/upload.html',
            controller: 'uploadCtrl'
        })
        //延迟支付补偿
        .state('DeferredCompensation', {
            url: '/DeferredCompensation',
            templateUrl: 'view/template/itzhang/DeferredCompensation.html',
            controller: 'DeferredCompensationCtrl'
        })
        //佣金项目
        .state('CommissionProject', {
            url: '/CommissionProject',
            templateUrl: 'view/template/itzhang/CommissionProject.html',
            controller: 'CommissionProjectCtrl'
        })
        //物业拆除
        .state('PropertyDismantle', {
            url: '/PropertyDismantle?projectid',
            templateUrl: 'view/template/itzhang/PropertyDismantle.html',
            controller: 'PropertyDismantleCtrl'
        })
        //移交详情
        .state('DemolitionDetails', {
            url: '/DemolitionDetails/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/DemolitionDetails.html',
            controller: 'DemolitionDetailsCtrl'
        })
        //拆除详情
        .state('Demolitioninformation', {
            url: '/Demolitioninformation/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/Demolitioninformation.html',
            controller: 'DemolitioninformationCtrl'
        })
        //拆除测绘信息
        .state('DemolitionMapingInfromation', {
            url: '/DemolitionMapingInfromation/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/DemolitionMapingInfromation.html',
            controller: 'DemolitionMapingInfromationCtrl'
        })
        //拆除业权人
        .state('DemolitionOwner', {
            url: '/DemolitionOwner/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/DemolitionOwner.html',
            controller: 'DemolitionOwnerCtrl'
        })
        //拆除附件
        .state('DemolitionAttachment', {
            url: '/DemolitionAttachment/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/DemolitionAttachment.html',
            controller: 'DemolitionAttachmentCtrl'
        })

        /*以下为财务结算-----start*/
        .state('financialsettlement', {
            url: '/financialsettlement?projectid',
            templateUrl: 'view/template/zjm/financialsettlement.html',
            controller: 'financialsettlementCtrl'
        })
        /*以上为财务结算-----end*/
        //物业移交
        .state('handOverProperty', {
            url: '/handOverProperty?projectid',
            templateUrl: 'view/template/itzhang/handOverProperty.html',
            controller: 'handOverPropertyCtrl'
        })
        //移交详情
        .state('handOverDetails', {
            url: '/handOverDetails/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/handOverDetails.html',
            controller: 'handOverDetailsCtrl'
        })
        //移交信息
        .state('handOverInformation', {
            url: '/handOverInformation/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/handOverInformation.html',
            controller: 'handOverInformationCtrl'
        })
        //移交测绘信息
        .state('handOverMap', {
            url: '/handOverMap/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/handOverMap.html',
            controller: 'handOverMapCtrl'
        })
        //移交业权人
        .state('handOverOwner', {
            url: '/handOverOwner/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/handOverOwner.html',
            controller: 'handOverOwnerCtrl'
        })
        //移交附件
        .state('handOverAttachment', {
            url: '/handOverAttachment/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/handOverAttachment.html',
            controller: 'handOverAttachmentCtrl'
        })
        //物业还建
        .state('propertyBuilt', {
            url: '/propertyBuilt?projectid',
            templateUrl: 'view/template/itzhang/propertyBuilt.html',
            controller: 'propertyBuiltCtrl'
        })

        //还建总览
        .state('builtDetails', {
            url: '/builtDetails/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/builtDetails.html',
            controller: 'builtDetailsCtrl'
        })
        //还建信息
        .state('builtInformation', {
            url: '/builtInformation/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/builtInformation.html',
            controller: 'builtInformationCtrl'
        })
        //还建业权人
        .state('builtOwner', {
            url: '/builtOwner/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/builtOwner.html',
            controller: 'builtOwnerCtrl'
        })
        //还建补偿方案
        .state('builtCompensate', {
            url: '/builtCompensate/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/builtCompensate.html',
            controller: 'builtCompensateCtrl'
        })
        //知识库-新闻列表
        .state('newsList', {
            url: '/newsList',
            templateUrl: 'view/template/zjm/newsList.html',
            controller: 'newsListCtrl'
        })
        //群公告
        .state('grup', {
            url: '/grup',
            templateUrl: 'view/template/itzhang/grup.html',
            controller: 'grupCtrl'
        })
        .state('bankmessage', {
            url: '/bankmessage',
            templateUrl: 'view/template/itzhang/bankmessage.html',
            controller: 'bankmessageCtrl'
        })
         //群公告
         .state('grupindex', {
            url: '/grupindex',
            templateUrl: 'view/template/itzhang/grupindex.html',
            controller: 'grupindexCtrl'
        })
        /*以下为系统设置---start*/
        //基础数据-签约阶段
        .state('databasicSign', {
            url: '/databasicSign',
            templateUrl: 'view/template/zjm/databasicSign.html',
            controller: 'databasicSignCtrl'
        })
        //基础数据-审核流程设置
        .state('databasicprocess', {
            url: '/databasicprocess',
            templateUrl: 'view/template/zjm/databasicprocess.html',
            controller: 'databasicprocessCtrl'
        })
        //基础设置-人员列表
        .state('peoplelist', {
            url: '/peoplelist?deptId',
            templateUrl: 'view/template/zjm/peoplelist.html',
            controller: 'peoplelistCtrl'
        })
        //基础设置-物业授权
        .state('propertyaccredit', {
            url: '/propertyaccredit',
            templateUrl: 'view/template/zjm/propertyaccredit.html',
            controller: 'propertyaccreditCtrl'
        })
        //基础设置-已授权人员列表
        .state('propertyPeople', {
            url: '/propertyPeople',
            templateUrl: 'view/template/zjm/propertyPeople.html',
            controller: 'propertyPeopleCtrl'
        })
        //基础设置-分配角色
        .state('allotrole', {
            url: '/allotrole?roleid',
            templateUrl: 'view/template/zjm/allotrole.html',
            controller: 'allotroleCtrl'
        })
        //角色授权
        .state('roleaccredit', {
            url: '/roleaccredit',
            templateUrl: 'view/template/zjm/roleaccredit.html',
            controller: 'roleaccreditCtrl'
        })
        //基础数据-补偿项目
        .state('databasicCompensationProject', {
            url: '/databasicCompensationProject',
            templateUrl: 'view/template/zjm/databasicCompensationProject.html',
            controller: 'databasicCompensationProjectCtrl'
        })
        //基础数据-补偿类型
        .state('databasicCompensationType', {
            url: '/databasicCompensationType',
            templateUrl: 'view/template/zjm/databasicCompensationType.html',
            controller: 'databasicCompensationTypeCtrl'
        })
        //单一基础数据
        .state('singledatabasic', {
            url: '/singledatabasic',
            templateUrl: 'view/template/zjm/singledatabasic.html',
            controller: 'singledatabasicCtrl'
        })
        //合同模板
        .state('databasiccompact', {
            url: '/databasiccompact',
            templateUrl: 'view/template/zjm/databasiccompact.html',
            controller: 'databasiccompactCtrl'
        })
        //物业还建基础数据
        .state('databasicRebuild', {
            url: '/databasicRebuild',
            templateUrl: 'view/template/zjm/databasicRebuild.html',
            controller: 'databasicRebuildCtrl'
        })
        /*以上为系统设置---end*/
        //还建附件
        .state('builtAttachment', {
            url: '/builtAttachment/:projectid/:roomId',
            templateUrl: 'view/template/itzhang/builtAttachment.html',
            controller: 'builtAttachmentCtrl'
        })
        //群公告详情
        .state('lookthings', {
            url: '/lookthings/:id',
            templateUrl: 'view/template/itzhang/lookthings.html',
            controller: 'lookthingsCtrl'
        })

        //我的工作
        .state('myJob', {
            url: '/myJob',
            templateUrl: 'view/template/itzhang/myJob.html',
            controller: 'myJobCtrl'
        })
        //任务列表
        .state('jobTaskList', {
            url: '/jobTaskList/:projectid',
            templateUrl: 'view/template/itzhang/jobTaskList.html',
            controller: 'jobTaskListCtrl'
        })
        //事件列表
        .state('jobEventList', {
            url: '/jobEventList/:projectid',
            templateUrl: 'view/template/itzhang/jobEventList.html',
            controller: 'jobEventListCtrl'
        })

        //审批支付佣金列表
        .state('commissionPayment', {
            url: '/commissionPayment/:projectid/:approveId/:roomId/:number/:flag',
            templateUrl: 'view/template/itzhang/commissionPayment.html',
            controller: 'commissionPaymentCtrl'
        })
        //审批信息 测绘
        .state('surveyingMapping', {
            url: '/surveyingMapping/:projectid/:roomId/:approveId/:number/:flag/:status/:pactId/:updateStatus',
            templateUrl: 'view/template/itzhang/surveyingMapping.html',
            controller: 'surveyingMappingCtrl'
        })
        //审批 测绘信息
        .state('surveyingMapInformation', {
            url: '/surveyingMapInformation/:projectid/:roomId/:approveId/:number/:flag/:status/:pactId/:updateStatus',
            templateUrl: 'view/template/itzhang/surveyingMapInformation.html',
            controller: 'surveyingMapInformationCtrl'
        })
        //审批 附件
        .state('surveyingAffix', {
            url: '/surveyingAffix/:projectid/:roomId/:approveId/:number/:flag',
            templateUrl: 'view/template/itzhang/surveyingAffix.html',
            controller: 'surveyingAffixCtrl'
        })
        //我的工作流程
        .state('projectwarm', {
            url: '/projectwarm/:projectid',
            templateUrl: 'view/template/itzhang/projectwarm.html',
            controller: 'projectwarmCtrl'
        })
        //战略目标
        .state('objective', {
            url: '/objective',
            templateUrl: 'view/template/itzhang/objective.html',
            controller: 'objectiveCtrl' 
        })
        //战略定位 
        .state('positioning', {
            url: '/positioning',
            templateUrl: 'view/template/itzhang/positioning.html',
            controller: 'positioningCtrl' 
        })
        //战略定位和目标详情 
        .state('positioninganddetail', {
            url: '/positioninganddetail',
            templateUrl: 'view/template/itzhang/positioninganddetail.html',
            controller: 'positioninganddetailCtrl' 
        })
        // 导航栏
        .state('columnadmin', {
            url: '/columnadmin',
            templateUrl: 'view/template/itzhang/columnadmin.html',
            controller: 'columnadminCtrl' 
        })
        // 物业信息变动提醒
        .state('informationChange', {
            url: '/informationChange/:projectid',
            templateUrl: 'view/template/itzhang/informationChange.html',
            controller: 'informationChangeCtrl' 
        })

    $urlRouterProvider.otherwise('main');  //默认跳转到物业管理
}])

