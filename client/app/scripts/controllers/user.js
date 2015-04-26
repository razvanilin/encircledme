'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', function ($scope, $routeParams, User, CONFIG) {
    $scope.user = {};
    $scope.host = CONFIG.API_HOST;
    $scope.user.username = $routeParams.username;
    User.one($routeParams.username).get()
        .then(function(data) {
            $scope.user = data;
            console.log($scope.user);
        });
  });
