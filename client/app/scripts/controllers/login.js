'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('LoginCtrl', function($scope, $http, $window, $location, AuthenticationService, Login) {
        $scope.login = {};
        $scope.message = '';
        $scope.logIn = function() {
            Login.post($scope.login).then(function(data, status, headers, config) {
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = JSON.stringify(data.user);
                    AuthenticationService.isLogged = true;

                    $scope.message = 'Welcome';

                    var username = JSON.parse($window.sessionStorage.user).username;
                    $location.path("/user/" + username);
                },
                function(response) {
                    console.log("Error with status code", response.status);
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.user;
                    AuthenticationService.isLogged = false;
                    $scope.message = 'Invalid username or password';
                });
        };
    });