angular.module("app").controller("newFilesCtrl",["$http","$scope","dict","server","$state",function(e,a,r,t,l){a.createUser=t.server().userId,a.flag={projectNameflag:!1,projectnumberflag:!1,provinceIdflag:!1,cityIdflag:!1,areaIdflag:!1,roadIdflag:!1,areaDemolitionflag:!1,plannedVolumeRatioflag:!1,planningFloorAreaflag:!1,surveyAreaflag:!1},a.tips=function(e,r){if("projectName"==r&&(a.flag.projectNameflag=!e),"projectnumber"==r&&(a.flag.projectnumberflag=!e),"roadId"==r){if(!a.provinceId)return void(a.flag.provinceIdflag=!0);if(a.flag.provinceIdflag=!1,!a.cityId)return void(a.flag.cityIdflag=!0);if(a.flag.cityIdflag=!1,!a.areaId)return void(a.flag.areaIdflag=!0);a.flag.areaIdflag=!1,a.flag.roadIdflag=!e}"areaDemolition"==r&&(a.flag.areaDemolitionflag=!e),"plannedVolumeRatio"==r&&(a.flag.plannedVolumeRatioflag=!e,a.flag.plannedVolumeRatioNumflag=e<=0),"planningFloorArea"==r&&(a.flag.planningFloorAreaflag=!e),"surveyArea"==r&&(a.flag.surveyAreaflag=!e)};var n;t.server().lyProvince({},function(e){a.signListP=e.data,a.$apply()}),a.provincetab=function(){a.provinceId?a.flag.provinceIdflag=!1:a.flag.provinceIdflag=!0,t.server().lyCity({parentId:a.provinceId},function(e){a.city=e.data,n=a.city.length,a.$apply()})},a.citytab=function(){a.cityId?a.flag.cityIdflag=!1:a.flag.cityIdflag=!0,t.server().lyCity({parentId:a.cityId},function(e){a.area=e.data,a.$apply()})},a.saveSubMit=function(){if(a.startTime=$(".test1").val(),!a.projectName)return void(a.flag.projectNameflag=!0);a.provinceId,a.cityId,a.areaId,a.roadId;t.server().lySaveSubMit({projectName:a.projectName,parcelNumber:a.projectnumber,provinceId:a.provinceId,cityId:a.cityId,areaId:a.areaId,roadId:a.roadId,areaDemolition:a.areaDemolition,plannedVolumeRatio:a.plannedVolumeRatio,planningFloorArea:a.planningFloorArea,surveyArea:a.surveyArea,signingAgreementTime:a.startTime,createUser:a.createUser,agreementName:a.agreementName?a.agreementName:"框架协议"},function(e){e.result?alert(e.message,function(){l.go("projectmanagement")}):alert(e.message)},function(e){alert(e.message)})},a.mychange=function(e){laydate.render({elem:".test1",format:"yyyy-MM-dd",show:!0,closeStop:".test2"})},a.freturn=function(){l.go("projectmanagement")}}]);