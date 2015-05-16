'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', function ($scope, $routeParams, User, CONFIG, $window) {
    $scope.user = {};
    $scope.host = CONFIG.API_HOST;
    $scope.user.username = $routeParams.username;
    User.one($routeParams.username).get()
        .then(function(data) {
            $scope.user = data;
            console.log($scope.user);
        });

    $scope.accessNetwork = function(network) {
    	$window.open(network);
    };
  });
