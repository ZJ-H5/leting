"use strict";angular.module("app").controller("newsCtrl",["$http","$scope","dict","server","$rootScope",function(e,a,n,o,r,t){function l(){o.server().lgcMainInfoNews({pageNo:a.page,pageSize:7},function(e){if(e.result){var n=e.data;0==n.rows.length&&(a.pageFlag=!1),n.pageCount==a.page&&(a.pageFlag=!1);var o=!0,r=!1,t=void 0;try{for(var l,i=n.rows[Symbol.iterator]();!(o=(l=i.next()).done);o=!0){var s=l.value;a.newsList.push(s)}}catch(e){r=!0,t=e}finally{try{!o&&i.return&&i.return()}finally{if(r)throw t}}console.log(a.newsList)}else alert(e.message);a.$apply()},function(){alert(i)})}a.mobile="";var i="404请求失败";a.newsList=[],a.page=1,a.pageFlag=!0;var s=o.server().imgHost;a.imgHost=s.substring(0,s.length-1);var c=o.server().userId,u=o.server().loginHost;a.login=function(){document.location=u},""!=c&&o.server().zjmUserImg({userId:c},function(e){e.result?(a.nickname=e.data.nickname,a.realname=e.data.realname,a.photoUrl=e.data.photoUrl,a.$apply()):alert(e.message)}),o.server().zjcolumnqueryColumndo({},function(e){e.result&&(a.indexwordarr=e.data,a.indexwordarr.forEach(function(e,n){1==e.columnNo&&(a.brandintroduced=e.name),2==e.columnNo&&(a.brandintrodjian=e.name),3==e.columnNo&&(a.brandintrodyu=e.name),4==e.columnNo&&(a.brandintrodxiangmu=e.name)}))},function(e){}),o.server().lgcMainInfoHotline({},function(e){a.mobile=e.data[0].mobile,a.$apply()},function(){alert(i)}),l(),a.addPage=function(){a.pageFlag&&(a.page++,l())}}]).controller("lawsCtrl",["$http","$scope","dict","server","$rootScope",function(e,a,n,o,r){a.lawsTypeList=[],a.lawsInfoList=[],a.isType=0,a.detailFlag=!0,a.isLaws={};var t=o.server().userId,l=o.server().loginHost;a.login=function(){document.location=l},""!=t&&o.server().zjmUserImg({userId:t},function(e){e.result?(a.nickname=e.data.nickname,a.realname=e.data.realname,a.photoUrl=e.data.photoUrl,a.$apply()):alert(e.message)}),o.server().zjcolumnqueryColumndo({},function(e){e.result&&(a.indexwordarr=e.data,a.indexwordarr.forEach(function(e,n){1==e.columnNo&&(a.brandintroduced=e.name),2==e.columnNo&&(a.brandintrodjian=e.name),3==e.columnNo&&(a.brandintrodyu=e.name),4==e.columnNo&&(a.brandintrodxiangmu=e.name)}))},function(e){}),o.server().lgcMainInfoHotline({},function(e){a.mobile=e.data[0].mobile,a.$apply()},function(){alert("404请求失败")}),o.server().lgcMainInfoPolicyTypes({},function(e){console.log(e),e.result?(a.lawsTypeList=e.data,a.$apply(),console.log(a.lawsTypeList[0].id),a.searDate(a.lawsTypeList[0].id,0)):alert(e.message)},function(){alert("404请求失败")}),a.searDate=function(e,n){a.detailFlag=!0,a.isType=n,o.server().lgcMainInfoPolicyLaws({typeId:e},function(e){console.log(e),e.result?(a.lawsInfoList=e.data,a.$apply()):alert(e.message)},function(){alert("404请求失败")})},a.showDetail=function(e){a.isLaws=e,a.detailFlag=!1}}]).controller("showProjectCtrl",["$http","$scope","dict","server","$rootScope",function(e,a,n,o,r,t){function l(){o.server().lgcMainInfoManages({pageNo:a.page,pageSize:5},function(e){var n=e.data;0==n.rows.length&&(a.pageFlag=!1),n.pageCount==a.page&&(a.pageFlag=!1);var o=!0,r=!1,t=void 0;try{for(var l,i=n.rows[Symbol.iterator]();!(o=(l=i.next()).done);o=!0){var s=l.value;a.projectList.push(s)}}catch(e){r=!0,t=e}finally{try{!o&&i.return&&i.return()}finally{if(r)throw t}}console.log(a.projectList),a.$apply()},function(){alert(i)})}a.mobile="",a.projectList=[],a.page=1,a.pageFlag=!0,a.imgHost=o.server().imgHost;var i="404请求失败",s=o.server().userId,c=o.server().loginHost;a.login=function(){document.location=c},""!=s&&o.server().zjmUserImg({userId:s},function(e){e.result?(a.nickname=e.data.nickname,a.realname=e.data.realname,a.photoUrl=e.data.photoUrl,a.$apply()):alert(e.message)}),o.server().lgcMainInfoHotline({},function(e){a.mobile=e.data[0].mobile,a.$apply()},function(){alert(i)}),l(),a.addPage=function(){a.pageFlag&&(a.page++,l())}}]).controller("showProjectDetailCtrl",["$http","$scope","dict","server","$rootScope","$state",function(e,a,n,o,r,t,l){a.mobile="",a.project={},a.id=t.params.id;var i=o.server().userId,s=o.server().loginHost;a.login=function(){document.location=s},a.imgHost=o.server().imgHost,""!=i&&o.server().zjmUserImg({userId:i},function(e){e.result?(a.nickname=e.data.nickname,a.realname=e.data.realname,a.photoUrl=e.data.photoUrl,a.$apply()):alert(e.message)}),o.server().zjcolumnqueryColumndo({},function(e){e.result&&(a.indexwordarr=e.data,a.indexwordarr.forEach(function(e,n){1==e.columnNo&&(a.brandintroduced=e.name),2==e.columnNo&&(a.brandintrodjian=e.name),3==e.columnNo&&(a.brandintrodyu=e.name),4==e.columnNo&&(a.brandintrodxiangmu=e.name)}))},function(e){}),o.server().lgcMainInfoHotline({},function(e){a.mobile=e.data[0].mobile,a.$apply()},function(){alert("404请求失败")}),o.server().zjpagemanagefindPageManageByIddo({id:a.id},function(e){e.result?a.newsList=e.data:alert(e.message),a.$apply()},function(){alert("404请求失败")})}]);