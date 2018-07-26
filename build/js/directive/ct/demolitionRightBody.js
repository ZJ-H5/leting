'use strict';
angular.module('app').directive('appDemolitionRightBody', ['cache', function(cache){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/ct/demolitionRightBody.html',

    };
}]);