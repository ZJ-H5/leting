'use strict';
angular.module('app').directive('appCompensationRulesRight', ['cache', function(cache){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/ct/compensationRulesRight.html',

    };
}]);