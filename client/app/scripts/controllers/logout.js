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
    $scope.logOut = function logOut() {
    	console.log("yo");
    	//if ($window.sessionStorage.token) {
    		delete $window.sessionStorage.token;
    		$location.path('/');
    	//}
    }
  });
