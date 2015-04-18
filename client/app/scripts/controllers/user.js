'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', function ($scope, $routeParams, $http, CONFIG, User) {
    $scope.viewUser = true;
    $scope.user = {};
    $scope.user.username = $routeParams.username;
    User.one($routeParams.username).get()
        .then(function(data, status, headers, config) {
            $scope.user = data;
            console.log($scope.user);
        });
  });
