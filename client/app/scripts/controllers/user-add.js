'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserAddCtrl
 * @description
 * # UserAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('UserAddCtrl', function($scope, User, $location, $window) {
        if ($window.sessionStorage.token) {
            $location.path('/');
        } else {
            $scope.user = {};
            $scope.saveUser = function() {
                User.post($scope.user).then(function() {
                    $location.path('/login');
                });
            };
        }
    });