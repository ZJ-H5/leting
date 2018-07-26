'use strict';
angular.module('app').directive('appCommissionRulesBody', ['cache', function(cache){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/ct/commissionRulesBody.html',
    };
}]);