angular.module("app").directive("uiPaginationTwo",[function(){return{restrict:"EA",templateUrl:"view/template/public/pagination2.html",replace:!0,scope:{conf2:"="},link:function(e,i,t,a){e.$on("categoryLoaded2",function(i,t){var a=e.page={},n=e.conf2;console.log(n),n.pageLimit=[10,15,20,30,50],n.itemPageLimit?n.pageLimit.indexOf(n.itemPageLimit)&&(n.pageLimit.push(n.itemPageLimit),n.pageLimit=n.pageLimit.sort(function(e,i){return e-i})):n.itemPageLimit=n.pageLimit[0],e.pageList=[],e.pageListFn=function(){if(console.log(n.currentPage),a.limit=n.total,a.defaultLimit=n.defaultLimit?n.defaultLimit:10,a.limit<a.defaultLimit)for(var i=1;i<=a.limit;i++)e.pageList.push(i);else if(Number(n.currentPage)<4){for(var i=1;i<5;i++)e.pageList.push(i);e.pageList.push("...",a.limit)}else if(Number(n.currentPage)>=a.limit-3){for(var i=a.limit-4;i<a.limit;i++)e.pageList.push(i);e.pageList.unshift(1,"...")}else{e.pageList=[];for(var i=Number(n.currentPage)-2;i<Number(n.currentPage)+2;i++)e.pageList.push(i);e.pageList.push("...",a.limit),e.pageList.unshift(1,"...")}},e.pageListFn(),e.changePage=function(e){"..."!=e&&(n.currentPage=e)},e.prevPage=function(){n.currentPage<=1||(n.currentPage-=1)},e.nextPage=function(){n.currentPage>=a.limit||(n.currentPage+=1)},e.selectPage=function(){},e.firstPage=function(){n.currentPage=1},e.lastPage=function(){n.currentPage=n.total},e.linkPage=function(){n.linkPage&&(n.linkPage=n.linkPage.replace(/[^0-9]/,""),(0==n.linkPage||n.linkPage>a.limit)&&(n.linkPage=a.limit),n.currentPage=n.linkPage)},e.$apply()})}}}]);