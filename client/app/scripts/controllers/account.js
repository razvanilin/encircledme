'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AccountCtrl', function ($scope, $window, $routeParams, $location, User, AuthenticationService) {
    $scope.viewAccount = true;
    $scope.password = {};
    if (AuthenticationService.isLogged) {
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(id).get().then(function(data, status, headers, config) {
            var profile = data;
            delete profile.password;

            $scope.password             = profile;
            $scope.password.old         = "";
            $scope.password.new         = "";
            $scope.password.newConfirm  = "";
            $scope.password.error       = {};
            $scope.password.success		= false;
           

            $scope.changePassword = function() {
                if ($scope.password.new != $scope.password.newConfirm) {
                    $scope.password.error.new = true;
                } else {
                    $scope.password.error.new = false;
                }

                if (!$scope.password.error.new && $scope.password.new.length > 0) {
                    User.one($scope.password.username).customPUT($scope.password, 'password').then(function(data, status){      
                        $scope.password.success = true;
                    }, function(response) {
                    	if (response.status === 401) {
                            $scope.password.error.old = true;
                            $scope.password.success	= false;
                        }
                    });
                }
            }
            
        });
    } else {
        $location.path('/login');
    }
  });
