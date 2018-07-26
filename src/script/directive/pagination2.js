/**
 * Created by itzhang on 2017/10/20.
 */
angular.module('app').directive('uiPaginationTwo', [ function(){



    return {
        restrict : 'EA',
        templateUrl : 'view/template/public/pagination2.html',
        replace : true,
        scope : {
            conf2 : '='
        },
        link : function(scope , ele , attrs,$watch){
            scope.$on("categoryLoaded2", function (event, args) {
                //$scope.category即为异步获取的数据
                var page = scope.page = {};
                var conf2 = scope.conf2 ;
                console.log(conf2)
                // console.log(conf2);
                // 初始化一页展示多少条  默认为10
                conf2.pageLimit = [10 , 15 , 20 , 30 ,50];

                if(!conf2.itemPageLimit ){
                    conf2.itemPageLimit = conf2.pageLimit[0];
                }else{
                    // 把自定义的条目加入到pagelimit中
                    if(conf2.pageLimit.indexOf(conf2.itemPageLimit)){
                        conf2.pageLimit.push(conf2.itemPageLimit);
                        conf2.pageLimit = conf2.pageLimit.sort(function(a ,b ){ return a - b; })
                    };
                }

                // 分页数组
                scope.pageList = [];
                scope.pageListFn = function(){
                    console.log(conf2.currentPage);
                    // 一共多少页
                    page.limit = conf2.total ;

                    // 最多展示多少可见页码 默认为10
                    page.defaultLimit = conf2.defaultLimit ? conf2.defaultLimit : 10 ;

                    // 三种打点方式 ， 中间打点， 左边打点， 后边打点
                    if(page.limit <  page.defaultLimit ){
                        for(var i=1; i<=page.limit ; i++){
                            scope.pageList.push(i);

                        }
                    }else{
                        if(Number(conf2.currentPage) < 4){
                            for(var i=1 ; i<5 ; i++){
                                scope.pageList.push(i);
                            }
                            scope.pageList.push('...' , page.limit );
                        }else if(Number(conf2.currentPage) >= page.limit - 3){
                            for(var i= page.limit - 4 ; i< page.limit  ; i++){
                                scope.pageList.push(i);
                            }
                            scope.pageList.unshift(1 , '...');
                        }else{
                            scope.pageList = [];
                            for(var i= Number(conf2.currentPage) -2 ; i< Number(conf2.currentPage) + 2 ; i++){
                                scope.pageList.push(i);
                            }
                            scope.pageList.push('...' , page.limit );
                            scope.pageList.unshift(1 , '...');
                        }
                    }
                }
                scope.pageListFn();

                // 点击页码
                scope.changePage = function(page){
                    if(page == '...') return ;
                    conf2.currentPage = page ;
                }

                // 上一页
                scope.prevPage = function(){
                    if(conf2.currentPage <= 1) return ;
                    conf2.currentPage -= 1;
                }

                // 下一页
                scope.nextPage = function(){
                    if(conf2.currentPage >= page.limit ) return ;
                    conf2.currentPage += 1;
                }

                // 改变一页显示条目
                scope.selectPage = function(){
                }
                //首页
                scope.firstPage = function(){
                    conf2.currentPage = 1;
                }
                //尾页
                scope.lastPage=function(){
                    conf2.currentPage = conf2.total;
                }

                // 跳转页
                scope.linkPage = function(){
                    if(!conf2.linkPage) return ;
                    conf2.linkPage = conf2.linkPage.replace(/[^0-9]/ , '');
                    if(conf2.linkPage == 0 || conf2.linkPage > page.limit){
                        conf2.linkPage = page.limit ;
                    }
                    conf2.currentPage = conf2.linkPage ;
                }
                scope.$apply()

            });
        }
    }
}]);