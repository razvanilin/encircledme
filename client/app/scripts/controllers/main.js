'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, AuthenticationService, $location, $window, CONFIG, $http) {
    if (AuthenticationService.isLogged) {
    	$location.path(JSON.parse($window.sessionStorage.user).username);
    }

    $scope.viewHome = true;

    $scope.host = CONFIG.API_HOST;

    $http.get(CONFIG.API_HOST+"/version")
        .success(function(data, status, headers, config) {
            console.info(data);
            $scope.version = data;
        })
        .error(function(data, status, headers, config) {
            $scope.version = "N/A";
        });

    $scope.signUp = function() {
    	$location.path('signup');
    };

  });
