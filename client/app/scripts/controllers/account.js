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
    $scope.accountLoad = true;
    $scope.password = {};
    if (AuthenticationService.isLogged) {
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(id).get().then(function(data, status, headers, config) {
        	$scope.accountLoad = false;
            var profile = data;
            delete profile.password;

            $scope.password             = profile;
            $scope.password.old         = "";
            $scope.password.new         = "";
            $scope.password.newConfirm  = "";
            $scope.password.error       = {};
            $scope.password.success		= false;
           

            $scope.changePassword = function() {
            	$scope.loading = true;
            	$scope.password.error.old = false;
            	$scope.password.success	= false;
                if ($scope.password.new != $scope.password.newConfirm) {
                    $scope.password.error.new = true;
                } else {
                    $scope.password.error.new = false;
                }

                if (!$scope.password.error.new && $scope.password.new.length > 0) {
                    User.one($scope.password.username).customPUT($scope.password, 'password').then(function(data, status){      
                        $scope.loading = false;
                        $scope.password.success = true;
                    }, function(response) {
                    	$scope.loading = false;
                    	if (response.status === 400) {
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
