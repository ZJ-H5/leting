/**
 * Created by pc on 2017/10/31.
 */
angular.module('app').directive('eventClick', ['cache', function(cache){
    return {

        template: "<a href='javascript:void(0)' class='mt-10 ml20 l-addbnt iconfont left' ng-click='myfun()'></a>"
    };
}]);//<a href="javascript:void(0)" class="mt-10 ml20 l-addbnt iconfont left" ng-click="myfun()"></a>