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
    $scope.profile = {};
    $scope.password = {};
    if ($window.sessionStorage.user) {
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(id).get().then(function(data, status, headers, config) {
            var profile = data;
            delete profile.password;
            $scope.profile = profile;

            $scope.saveProfile = function() {
                $scope.profile.save().then(function() {
                    $location.path('/user/'+$routeParams.username);
                });
            };

            $scope.password             = profile;
            $scope.password.old         = "";
            $scope.password.new         = "";
            $scope.password.newConfirm  = "";
            $scope.password.error       = false;
           

            $scope.changePassword = function() {
                if ($scope.password.new != $scope.password.newConfirm) {
                    $scope.password.error = true;
                } else {
                    $scope.password.error = false;
                }

                if (!$scope.password.error && $scope.password.new.length > 0) {
                    User.one($scope.password.username).customPUT($scope.password, 'password').then(function(data){
                        if (data.status === 401) {
                            $location.path('/user/'+$routeParams.username+'/edit');
                        }
                        $location.path('/user/'+$routeParams.username);
                    });
                }
            }
            
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
