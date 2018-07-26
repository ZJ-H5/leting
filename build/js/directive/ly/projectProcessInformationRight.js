angular.module('app').directive('appProjectProcessInformationRight', ['cache', function(cache){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/ly/projectProcessInformationRight.html'
    };
}]);