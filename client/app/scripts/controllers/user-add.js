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
                $scope.loading = true;
                User.one('signup').customPOST($scope.user).then(function() {
                    $location.path('/login');
                }, function(response) {
                    if (response.data.code === 11000) {
                        $scope.message = "Username or email address are already taken.";
                    } else {
                        $scope.message = response.data;
                    }
                    $scope.loading = false;
                });
            };
        }
    });