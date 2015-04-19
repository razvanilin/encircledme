'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('MenuCtrl', function($scope, $http, $window, $location) {
        $scope.menu = {};
        if ($window.sessionStorage.token && $window.sessionStorage.user) {
            var user = JSON.parse($window.sessionStorage.user);
            $scope.menu.username = user.username;
            $scope.menu.avatar = user.avatar;
            $scope.menu.loggedIn = true;
        } else {
            $scope.menu.username = "Guest";
            $scope.menu.avatar = "default.png";
            $scope.menu.loggedIn = false;
        }
    });