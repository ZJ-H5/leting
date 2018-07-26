/**
 * Created by pc on 2017/10/26.
 */
angular.module('app').controller('propertyInitCtrl', ['$http', '$scope', 'server', '$state', function ($http, $scope, server, $state) {
    $scope.projectId = $state.params.projecid;
}]);