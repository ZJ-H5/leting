'use strict';
angular.module('app').directive('appDemolitionRightHead', ['cache', function(cache){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/ct/demolitionRightHead.html'

    };
}]);