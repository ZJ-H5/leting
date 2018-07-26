"use strict";angular.module("app",["ui.router","ngCookies","validation","ngAnimate"]),angular.module("app").value("dict",{}).run(["dict","$rootScope","$timeout",function(e,t,r){t.showTips=function(e){alert(e)},t.no="暂无数据",e.timeConverter=function(e){var t=new Date(e),r=["01","02","03","04","05","06","07","08","09","10","11","12"],n=t.getFullYear(),o=r[t.getMonth()],a=t.getDate()<10?"0"+t.getDate():t.getDate(),i=t.getHours()<10?"0"+t.getHours():t.getHours(),c=t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes();t.getSeconds(),t.getMinutes();return n+"/"+o+"/"+a+" "+i+":"+c}}]),angular.module("app").config(["$provide",function(e){e.decorator("$http",["$delegate","$q",function(e,t){return e.post=function(r,n,o){var a=t.defer();return e.get(r).success(function(e){a.resolve(e)}).error(function(e){a.reject(e)}),{success:function(e){a.promise.then(e)},error:function(e){a.promise.then(null,e)}}},e}])}]),angular.module("app").config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("main",{url:"/main",templateUrl:"view/main.html",controller:"mainCtrl"}).state("itemInformation",{url:"/itemInformation",templateUrl:"view/template/itzhang/itemInformation.html",controller:"itemInformationCtrl"}).state("itemDetails",{url:"/itemDetails",templateUrl:"view/template/itzhang/itemDetails.html",controller:"itemDetailsCtrl"}).state("propertyInformation",{url:"/propertyInformation",templateUrl:"view/template/itzhang/propertyInformation.html",controller:"propertyInformationCtrl"}).state("projectmanagement",{url:"/projectmanagement",templateUrl:"view/template/lh/projectmanagement.html",controller:"projectmanagementCtrl"}).state("commissionrules",{url:"/commissionrules",templateUrl:"view/template/lh/commissionrules.html",controller:"commissionrulesCtrl"}).state("NewHousingStandards",{url:"/NewHousingStandards",templateUrl:"view/template/itzhang/NewHousingStandards.html",controller:"NewHousingStandardsCtrl"}).state("NewBuildingStandard",{url:"/NewBuildingStandard",templateUrl:"view/template/itzhang/NewBuildingStandard.html",controller:"NewBuildingStandardCtrl"}),t.otherwise("NewHousingStandards")}]),angular.module("app").constant("server",{}).run(["server","$rootScope","$timeout",function(e,t,r){return e.server=function(){function e(e,t,n,o,a,i,c){$.ajax({type:e,url:r+t,data:n,async:o,cache:!c&&c,success:function(e){a(JSON.parse(e))},error:function(e){i(JSON.parse(e))},complete:function(){},beforeSend:function(){}})}function t(e,t,r,o,a,i,c){$.ajax({type:e,url:n+t,data:r,async:o,cache:!c&&c,success:function(e){a(JSON.parse(e))},error:function(e){i(JSON.parse(e))},complete:function(){},beforeSend:function(){}})}var r="http://d3.cto.shovesoft.com/ltzy/",n="http://d3.cto.shovesoft.com/";return Date.prototype.format=function(e){var t={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var r in t)new RegExp("("+r+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?t[r]:("00"+t[r]).substr((""+t[r]).length)));return e},{host:r,deleteById:function(t,r,n,o){e("post","financialsettlement/list.do",t,!0,r,n)},zjprojectdeleteById:function(t,r,n,o){e("post","project/findById.do",t,!0,r,n)},lhprojectlist:function(t,r,n,o){e("post","project/list.do",t,!0,r,n)},commissionrulesById:function(t,r,n,o){e("post","updateSave",t,!0,r,n)},zjprojectfindByIddo:function(t,r,n,o){e("post","project/findById.do",t,!0,r,n)},zjprojectprojectDetaileddo:function(t,r,n,o){e("post","project/projectDetailed.do",t,!0,r,n)},zjroomlistdo:function(t,r,n,o){e("post","room/list.do",t,!0,r,n)},zjltzywyroomlistdo:function(e,r,n,o){t("post","ltzywy/room/list.do",e,!0,r,n)}}},e}]),angular.module("app").config(["$validationProvider",function(e){var t={phone:/^1[\d]{10}$/,password:function(e){return(e+"").length>5},projectName:function(e){return(e+"").length>5},required:function(e){return!!e}},r={phone:{success:"",error:"必须是11位手机号"},password:{success:"",error:"长度至少6位"},projectName:{success:"",error:"长度至少6位"},required:{success:"",error:"不能为空"}};e.setExpression(t).setDefaultMsg(r)}]),angular.module("app").controller("mainCtrl",["$http","$scope",function(e,t){}]),angular.module("app").directive("appFoot",["cache",function(e){return{restrict:"E",replace:!0,templateUrl:"view/template/public/foot.html"}}]),angular.module("app").directive("appHead",["cache",function(e){return{restrict:"E",replace:!0,templateUrl:"view/template/public/head.html"}}]),angular.module("app").directive("appLeftColumn",["cache",function(e){return{restrict:"E",replace:!0,templateUrl:"view/template/public/leftColumn.html"}}]),angular.module("app").filter("filterByObj",[function(){return function(e,t){var r=[];return angular.forEach(e,function(e){var n=!0;for(var o in t)e[o]!==t[o]&&(n=!1);n&&r.push(e)}),r}}]),angular.module("app").service("cache",["$cookies",function(e){this.put=function(t,r){e.put(t,r)},this.get=function(t){return e.get(t)},this.remove=function(t){e.remove(t)}}]),angular.module("app").controller("annexCtrl",["$http","$scope","dict","server",function(e,t,r,n){n.server().ctdeleteById({id:"261e554de2f3493ebed1e4b6567818d1",userId:"d50fbadb0b484f64b814ada49e83b8e3"},function(e){console.log(e)},function(){})}]).controller("demolitionCompensationCtrl",["$http","$scope",function(e,t){console.log("拆迁补偿规则_1")}]).controller("compensationRulesCtrl",["$http","$scope",function(e,t){console.log("拆迁补偿规则(新建项目)")}]).controller("commissionReleaseCtrl",["$http","$scope","server",function(e,t,r){console.log("佣金发放规则(项目详情)"),t.showColor="maincolor",r.server().ctommissionrules({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){var r=[],n={commsionPercent:"-",id:"-",isHandOver:"-",ommissionRulesId:"-",rank:"-",ruleNodes:"-"};t.qyData=e.data,t.qyData.forEach(function(e,o){t.qyDetailisList=t.qyData[o].detailsList,t.qyDetailisList.forEach(function(e,n){r.push(t.qyDetailisList[n])});for(var a=0;a<4-t.qyDetailisList.length;a++)r.push(n);t.resJD=r;for(var i="",c=0;c<t.resJD.length;c++)i+="<td>"+t.resJD[c].ruleNodes+"</td>",i+="<td>"+t.resJD[c].commsionPercent+"</td>",t.$apply();$(".qypush").after(i)}),t.$apply()},function(){}),r.server().ctillegalcommissionrule({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){t.items=e.data,t.$apply()},function(){}),r.server().ctintegratedservices({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){t.lists=e.data,t.lists.forEach(function(e,r){t.lists[r].types=1==t.lists[r].type?"签约节点":"测绘数据"}),console.log(t.lists),t.$apply()},function(){})}]).controller("commissionRulesCtrl",["$http","$scope","server",function(e,t,r){console.log("佣金规则(新建项目)"),r.server().ctillegalcommissionrule({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){t.weijian=e.data,t.$apply()},function(){}),r.server().ctintegratedservices({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){t.yewu=e.data,t.yewu.forEach(function(e,r){t.yewu[r].types=1==t.yewu[r].type?"签约节点":"测绘数据"}),t.$apply()},function(){}),t.saveCCWZ=function(){r.server().ctaddillegalcommission({projectId:"261e554de2f3493ebed1e4b6567818d1",issuingNode:t.wzIssuingNode,commission:t.wzCommission,remarks:t.wzRemarks,createUser:"d50fbadb0b484f64b814ada49e83b8e3"},function(e){alert(e.message),t.$apply()},function(e){})},t.isflag1=!0,t.changeColor=function(){"签约节点"==t.typeValue?(t.isflag1=!0,t.isflag2=!1):(t.isflag1=!1,t.isflag2=!0)},t.saveZHYW=function(){t.isflag1?(t.standardOne=t.zhqya,t.standardTwo=t.zhqyb,t.typeSave=1):(t.standardOne=t.zhcha,t.standardTwo=t.zhchb,t.typeSave=2),console.log(t.zhIntegratedName,t.standardOne,t.standardTwo,t.zhCommission,t.zhRemarks),r.server().ctintegratedaddsave({projectId:"261e554de2f3493ebed1e4b6567818d1",createUser:"d50fbadb0b484f64b814ada49e83b8e3",integratedName:t.zhIntegratedName,paymentStandardOne:"8110b27087fb426bbd3ecb5a5ed2ebbf",paymentStandardTwo:"4013777f9d2a4aeabc49c539ca0d82a9",type:t.typeSave,commission:t.zhCommission,unit:2,remarks:t.zhRemarks},function(e){alert(e.message)},function(e){})},r.server().ctommissionrules({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){var r=[],n={commsionPercent:"-",id:"-",isHandOver:"-",ommissionRulesId:"-",rank:"-",ruleNodes:"-"};t.qyData=e.data,t.qyData.forEach(function(e,o){t.qyDetailisList=t.qyData[o].detailsList,t.qyDetailisList.forEach(function(e,n){r.push(t.qyDetailisList[n])});for(var a=0;a<4-t.qyDetailisList.length;a++)r.push(n);t.resJD=r;for(var i="",c=0;c<t.resJD.length;c++)i+="<td>"+t.resJD[c].ruleNodes+"</td>",i+="<td>"+t.resJD[c].commsionPercent+"</td>",t.$apply();$(".qypush").after(i)}),t.$apply()},function(){});var n;t.addffjd=function(){(n=$(".pushffjd").find("tr").length)<4&&$(".pushffjd").append('<tr>\n                            <th width="15%" class="pl30 maincolor">发放节点：</th>\n                            <td >\n                                <input type="text"  value="" class="c-yjgzinpc c-bordere6 mt10 left ffNodes">\n                                <span class="ml50 mr10 maincolor left">发放比例：</span>\n                                <input type="text"   class="c-yjgzinpc c-bordere6 mr5 mt10 left ffPercent">%\n                            </td>\n                        </tr>')},t.delffjd=function(){(n=$(".pushffjd").find("tr").length)>2&&$(".pushffjd").find("tr:last-child").remove()},t.saveYJGZ=function(){$(".pushffjd").find("tr").attr("isHandOver","0"),$(".pushffjd").find("tr:last-child").attr("isHandOver","1"),$(".pushffjd").find("tr:first-child").find(".ffNodes").val("签约当月"),$(".pushffjd").find("tr:last-child").find(".ffNodes").val("完成物业移交");var e,o=[],a=$(".pushffjd").find("tr"),i=0;n=a.length,a.each(function(e){var t=e+1;o.push({rank:""+t,ruleNodes:$(this).find(".ffNodes").val(),commsionPercent:$(this).find(".ffPercent").val(),isHandOver:$(this).attr("isHandOver")})}),t.nodeJson=o;for(var c=0;c<t.nodeJson.length;c++)e=t.nodeJson[c].commsionPercent,e=parseInt(e,10),i+=e;if(100!==i)return alert("提交失败，发放比例之和必须等于100%！"),!1;r.server().ctommissionrulesSave({projectId:"261e554de2f3493ebed1e4b6567818d1",createUser:"d50fbadb0b484f64b814ada49e83b8e3",allProcess:t.process,allProcess2:t.process2,standard:t.standard,nodeJson:JSON.stringify(t.nodeJson)},function(e){alert(e.message)},function(e){alert(e.message)})},t.wjyjCheck=function(e){t.useid=e.id,r.server().ctcheckillegalcommission({id:t.useid},function(e){t.checkwjyj=e.data,t.$apply()},function(){})}}]),angular.module("app").controller("itemDetailsCtrl",["server","$http","$scope","dict","$rootScope",function(e,t,r,n,o){function a(e,t){echarts.init(document.getElementById("main")).setOption({series:[{name:"访问来源",type:"pie",radius:"55%",data:[{value:e[0]?e[0]:0,name:"还建"},{value:e[1]?e[1]:0,name:"移交"},{value:e[2]?e[2]:0,name:"拆除"},{value:e[3]?e[3]:0,name:"测绘"},{value:e[4]?e[4]:0,name:"签约"}]}]}),r.salesControlArr=[{value:e[0]?e[0]:0,name:"还建",USName:t[0]},{value:e[1]?e[1]:0,name:"移交",USName:t[1]},{value:e[2]?e[2]:0,name:"拆除",USName:t[2]},{value:e[3]?e[3]:0,name:"测绘",USName:t[3]},{value:e[4]?e[4]:0,name:"签约",USName:t[4]}]}r.no="暂无数据";var i=[],c=[];e.server().zjprojectprojectDetaileddo({projectId:"261e554de2f3493ebed1e4b6567818d1"},function(e){if(!0===e.result){r.project=e.data.project,r.survey=e.data.survey,r.count=e.data.count,r.attachment=e.data.attachment,r.salesControl=e.data.sales_control;for(var t in r.salesControl)i.push(r.salesControl[t]),c.push(t);a(i,c),r.$apply()}else alert(e.message)},function(e){alert(e)}),e.server().zjprojectdeleteById({id:"261e554de2f3493ebed1e4b6567818d1",userId:"d50fbadb0b484f64b814ada49e83b8e3"},function(e){!0===e.result?(r.project2=e.data.project,r.project2.createTime=n.timeConverter(r.project2.createTime),r.project2.updateTime=n.timeConverter(r.project2.updateTime),r.$apply()):o.showTips(e.message)},function(){o.showTips("404请求失败")})}]).controller("itemInformationCtrl",["$http","$scope","server","dict",function(e,t,r,n){t.no="暂无数据";r.server().zjprojectdeleteById({id:"261e554de2f3493ebed1e4b6567818d1",userId:"d50fbadb0b484f64b814ada49e83b8e3"},function(e){!0===e.result?(t.project=e.data.project,t.project.createTime=n.timeConverter(t.project.createTime),t.project.updateTime=n.timeConverter(t.project.updateTime),t.count=e.data.count,t.$apply()):$rootScope.showTips(e.message)},function(){$rootScope.showTips("404请求失败")})}]).controller("propertyInformationCtrl",["$http","$scope","server",function(e,t,r){function n(e){r.server().zjltzywyroomlistdo({projectId:o,schemaId:e||"",pageCount:t.conf.currentPage,pageSize:t.conf.itemPageLimit},function(e){!0===e.result?0===e.data.total?t.flag:(t.flag=!1,t.list=e.data.rows,t.conf.total=e.data.total/e.data.pageSize,t.conf.counts=e.data.total,t.$apply(),t.$broadcast("categoryLoaded")):alert(e.message)},function(e){alert(e)})}t.flag=!1;var o="261e554de2f3493ebed1e4b6567818d1";t.conf={total:10,currentPage:1,itemPageLimit:1,isSelectPage:!1,isLinkPage:!1},t.$watch("conf.currentPage + conf.itemPageLimit",function(e){n()}),t.inputVal=function(){n(t.inputVal)},t.edit=function(){},t.dels=function(){}}]).controller("NewHousingStandardsCtrl",["$http","$scope","server","dict",function(e,t,r,n){}]).controller("NewBuildingStandardCtrl",["$http","$scope","server","dict",function(e,t,r,n){}]),angular.module("app").controller("projectmanagementCtrl",["$http","$scope","dict","server","$rootScope",function(e,t,r,n,o){t.no="暂无数据",t.conf={total:10,currentPage:1,itemPageLimit:1,isSelectPage:!1,isLinkPage:!1},t.$watch("conf.currentPage + conf.itemPageLimit",function(e){n.server().lhprojectlist({pageCount:t.conf.currentPage,pageSize:t.conf.itemPageLimit},function(e){!0===e.result?(t.conf.total=e.data.total/e.data.pageSize,t.conf.counts=e.data.total,t.$apply(),t.$broadcast("categoryLoaded")):o.showTips(e.message)})})}]).controller("commissionrulesCtrl",["$http","$scope","dict","server",function(e,t,r,n){}]).controller("commissionrulesoneCtrl",["$http","$scope","dict","server",function(e,t,r,n){}]).controller("propertymanagementCtrl",["$http","$scope","dict","server",function(e,t,r,n){}]).controller("propertymanagementCtrl",["$http","$scope","dict","server","$rootScope",function(e,t,r,n,o){t.no="暂无数据";n.server().propertymanagementById({projectId:"261e554de2f3493ebed1e4b6567818d1",searchKeys:"fc992f5d25da41eb8df2daa730e6f817"},function(e){console.log(e),!0===e.result?(t.arr=e.data,t.$apply()):o.showTips(e.message)},function(e){o.showTips(e)})}]),angular.module("app").controller("newFilesCtrl",["$http","$scope","dict","server",function(e,t,r,n){n.server().lyProvince({},function(e){t.province=e.data}),t.provincetab=function(){console.log(t.provinceId.name),n.server().lyCity({parentId:t.provinceId},function(e){t.city=e.data})},t.citytab=function(){n.server().lyCity({parentId:t.cityId},function(e){t.area=e.data})},t.saveSubMit=function(){""!=t.projectName&&""!=t.areaDemolition&&""!=t.plannedVolumeRatio&&""!=t.planningFloorArea&&""!=t.createUser&&n.server().lySaveSubMit({projectName:t.projectName,provinceId:t.provinceId,cityId:t.cityId,areaId:t.areaId,roadId:t.roadId,areaDemolition:t.areaDemolition,plannedVolumeRatio:t.plannedVolumeRatio,planningFloorArea:t.planningFloorArea,createUser:t.startTime},function(e){alert(e.message)},function(e){alert(e.message)})}}]),angular.module("app").controller("projectProcessCtrl",["$http","$scope","dict","server",function(e,t,r,n){var o=2;t.addterm=function(){o++;var e="<tr><td  class='pl30 c3' valign='top'>前置条件"+o+": </td><td ><input  type='text' placeholder='请输入......' ng-model='processname' name='processname' class='l-projectinput'/></td></tr>";$(".addtable").append(e)}}]),angular.module("app").directive("appAnnexRight",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/ct/annexRight.html"}}]),angular.module("app").directive("appCommissionReleaseBody",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/ct/commissionReleaseBody.html"}}]),angular.module("app").directive("appCommissionRulesBody",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/ct/commissionRulesBody.html"}}]),angular.module("app").directive("appCompensationRulesRight",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/ct/compensationRulesRight.html",link:function(e){e.addTypeName=function(){console.log(e.typeName)}}}}]),angular.module("app").directive("appDemolitionRightBody",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/ct/demolitionRightBody.html"}}]),angular.module("app").directive("appDemolitionRightHead",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/ct/demolitionRightHead.html"}}]),angular.module("app").directive("appCheckInformation",["cache",function(e){return{restrict:"A",replace:!0,templateUrl:"view/template/itzhang/checkinformation.html"}}]),angular.module("app").directive("appNewFilesRight",["cache",function(e){return{restrict:"AE",replace:!0,templateUrl:"view/template/ly/newFilesRight.html"}}]),angular.module("app").directive("appProjectProcessRight",["cache",function(e){return{restrict:"AE",replace:!0,templateUrl:"view/template/ly/projectProcessRight.html"}}]);