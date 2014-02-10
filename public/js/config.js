'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/devices', {
            templateUrl: 'views/devices/list.html'
        }).
        when('/devices/create', {
            templateUrl: 'views/devices/create.html'
        }).
        when('/devices/:deviceId/edit', {
            templateUrl: 'views/devices/edit.html'
        }).
        when('/devices/:deviceId', {
            templateUrl: 'views/devices/edit.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);