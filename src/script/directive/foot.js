'use strict';
angular.module('app').directive('appFoot', ['cache', function(cache){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'view/template/public/foot.html'
    };
}]);