'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $http, $window, $location) {
  	$scope.login = {};
  	$scope.message = '';
  	$scope.logIn = function() {
  		$http
  			.post('http://188.226.229.203:3000/login', $scope.login)
  			.success(function(data, status, headers, config) {
  				$window.sessionStorage.token = data.token;
  				$scope.message = 'Welcome';
  				//console.log(data);
  				$location.path("/user/"+data.username);
  			})
  			.error(function(data, status, headers, config) {
  				// Erase the token if the user fails to log in
  				delete $window.sessionStorage.token;

  				$scope.message = 'Invalid username or password';
  			});
  	};

    /*$scope.login = {};
    $scope.logIn = function() {
    	Login.post($scope.login).then(function() {
    		//$scope.login = login;
    		$location.path('/'+$scope.login.id);
    	});
    }*/
  });
