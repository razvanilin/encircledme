'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', function ($scope, $routeParams, $http) {
    $scope.viewUser = true;
    $scope.user = {};
    $scope.user.username = $routeParams.username;
    $http({
            url: 'http://188.226.229.203:3000/user/'+$routeParams.username,
            method: 'GET'
        })
            .success(function(data, status, headers, config) {
                
                $scope.user = data; // Should log 'foo'
                console.log($scope.user);
            });
    //console.log($scope.user.avatar);

  });
