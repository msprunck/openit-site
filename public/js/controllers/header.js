'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Devices',
        'link': 'devices'
    }, {
        'title': 'Create New Device',
        'link': 'devices/create'
    }];
    
    $scope.isCollapsed = false;
}]);