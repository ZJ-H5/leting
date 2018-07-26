/**
 * Created by lian on 2017/10/27.
 */
angular.module('app').directive('appEnclosureRight', ['cache', function(cache){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/ly/enclosureRight.html'
    };
}]);