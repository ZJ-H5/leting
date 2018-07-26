'use strict';
angular.module('app').directive('appCheckInformation', ['cache', function(cache){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/itzhang/checkinformation.html',
        // link:function($scope){
        //     $scope.$watch(function(newVal){
        //
        //         new Swiper('.swiper-container', {
        //             pagination: '.swiper-pagination',
        //             slidesPerView: 4,
        //             centeredSlides: true,
        //             paginationClickable: true,
        //             spaceBetween: 30,
        //             grabCursor: true
        //         });
        //
        //     });
        // }
    };
}]);