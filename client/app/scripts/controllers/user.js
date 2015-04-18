'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', function ($scope, $routeParams, $http, CONFIG) {
    $scope.viewUser = true;
    $scope.user = {};
    $scope.user.username = $routeParams.username;
    $http({
            url: CONFIG.API_HOST+'/user/'+$routeParams.username,
            method: 'GET'
        })
            .success(function(data, status, headers, config) {
                
                $scope.user = data; // Should log 'foo'
                console.log($scope.user);
            });
    //console.log($scope.user.avatar);

  });
