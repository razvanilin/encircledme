'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProfileCtrl', function ($scope, $routeParams, User, AuthenticationService, $location, $window) {
    $scope.viewProfile = true;
    $scope.mainLoad = true;
    $scope.profile = {};
    if (AuthenticationService.isLogged) {
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(id).get().then(function(data, status, headers, config) {
            $scope.mainLoad = false;
            var profile = data;
            $scope.profile = profile;

            $scope.saveProfile = function() {
                $scope.loading = true;
                $scope.profile.save().then(function() {
                    $scope.loading = false;
                    $scope.success = "Great! Your profile was updated.";
                }, function(response) {
                    $scope.loading = false;
                    $scope.error = response.data;
                });
            };
        });
    } else {
    	$location.path('/login')
    }
  });
