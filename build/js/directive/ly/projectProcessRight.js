/**
 * Created by lian on 2017/10/20.
 */
angular.module('app').directive('appProjectProcessRight', ['cache', function(cache){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/ly/projectProcessRight.html'
    };
}]);