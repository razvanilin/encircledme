'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LogoutCtrl', function ($scope, LogOutService, $window, $location) {
    	delete $window.sessionStorage.token;
    	delete $window.sessionStorage.user;
    	$location.path('/');
  });
