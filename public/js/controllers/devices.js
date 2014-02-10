'use strict';

angular.module('mean.devices').controller('DevicesController', ['$scope', '$routeParams', '$location', 'Global', 'Devices', function ($scope, $routeParams, $location, Global, Devices) {
    $scope.global = Global;

    $scope.create = function() {
        var device = new Devices({
            name: this.name,
        });
        device.$save(function(response) {
            $location.path('devices/' + response._id + '/edit');
        });

        this.name = '';
        this.key = '';
    };

    $scope.remove = function(device) {
        if (device) {
            device.$remove();

            for (var i in $scope.devices) {
                if ($scope.devices[i] === device) {
                    $scope.devices.splice(i, 1);
                }
            }
        }
        else {
            $scope.device.$remove();
            $location.path('devices');
        }
    };
    
    $scope.addCommand = function(command) {
        var device = $scope.device;
        if (!device.updated) {
            device.updated = [];
        }
        device.updated.push(new Date().getTime());
        
        device.commands.push(command);

        device.$update(function() {
            $location.path('devices/' + device._id + '/edit');
        });
    };
    
    $scope.removeCommand = function(index) {
        var device = $scope.device;
        if (!device.updated) {
            device.updated = [];
        }
        device.updated.push(new Date().getTime());
        
        if (index > -1) {
            device.commands.splice(index, 1);
        }

        device.$update(function() {
            $location.path('devices/' + device._id + '/edit');
        });
    };

    $scope.update = function() {
        var device = $scope.device;
        if (!device.updated) {
            device.updated = [];
        }
        device.updated.push(new Date().getTime());

        device.$update(function() {
            $location.path('devices');
        });
    };

    $scope.find = function() {
        Devices.query(function(devices) {
            $scope.devices = devices;
        });
    };

    $scope.findOne = function() {
        Devices.get({
            deviceId: $routeParams.deviceId
        }, function(device) {
            $scope.device = device;
        });
    };
}]);