'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserEditCtrl
 * @description
 * # UserEditCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserEditCtrl', function ($scope, $routeParams, $http, User, $window, $location) {
    $scope.viewUser = true;
    $scope.user = {};
    if ($window.sessionStorage.user) {
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(id).get().then(function(data, status, headers, config) {
            $scope.user = data;
            $scope.saveUser = function() {
                $scope.user.save().then(function() {
                    $location.path('/user/'+$routeParams.username);
                });
            };
        });
    } else {
        $location.path('/login');
    }
    /*$scope.user.username = $routeParams.username;
    $http({
            url: 'http://188.226.229.203:3000/user/'+$routeParams.username,
            method: 'GET'
        })
            .success(function(data, status, headers, config) {
                
                $scope.user = data; // Should log 'foo'
                console.log($scope.user);
            });
    //console.log($scope.user.avatar);*/

  });
