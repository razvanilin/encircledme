'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserAddCtrl
 * @description
 * # UserAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('UserAddCtrl', function($scope, User, $location, $window, AuthenticationService) {
        if (AuthenticationService.isLogged) {
            $location.path(JSON.parse($window.sessionStorage.user).username);
            return;
        } else {
            $scope.viewSignup = true;
            $scope.user = {};
            $scope.saveUser = function() {
                User.post($scope.user).then(function() {
                    $location.path('/login');
                });
            };
        }
    });