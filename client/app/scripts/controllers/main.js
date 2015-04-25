'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, AuthenticationService, $location, $window) {
    if (AuthenticationService.isLogged) {
    	$location.path(JSON.parse($window.sessionStorage.user).username);
    }
  });
