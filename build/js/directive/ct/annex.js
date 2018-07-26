'use strict';
angular.module('app').directive('appAnnexRight', ['cache', function(cache){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/ct/annexRight.html'

    };
}]);