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
    $scope.profile = {};
    if (AuthenticationService.isLogged) {
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(id).get().then(function(data, status, headers, config) {
            var profile = data;
            delete profile.password;
            $scope.profile = profile;

            $scope.saveProfile = function() {
                $scope.profile.save().then(function() {
                    $location.path($routeParams.username);
                });
            };
        });
    } else {
    	$location.path('/login')
    }
  });
