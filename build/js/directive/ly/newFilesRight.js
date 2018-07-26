/**
 * Created by lian on 2017/10/18.
 */
angular.module('app').directive('appNewFilesRight', ['cache', function(cache){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/ly/newFilesRight.html'
    };
}]);