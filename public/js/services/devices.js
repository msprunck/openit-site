'use strict';

//Devices service used for devices REST endpoint
angular.module('mean.devices').factory('Devices', ['$resource', function($resource) {
    return $resource('devices/:deviceId', {
        deviceId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);